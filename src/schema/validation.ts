import { z } from 'zod'
import type { MihomoConfig } from './model'

const ExternalControllerCorsSchema = z.object({
  'allow-origins': z.array(z.string()).optional(),
  'allow-private-network': z.boolean().optional(),
}).passthrough()

const ProfileConfigSchema = z.object({
  'store-selected': z.boolean().optional(),
  'store-fake-ip': z.boolean().optional(),
}).passthrough()

const TlsConfigSchema = z.object({
  certificate: z.string().optional(),
  'private-key': z.string().optional(),
  'ech-key': z.string().optional(),
  'client-auth-type': z.string().optional(),
  'client-auth-cert': z.string().optional(),
  'custom-certificates': z.array(z.string()).optional(),
}).passthrough()

const GeoXUrlSchema = z.object({
  geoip: z.string().optional(),
  geosite: z.string().optional(),
  mmdb: z.string().optional(),
  asn: z.string().optional(),
}).passthrough()

const ClashForAndroidSchema = z.object({
  'append-system-dns': z.boolean().optional(),
  'ui-subtitle-pattern': z.string().optional(),
}).passthrough()

const FallbackFilterSchema = z.object({
  geoip: z.boolean().optional(),
  'geoip-code': z.string().optional(),
  geosite: z.array(z.string()).optional(),
  ipcidr: z.array(z.string()).optional(),
  domain: z.array(z.string()).optional(),
}).passthrough()

const ProtocolSniffConfigSchema = z.object({
  ports: z.array(z.string()).optional(),
  'override-destination': z.boolean().optional(),
}).passthrough()

const SnifferConfigSchema = z.object({
  enable: z.boolean().optional(),
  'override-destination': z.boolean().optional(),
  'force-dns-mapping': z.boolean().optional(),
  'parse-pure-ip': z.boolean().optional(),
  sniffing: z.array(z.string()).optional(),
  sniff: z.record(z.string(), ProtocolSniffConfigSchema).optional(),
  'force-domain': z.array(z.string()).optional(),
  'skip-domain': z.array(z.string()).optional(),
  'skip-src-address': z.array(z.string()).optional(),
  'skip-dst-address': z.array(z.string()).optional(),
  'port-whitelist': z.array(z.string()).optional(),
}).passthrough()

const TunConfigSchema = z.object({
  enable: z.boolean().optional(),
  stack: z.string().optional(),
  device: z.string().optional(),
  'auto-route': z.boolean().optional(),
  'auto-redirect': z.boolean().optional(),
  'auto-detect-interface': z.boolean().optional(),
  'dns-hijack': z.array(z.string()).optional(),
  'strict-route': z.boolean().optional(),
}).passthrough()

const IptablesConfigSchema = z.object({
  enable: z.boolean().optional(),
  'inbound-interface': z.string().optional(),
  bypass: z.array(z.string()).optional(),
  'dns-redirect': z.boolean().optional(),
}).passthrough()

const VmessUserSchema = z.object({
  username: z.string().optional(),
  uuid: z.string(),
  alterId: z.number().optional(),
}).passthrough()

const ListenerConfigSchema = z.object({
  name: z.string(),
  type: z.string(),
  port: z.number().optional(),
  listen: z.string().optional(),
  proxy: z.string().optional(),
  rule: z.string().optional(),
  udp: z.boolean().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  cipher: z.string().optional(),
  users: z.array(VmessUserSchema).optional(),
  'tproxy-tcp': z.boolean().optional(),
  'tproxy-udp': z.boolean().optional(),
  token: z.array(z.string()).optional(),
  certificate: z.string().optional(),
  'private-key': z.string().optional(),
  'congestion-controller': z.string().optional(),
  'max-idle-time': z.number().optional(),
  'authentication-timeout': z.number().optional(),
  alpn: z.array(z.string()).optional(),
  'max-udp-relay-packet-size': z.number().optional(),
  network: z.array(z.string()).optional(),
  target: z.string().optional(),
  'auto-route': z.boolean().optional(),
  'route-address': z.array(z.string()).optional(),
}).passthrough()

