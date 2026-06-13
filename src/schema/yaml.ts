import yaml from 'js-yaml'
import type { MihomoConfig } from './model'
import { extractUnknownFields, injectUnknownFields } from './unknown-fields'
import { validateConfig } from './validation'

const KNOWN_TOP_KEYS = new Set([
  'mode', 'log-level', 'allow-lan', 'bind-address', 'lan-allowed-ips',
  'lan-disallowed-ips', 'authentication', 'skip-auth-prefixes', 'ipv6',
  'keep-alive-interval', 'keep-alive-idle', 'disable-keep-alive',
  'find-process-mode', 'external-controller', 'external-controller-tls',
  'external-controller-unix', 'external-controller-pipe',
  'external-controller-cors', 'secret', 'external-ui', 'external-ui-name',
  'external-ui-url', 'external-doh-server', 'profile', 'unified-delay',
  'tcp-concurrent', 'interface-name', 'routing-mark', 'tls',
  'geodata-mode', 'geodata-loader', 'geosite-matcher', 'geo-auto-update',
  'geo-update-interval', 'geox-url', 'global-ua', 'etag-support',
  'global-client-fingerprint',
  'port', 'socks-port', 'redir-port', 'tproxy-port', 'mixed-port',
  'inbound-tfo', 'inbound-mptcp', 'tuic-server', 'ss-config', 'vmess-config',
  'dns', 'hosts', 'sniffer', 'tun', 'iptables', 'ebpf',
  'listeners', 'proxies', 'proxy-providers', 'proxy-groups',
  'rule-providers', 'rules', 'sub-rules', 'tunnels', 'ntp', 'experimental',
  'clash-for-android',
])

export function parseYaml(yamlString: string): MihomoConfig {
  const raw = yaml.load(yamlString) as Record<string, unknown> | null
  if (!raw || typeof raw !== 'object') {
    throw new Error('YAML 解析结果不是有效的对象')
  }
  const { known, unknown } = extractUnknownFields(raw, KNOWN_TOP_KEYS)
  const config = known as MihomoConfig
  if (Object.keys(unknown).length > 0) {
    config._unknownFields = unknown
  }

  const validation = validateConfig(raw)
  if (!validation.success) {
    config._validationErrors = validation.errors
  }

  return config
}

export function stringifyYaml(config: MihomoConfig): string {
  const { _unknownFields, ...known } = config
  const output: Record<string, unknown> = { ...known }

  // Remove internal marker
  delete (output as Record<string, unknown>)._unknownFields

  if (_unknownFields) {
    injectUnknownFields(output, _unknownFields)
  }

  return yaml.dump(output, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: false,
    flowLevel: -1,
  })
}

// Field order for deterministic export
const SECTION_ORDER: Array<{ key: string; priority: number }> = [
  // general top-level
  { key: 'mode', priority: 0 },
  { key: 'log-level', priority: 1 },
  { key: 'allow-lan', priority: 2 },
  { key: 'bind-address', priority: 3 },
  { key: 'ipv6', priority: 4 },
  { key: 'find-process-mode', priority: 5 },
  { key: 'external-controller', priority: 6 },
  { key: 'secret', priority: 7 },
  { key: 'profile', priority: 8 },
  { key: 'unified-delay', priority: 9 },
  { key: 'tcp-concurrent', priority: 10 },
  { key: 'interface-name', priority: 11 },
  { key: 'routing-mark', priority: 12 },
  { key: 'tls', priority: 13 },
  { key: 'geodata-mode', priority: 14 },
  { key: 'geo-auto-update', priority: 15 },
  { key: 'dns', priority: 100 },
  { key: 'hosts', priority: 101 },
  { key: 'sniffer', priority: 102 },
  { key: 'tun', priority: 103 },
  { key: 'port', priority: 150 },
  { key: 'socks-port', priority: 151 },
  { key: 'mixed-port', priority: 152 },
  { key: 'listeners', priority: 160 },
  { key: 'proxies', priority: 200 },
  { key: 'proxy-providers', priority: 300 },
  { key: 'proxy-groups', priority: 400 },
  { key: 'rule-providers', priority: 500 },
  { key: 'rules', priority: 600 },
  { key: 'sub-rules', priority: 700 },
  { key: 'tunnels', priority: 800 },
  { key: 'ntp', priority: 900 },
  { key: 'experimental', priority: 1000 },
]

/**
 * Returns a YAML string with sections in recommended order.
 */
export function stringifyYamlOrdered(config: MihomoConfig): string {
  // Use section order to guide key ordering
  const { _unknownFields, ...known } = config

  const orderMap = new Map<number, Array<[string, unknown]>>()
  const unattached: Array<[string, unknown]> = []

  for (const [key, value] of Object.entries(known)) {
    if (key.startsWith('_')) continue
    if (value === undefined || value === null) continue
    // Skip empty arrays and objects
    if (Array.isArray(value) && value.length === 0) continue
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).length === 0) continue

    const section = SECTION_ORDER.find((s) => s.key === key)
    if (section) {
      const list = orderMap.get(section.priority) || []
      list.push([key, value])
      orderMap.set(section.priority, list)
    } else {
      unattached.push([key, value])
    }
  }

  // Build ordered entries
  const ordered: Array<[string, unknown]> = []
  for (let prio = 0; prio <= 2000; prio++) {
    const items = orderMap.get(prio)
    if (items) {
      ordered.push(...items)
    }
  }
  ordered.push(...unattached)

  const output: Record<string, unknown> = {}
  for (const [key, value] of ordered) {
    output[key] = value
  }

  if (_unknownFields) {
    injectUnknownFields(output, _unknownFields)
  }

  return yaml.dump(output, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: false,
    flowLevel: -1,
  })
}

/**
 * Deep clone a config object (JSON-safe values only).
 */
export function cloneConfig(config: MihomoConfig): MihomoConfig {
  return JSON.parse(JSON.stringify(config))
}
