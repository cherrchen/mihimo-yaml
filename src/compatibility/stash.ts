import type { MihomoConfig, DnsConfig } from '@/schema/model'

export interface CompatibilityIssue {
  field: string
  path: string
  severity: 'error' | 'warning' | 'info'
  message: string
  action: 'remove' | 'warn' | 'transform' | 'block' | 'manual'
}

export interface CompatibilityReport {
  mode: 'mihomo' | 'stash'
  issues: CompatibilityIssue[]
  transformedConfig: MihomoConfig
  summary: {
    removed: number
    warnings: number
    errors: number
    transformed: number
  }
}

/**
 * Fields to remove when exporting to Stash.
 */
const STASH_REMOVE_FIELDS = new Set([
  'allow-lan', 'bind-address', 'lan-allowed-ips', 'lan-disallowed-ips',
  'authentication', 'skip-auth-prefixes', 'ipv6',
  'keep-alive-interval', 'keep-alive-idle', 'disable-keep-alive',
  'find-process-mode', 'external-controller', 'external-controller-tls',
  'external-controller-unix', 'external-controller-pipe',
  'external-controller-cors', 'secret', 'external-ui', 'external-ui-name',
  'external-ui-url', 'external-doh-server',
  'profile', 'unified-delay', 'tcp-concurrent',
  'geodata-mode', 'geodata-loader', 'geosite-matcher',
  'geo-auto-update', 'geo-update-interval', 'geox-url',
  'global-ua', 'global-client-fingerprint',
  'port', 'socks-port', 'redir-port', 'tproxy-port', 'mixed-port',
  'inbound-tfo', 'inbound-mptcp',
  'tun', 'sniffer', 'ebpf', 'iptables',
  'listeners', 'tuic-server', 'ss-config', 'vmess-config',
  'sub-rules', 'tunnels',
  'clash-for-android',
])

/**
 * DNS fields to remove or transform for Stash.
 */
const STASH_DNS_REMOVE_FIELDS = new Set([
  'cache-algorithm', 'cache-max-size', 'ipv6', 'ipv6-timeout',
  'enhanced-mode', 'fake-ip-range', 'fake-ip-range6',
  'fake-ip-filter-mode', 'fake-ip-ttl',
  'use-hosts', 'use-system-hosts',
  'proxy-server-nameserver', 'proxy-server-nameserver-policy',
  'direct-nameserver', 'direct-nameserver-follow-policy',
  'fallback', 'fallback-filter',
])

// sub-rules is special: must report error before removal
const STASH_REMOVE_FIELDS_WITHOUT_SUB_RULES = new Set(
  [...STASH_REMOVE_FIELDS].filter((k) => k !== 'sub-rules'),
)

/**
 * Generates a Stash compatibility report for the given mihomo config.
 */