const SmuxConfigSchema = z.object({
  enabled: z.boolean().optional(),
  protocol: z.string().optional(),
  'max-connections': z.number().optional(),
  'min-streams': z.number().optional(),
  'max-streams': z.number().optional(),
  statistic: z.boolean().optional(),
  'only-tcp': z.boolean().optional(),
  padding: z.boolean().optional(),
  'brutal-opts': z.object({
    enabled: z.boolean().optional(),
    up: z.number().optional(),
    down: z.number().optional(),
  }).passthrough().optional(),
}).passthrough()

const ProxyConfigSchema = z.object({
  name: z.string(),
  type: z.string(),
  server: z.string().optional(),
  port: z.number().optional(),
  'ip-version': z.string().optional(),
  udp: z.boolean().optional(),
  'interface-name': z.string().optional(),
  'routing-mark': z.number().optional(),
  tfo: z.boolean().optional(),
  mptcp: z.boolean().optional(),
  'dialer-proxy': z.string().optional(),
  smux: SmuxConfigSchema.optional(),
  tls: z.boolean().optional(),
  sni: z.string().optional(),
  servername: z.string().optional(),
  fingerprint: z.string().optional(),
  alpn: z.array(z.string()).optional(),
  'skip-cert-verify': z.boolean().optional(),
  certificate: z.string().optional(),
  'private-key': z.string().optional(),
  'client-fingerprint': z.string().optional(),
  network: z.string().optional(),
  cipher: z.string().optional(),
  password: z.string().optional(),
  'udp-over-tcp': z.boolean().optional(),
  'udp-over-tcp-version': z.number().optional(),
  plugin: z.string().optional(),
  protocol: z.string().optional(),
  'protocol-param': z.string().optional(),
  obfs: z.string().optional(),
  'obfs-param': z.string().optional(),
  psk: z.string().optional(),
  username: z.string().optional(),
  headers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  uuid: z.string().optional(),
  alterId: z.number().optional(),
  security: z.string().optional(),
  flow: z.string().optional(),
  encryption: z.string().optional(),
  'packet-encoding': z.string().optional(),
  up: z.string().optional(),
  down: z.string().optional(),
  auth: z.string().optional(),
  'auth-str': z.string().optional(),
  'obfs-password': z.string().optional(),
  'disable-mtu-discovery': z.boolean().optional(),
  'disable-sni': z.boolean().optional(),
  'reduce-rtt': z.boolean().optional(),
  'heartbeat-interval': z.number().optional(),
  'max-open-streams': z.number().optional(),
  version: z.number().optional(),
  'congestion-controller': z.string().optional(),
  'max-udp-relay-packet-size': z.number().optional(),
  token: z.array(z.string()).optional(),
  users: z.record(z.string(), z.string()).optional(),
  ip: z.string().optional(),
  ipv6: z.string().optional(),
  'public-key': z.string().optional(),
  'pre-shared-key': z.string().optional(),
  'allowed-ips': z.array(z.string()).optional(),
  reserved: z.union([z.array(z.number()), z.string()]).optional(),
  'persistent-keepalive': z.number().optional(),
  mtu: z.number().optional(),
  'remote-dns-resolve': z.boolean().optional(),
  dns: z.array(z.string()).optional(),
  'host-key': z.array(z.string()).optional(),
  'host-key-algorithms': z.array(z.string()).optional(),
  cwnd: z.number().optional(),
  ports: z.string().optional(),
  ca: z.string().optional(),
  'ca-str': z.string().optional(),
  'recv-window-conn': z.number().optional(),
  'recv-window': z.number().optional(),
  protocolHysteria: z.string().optional(),
}).passthrough()

const ProxyProviderConfigSchema = z.object({
  type: z.string(),
  url: z.string().optional(),
  path: z.string().optional(),
  interval: z.number().optional(),
  proxy: z.string().optional(),
  'size-limit': z.number().optional(),
  'age-secret-key': z.string().optional(),
  header: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  filter: z.string().optional(),
  'exclude-filter': z.string().optional(),
  'exclude-type': z.string().optional(),
  payload: z.array(ProxyConfigSchema).optional(),
  'health-check': z.object({
    enable: z.boolean().optional(),
    url: z.string().optional(),
    interval: z.number().optional(),
    timeout: z.number().optional(),
    lazy: z.boolean().optional(),
    'expected-status': z.string().optional(),
  }).passthrough().optional(),
  override: z.object({
    tfo: z.boolean().optional(),
    mptcp: z.boolean().optional(),
    udp: z.boolean().optional(),
    'udp-over-tcp': z.boolean().optional(),
    down: z.string().optional(),
    up: z.string().optional(),
    'skip-cert-verify': z.boolean().optional(),
    'dialer-proxy': z.string().optional(),
    'interface-name': z.string().optional(),
    'routing-mark': z.number().optional(),
    'ip-version': z.string().optional(),
    'additional-prefix': z.string().optional(),
    'additional-suffix': z.string().optional(),
    'proxy-name': z.array(z.object({
      pattern: z.string(),
      target: z.string(),
    }).passthrough()).optional(),
  }).passthrough().optional(),
}).passthrough()

const ProxyGroupConfigSchema = z.object({
  name: z.string(),
  type: z.string(),
  proxies: z.array(z.string()).optional(),
  use: z.array(z.string()).optional(),
  url: z.string().optional(),
  interval: z.number().optional(),
  lazy: z.boolean().optional(),
  'empty-fallback': z.string().optional(),
  timeout: z.number().optional(),
  'max-failed-times': z.number().optional(),
  'disable-udp': z.boolean().optional(),
  'interface-name': z.string().optional(),
  'routing-mark': z.number().optional(),
  'include-all': z.boolean().optional(),
  'include-all-proxies': z.boolean().optional(),
  'include-all-providers': z.boolean().optional(),
  filter: z.string().optional(),
  'exclude-filter': z.string().optional(),
  'exclude-type': z.string().optional(),
  'expected-status': z.string().optional(),
  hidden: z.boolean().optional(),
  icon: z.string().optional(),
  tolerance: z.number().optional(),
  strategy: z.string().optional(),
}).passthrough()

const RuleProviderConfigSchema = z.object({
  type: z.string(),
  url: z.string().optional(),
  path: z.string().optional(),
  interval: z.number().optional(),
  proxy: z.string().optional(),
  behavior: z.string().optional(),
  format: z.string().optional(),
  'path-in-bundle': z.string().optional(),
  'size-limit': z.number().optional(),
  header: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  payload: z.array(z.string()).optional(),
}).passthrough()

const TunnelConfigSchema = z.object({
  network: z.array(z.string()).optional(),
  address: z.string().optional(),
  target: z.string().optional(),
  proxy: z.string().optional(),
}).passthrough()

const NtpConfigSchema = z.object({
  enable: z.boolean().optional(),
  'write-to-system': z.boolean().optional(),
  server: z.string().optional(),
  port: z.number().optional(),
  interval: z.number().optional(),
  'dialer-proxy': z.string().optional(),
}).passthrough()

const ExperimentalConfigSchema = z.object({
  'quic-go-disable-gso': z.boolean().optional(),
  'quic-go-disable-ecn': z.boolean().optional(),
  'dialer-ip4p-convert': z.boolean().optional(),
  fingerprints: z.array(z.string()).optional(),
}).passthrough()

const DnsConfigSchema = z.object({
  enable: z.boolean().optional(),
  'cache-algorithm': z.string().optional(),
  'cache-max-size': z.number().optional(),
  'prefer-h3': z.boolean().optional(),
  listen: z.string().optional(),
  ipv6: z.boolean().optional(),
  'ipv6-timeout': z.number().optional(),
  'enhanced-mode': z.string().optional(),
  'fake-ip-range': z.string().optional(),
  'fake-ip-range6': z.string().optional(),
  'fake-ip-filter': z.array(z.string()).optional(),
  'fake-ip-filter-mode': z.string().optional(),
  'fake-ip-ttl': z.number().optional(),
  'use-hosts': z.boolean().optional(),
  'use-system-hosts': z.boolean().optional(),
  'respect-rules': z.boolean().optional(),
  'default-nameserver': z.array(z.string()).optional(),
  nameserver: z.array(z.string()).optional(),
  'nameserver-policy': z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  'proxy-server-nameserver': z.array(z.string()).optional(),
  'proxy-server-nameserver-policy': z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  'direct-nameserver': z.array(z.string()).optional(),
  'direct-nameserver-follow-policy': z.boolean().optional(),
  fallback: z.array(z.string()).optional(),
  'fallback-filter': FallbackFilterSchema.optional(),
}).passthrough()