export function generateStashReport(config: MihomoConfig): CompatibilityReport {
  const issues: CompatibilityIssue[] = []
  const transformed = JSON.parse(JSON.stringify(config)) as MihomoConfig

  // Check sub-rules before it gets removed
  if (transformed['sub-rules']) {
    issues.push({
      field: 'sub-rules',
      path: 'sub-rules',
      severity: 'error',
      message: 'Stash 不支持 sub-rules',
      action: 'block',
    })
  }

  // Check top-level fields
  for (const key of STASH_REMOVE_FIELDS_WITHOUT_SUB_RULES) {
    if (key in transformed) {
      issues.push({
        field: key,
        path: key,
        severity: 'warning',
        message: `Stash 不支持字段 '${key}'，已被移除`,
        action: 'remove',
      })
      delete (transformed as Record<string, unknown>)[key]
    }
  }

  // Transform DNS
  if (transformed.dns) {
    const dnsIssues = transformDnsForStash(transformed.dns)
    issues.push(...dnsIssues)
  }

  // Check proxy types
  if (transformed.proxies) {
    for (const proxy of transformed.proxies) {
      // Stash supports tailscale, trusttunnel, anytls (note: these are Stash-exclusive, mihomo may not have them)
      // mihomo has direct, dns, reject, reject-drop, compatible, pass types that Stash might not support
      if (proxy.type === 'sudoku' || proxy.type === 'mieru' || proxy.type === 'openvpn' || proxy.type === 'masque') {
        issues.push({
          field: `proxies.${proxy.name}`,
          path: `proxies[${proxy.name}]`,
          severity: 'error',
          message: `Stash 不支持代理类型 '${proxy.type}' (${proxy.name})`,
          action: 'block',
        })
      }
    }
  }

  // Check rule types that Stash doesn't support
  if (transformed.rules) {
    const stashUnsupportedRulePrefixes = [
      'PROCESS-NAME-REGEX,', 'SRC-IP-CIDR,', 'SRC-PORT,',
      'IN-PORT,', 'IN-TYPE,', 'SUB-RULE,',
    ]
    for (const rule of transformed.rules) {
      for (const prefix of stashUnsupportedRulePrefixes) {
        if (rule.startsWith(prefix)) {
          issues.push({
            field: 'rules',
            path: `rules`,
            severity: 'error',
            message: `Stash 不支持规则类型 '${prefix.split(',')[0]}': ${rule}`,
            action: 'block',
          })
        }
      }
    }
  }

  const summary = {
    removed: issues.filter((i) => i.action === 'remove').length,
    warnings: issues.filter((i) => i.severity === 'warning').length,
    errors: issues.filter((i) => i.severity === 'error').length,
    transformed: issues.filter((i) => i.action === 'transform').length,
  }

  return {
    mode: 'stash',
    issues,
    transformedConfig: transformed,
    summary,
  }
}

/**
 * Transforms DNS config for Stash compatibility.
 */
function transformDnsForStash(dns: DnsConfig): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []

  // Remove unsupported fields
  for (const key of Object.keys(dns) as Array<keyof DnsConfig>) {
    if (STASH_DNS_REMOVE_FIELDS.has(key)) {
      issues.push({
        field: key,
        path: `dns.${key}`,
        severity: 'warning',
        message: `Stash DNS 不支持 '${key}'，已被移除`,
        action: 'remove',
      })
      delete dns[key]
    }
  }

  // Handle nameserver-policy: Stash may support array values but our spec says
  // we should handle the case where user wants single-server export.
  // We'll detect multi-server policies and issue warnings.
  if (dns['nameserver-policy']) {
    const policy = dns['nameserver-policy']
    const multiServerKeys: string[] = []

    for (const [domain, servers] of Object.entries(policy)) {
      if (Array.isArray(servers) && servers.length > 1) {
        multiServerKeys.push(domain)
      }
    }

    if (multiServerKeys.length > 0) {
      issues.push({
        field: 'nameserver-policy',
        path: 'dns.nameserver-policy',
        severity: 'warning',
        message: `DNS nameserver-policy 中有 ${multiServerKeys.length} 个条目包含多个 DNS 服务器 (${multiServerKeys.join(', ')})。Stash 可能支持数组，但建议检查兼容性。`,
        action: 'warn',
      })
    }
  }

  // Add follow-rule if respect-rules was set
  if (dns['respect-rules']) {
    dns['follow-rule' as keyof DnsConfig] = true as never
    delete dns['respect-rules']
    issues.push({
      field: 'respect-rules',
      path: 'dns.respect-rules',
      severity: 'info',
      message: "已转换为 Stash 的 'follow-rule'",
      action: 'transform',
    })
  }

  return issues
}

/**
 * Generates a mihomo full-mode report (basically just validates).
 */
export function generateMihomoReport(config: MihomoConfig): CompatibilityReport {
  const issues: CompatibilityIssue[] = []

  // Check deprecated fields
  const deprecatedFields = ['global-client-fingerprint']
  for (const key of deprecatedFields) {
    if (key in config) {
      issues.push({
        field: key,
        path: key,
        severity: 'warning',
        message: `'${key}' 已弃用，建议迁移到 proxy 级别的 'client-fingerprint'`,
        action: 'warn',
      })
    }
  }

  return {
    mode: 'mihomo',
    issues,
    transformedConfig: JSON.parse(JSON.stringify(config)),
    summary: { removed: 0, warnings: issues.length, errors: 0, transformed: 0 },
  }
}