export const MihomoConfigSchema = z.object({
  mode: z.string().optional(),
  'log-level': z.string().optional(),
  'allow-lan': z.boolean().optional(),
  'bind-address': z.string().optional(),
  'lan-allowed-ips': z.array(z.string()).optional(),
  'lan-disallowed-ips': z.array(z.string()).optional(),
  authentication: z.array(z.string()).optional(),
  'skip-auth-prefixes': z.array(z.string()).optional(),
  ipv6: z.boolean().optional(),
  'keep-alive-interval': z.number().optional(),
  'keep-alive-idle': z.number().optional(),
  'disable-keep-alive': z.boolean().optional(),
  'find-process-mode': z.string().optional(),
  'external-controller': z.string().optional(),
  'external-controller-tls': z.string().optional(),
  'external-controller-unix': z.string().optional(),
  'external-controller-pipe': z.string().optional(),
  'external-controller-cors': ExternalControllerCorsSchema.optional(),
  secret: z.string().optional(),
  'external-ui': z.string().optional(),
  'external-ui-name': z.string().optional(),
  'external-ui-url': z.string().optional(),
  'external-doh-server': z.string().optional(),
  profile: ProfileConfigSchema.optional(),
  'unified-delay': z.boolean().optional(),
  'tcp-concurrent': z.boolean().optional(),
  'interface-name': z.string().optional(),
  'routing-mark': z.number().optional(),
  tls: TlsConfigSchema.optional(),
  'geodata-mode': z.boolean().optional(),
  'geodata-loader': z.string().optional(),
  'geosite-matcher': z.string().optional(),
  'geo-auto-update': z.boolean().optional(),
  'geo-update-interval': z.number().optional(),
  'geox-url': GeoXUrlSchema.optional(),
  'global-ua': z.string().optional(),
  'etag-support': z.boolean().optional(),
  'global-client-fingerprint': z.string().optional(),
  port: z.number().optional(),
  'socks-port': z.number().optional(),
  'redir-port': z.number().optional(),
  'tproxy-port': z.number().optional(),
  'mixed-port': z.number().optional(),
  'inbound-tfo': z.boolean().optional(),
  'inbound-mptcp': z.boolean().optional(),
  'tuic-server': z.object({}).passthrough().optional(),
  'ss-config': z.string().optional(),
  'vmess-config': z.string().optional(),
  dns: DnsConfigSchema.optional(),
  hosts: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  sniffer: SnifferConfigSchema.optional(),
  tun: TunConfigSchema.optional(),
  iptables: IptablesConfigSchema.optional(),
  ebpf: z.object({
    enable: z.boolean().optional(),
    'auto-redir': z.array(z.string()).optional(),
    'redirect-to-tun': z.array(z.string()).optional(),
    'bpf-fs-path': z.string().optional(),
  }).passthrough().optional(),
  listeners: z.array(ListenerConfigSchema).optional(),
  proxies: z.array(ProxyConfigSchema).optional(),
  'proxy-providers': z.record(z.string(), ProxyProviderConfigSchema).optional(),
  'proxy-groups': z.array(ProxyGroupConfigSchema).optional(),
  'rule-providers': z.record(z.string(), RuleProviderConfigSchema).optional(),
  rules: z.array(z.string()).optional(),
  'sub-rules': z.record(z.string(), z.array(z.string())).optional(),
  tunnels: z.array(TunnelConfigSchema).optional(),
  ntp: NtpConfigSchema.optional(),
  experimental: ExperimentalConfigSchema.optional(),
  'clash-for-android': ClashForAndroidSchema.optional(),
}).passthrough()

export interface ValidationError {
  path: string
  message: string
}

export interface ValidationResult {
  success: boolean
  errors: ValidationError[]
}

function flattenZodErrors(zodError: z.ZodError, basePath = ''): ValidationError[] {
  const errors: ValidationError[] = []
  for (const issue of zodError.issues) {
    const path = issue.path.length > 0
      ? [basePath, ...issue.path.map(String)].filter(Boolean).join('.')
      : basePath || '(root)'
    errors.push({
      path,
      message: issue.message,
    })
  }
  return errors
}

export function validateConfig(raw: Record<string, unknown>): ValidationResult {
  const result = MihomoConfigSchema.safeParse(raw)
  if (result.success) {
    return { success: true, errors: [] }
  }
  return {
    success: false,
    errors: flattenZodErrors(result.error),
  }
}

export type { MihomoConfig }
