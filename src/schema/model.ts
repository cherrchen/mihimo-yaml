// === Top-level MihomoConfig ===

export interface MihomoConfig {
  // general
  mode?: string
  'log-level'?: string
  'allow-lan'?: boolean
  'bind-address'?: string
  'lan-allowed-ips'?: string[]
  'lan-disallowed-ips'?: string[]
  authentication?: string[]
  'skip-auth-prefixes'?: string[]
  ipv6?: boolean
  'keep-alive-interval'?: number
  'keep-alive-idle'?: number
  'disable-keep-alive'?: boolean
  'find-process-mode'?: string
  'external-controller'?: string
  'external-controller-tls'?: string
  'external-controller-unix'?: string
  'external-controller-pipe'?: string
  'external-controller-cors'?: ExternalControllerCors
  secret?: string
  'external-ui'?: string
  'external-ui-name'?: string
  'external-ui-url'?: string
  'external-doh-server'?: string
  profile?: ProfileConfig
  'unified-delay'?: boolean
  'tcp-concurrent'?: boolean
  'interface-name'?: string
  'routing-mark'?: number
  tls?: TlsConfig
  'geodata-mode'?: boolean
  'geodata-loader'?: string
  'geosite-matcher'?: string
  'geo-auto-update'?: boolean
  'geo-update-interval'?: number
  'geox-url'?: GeoXUrl
  'global-ua'?: string
  'etag-support'?: boolean
  'global-client-fingerprint'?: string

  // legacy inbound
  port?: number
  'socks-port'?: number
  'redir-port'?: number
  'tproxy-port'?: number
  'mixed-port'?: number
  'inbound-tfo'?: boolean
  'inbound-mptcp'?: boolean
  'tuic-server'?: TuicServerConfig
  'ss-config'?: string
  'vmess-config'?: string

  // sections
  dns?: DnsConfig
  hosts?: Record<string, string | string[]>
  sniffer?: SnifferConfig
  tun?: TunConfig
  iptables?: IptablesConfig
  ebpf?: EbpfConfig
  listeners?: ListenerConfig[]
  proxies?: ProxyConfig[]
  'proxy-providers'?: Record<string, ProxyProviderConfig>
  'proxy-groups'?: ProxyGroupConfig[]
  'rule-providers'?: Record<string, RuleProviderConfig>
  rules?: string[]
  'sub-rules'?: Record<string, string[]>
  tunnels?: TunnelConfig[]
  ntp?: NtpConfig
  experimental?: ExperimentalConfig
  'clash-for-android'?: ClashForAndroidConfig

  // unknown fields preservation
  _unknownFields?: Record<string, unknown>
  // Zod validation errors from import
  _validationErrors?: Array<{ path: string; message: string }>
  // YAML comment preservation
  _comments?: Record<string, string[]>
}

// === General Sub-configs ===

export interface ExternalControllerCors {
  'allow-origins'?: string[]
  'allow-private-network'?: boolean
}

export interface ProfileConfig {
  'store-selected'?: boolean
  'store-fake-ip'?: boolean
}

export interface TlsConfig {
  certificate?: string
  'private-key'?: string
  'ech-key'?: string
  'client-auth-type'?: string
  'client-auth-cert'?: string
  'custom-certificates'?: string[]
}

export interface GeoXUrl {
  geoip?: string
  geosite?: string
  mmdb?: string
  asn?: string
}

export interface ClashForAndroidConfig {
  'append-system-dns'?: boolean
  'ui-subtitle-pattern'?: string
}

// === DNS ===

export interface DnsConfig {
  enable?: boolean
  'cache-algorithm'?: string
  'cache-max-size'?: number
  'prefer-h3'?: boolean
  listen?: string
  ipv6?: boolean
  'ipv6-timeout'?: number
  'enhanced-mode'?: string
  'fake-ip-range'?: string
  'fake-ip-range6'?: string
  'fake-ip-filter'?: string[]
  'fake-ip-filter-mode'?: string
  'fake-ip-ttl'?: number
  'use-hosts'?: boolean
  'use-system-hosts'?: boolean
  'respect-rules'?: boolean
  'default-nameserver'?: string[]
  nameserver?: string[]
  'nameserver-policy'?: Record<string, string | string[]>
  'proxy-server-nameserver'?: string[]
  'proxy-server-nameserver-policy'?: Record<string, string | string[]>
  'direct-nameserver'?: string[]
  'direct-nameserver-follow-policy'?: boolean
  fallback?: string[]
  'fallback-filter'?: FallbackFilter
}

export interface FallbackFilter {
  geoip?: boolean
  'geoip-code'?: string
  geosite?: string[]
  ipcidr?: string[]
  domain?: string[]
}

// === Sniffer ===

export interface SnifferConfig {
  enable?: boolean
  'override-destination'?: boolean
  'force-dns-mapping'?: boolean
  'parse-pure-ip'?: boolean
  sniffing?: string[]
  sniff?: Record<string, ProtocolSniffConfig>
  'force-domain'?: string[]
  'skip-domain'?: string[]
  'skip-src-address'?: string[]
  'skip-dst-address'?: string[]
  'port-whitelist'?: string[]
}

export interface ProtocolSniffConfig {
  ports?: string[]
  'override-destination'?: boolean
}

// === TUN ===

export interface TunConfig {
  enable?: boolean
  stack?: string
  device?: string
  'auto-route'?: boolean
  'auto-redirect'?: boolean
  'auto-detect-interface'?: boolean
  'dns-hijack'?: string[]
  'strict-route'?: boolean
  mtu?: number
  gso?: boolean
  'gso-max-size'?: number
  'inet6-address'?: string[]
  'udp-timeout'?: number
  'iproute2-table-index'?: number
  'iproute2-rule-index'?: number
  'endpoint-independent-nat'?: boolean
  'route-address'?: string[]
  'route-address-set'?: string[]
  'route-exclude-address'?: string[]
  'route-exclude-address-set'?: string[]
  'include-interface'?: string[]
  'exclude-interface'?: string[]
  'include-uid'?: number[]
  'include-uid-range'?: string[]
  'exclude-uid'?: number[]
  'exclude-uid-range'?: string[]
  'include-android-user'?: number[]
  'include-package'?: string[]
  'exclude-package'?: string[]
  'include-mac-address'?: string[]
  'exclude-mac-address'?: string[]
  'exclude-src-port'?: number[]
  'exclude-src-port-range'?: string[]
  'exclude-dst-port'?: number[]
  'exclude-dst-port-range'?: string[]
  'disable-icmp-forwarding'?: boolean
  'file-descriptor'?: number
  'auto-redirect-input-mark'?: number
  'auto-redirect-output-mark'?: number
  'auto-redirect-iproute2-fallback-rule-index'?: number
  'loopback-address'?: string[]
  recvmsgx?: boolean
  sendmsgx?: boolean
  // deprecated
  'inet4-route-address'?: string[]
  'inet6-route-address'?: string[]
  'inet4-route-exclude-address'?: string[]
  'inet6-route-exclude-address'?: string[]
}

// === iptables ===

export interface IptablesConfig {
  enable?: boolean
  'inbound-interface'?: string
  bypass?: string[]
  'dns-redirect'?: boolean
}

// === ebpf ===

export interface EbpfConfig {
  enable?: boolean
  'auto-redir'?: string[]
  'redirect-to-tun'?: string[]
  'bpf-fs-path'?: string
}

// === Inbounds / Listeners ===

export interface ListenerConfig {
  name: string
  type: string
  port?: number
  listen?: string
  proxy?: string
  rule?: string
  udp?: boolean
  // socks/http/mixed/redir/tproxy
  username?: string
  password?: string
  // shadowsocks
  cipher?: string
  // vmess
  users?: VmessUser[]
  // tproxy
  'tproxy-tcp'?: boolean
  'tproxy-udp'?: boolean
  // tuic
  token?: string[]
  certificate?: string
  'private-key'?: string
  'congestion-controller'?: string
  'max-idle-time'?: number
  'authentication-timeout'?: number
  alpn?: string[]
  'max-udp-relay-packet-size'?: number
  // tunnel
  network?: string[]
  target?: string
  // tun
  // see TunConfig
  'auto-route'?: boolean
  'route-address'?: string[]
  // unknown
  _unknownFields?: Record<string, unknown>
}

export interface VmessUser {
  username?: string
  uuid: string
  alterId?: number
}

// === Tuic Server ===

export interface TuicServerConfig {
  enable?: boolean
  listen?: string
  token?: string[]
  users?: Record<string, string>
  certificate?: string
  'private-key'?: string
  'congestion-controller'?: string
  'max-idle-time'?: number
  'authentication-timeout'?: number
  alpn?: string[]
  'max-udp-relay-packet-size'?: number
  cwnd?: number
}

// === Proxies ===

export interface ProxyConfig {
  name: string
  type: string
  server?: string
  port?: number
  'ip-version'?: string
  udp?: boolean
  'interface-name'?: string
  'routing-mark'?: number
  tfo?: boolean
  mptcp?: boolean
  'dialer-proxy'?: string
  smux?: SmuxConfig
  // TLS shared
  tls?: boolean
  sni?: string
  servername?: string
  fingerprint?: string
  alpn?: string[]
  'skip-cert-verify'?: boolean
  certificate?: string
  'private-key'?: string
  'client-fingerprint'?: string
  'reality-opts'?: RealityOpts
  'ech-opts'?: EchOpts
  // transport
  network?: string
  'http-opts'?: HttpOpts
  'h2-opts'?: H2Opts
  'grpc-opts'?: GrpcOpts
  'ws-opts'?: WsOpts
  // ss
  cipher?: string
  password?: string
  'udp-over-tcp'?: boolean
  'udp-over-tcp-version'?: number
  plugin?: string
  'plugin-opts'?: PluginOpts
  // ssr
  protocol?: string
  'protocol-param'?: string
  obfs?: string
  'obfs-param'?: string
  // snell
  psk?: string
  'obfs-opts'?: Record<string, unknown>
  // http
  username?: string
  headers?: Record<string, string | string[]>
  // vmess
  uuid?: string
  alterId?: number
  security?: string
  // vless
  flow?: string
  encryption?: string
  'xhttp-opts'?: XHttpOpts
  'packet-encoding'?: string
  // trojan
  'ss-opts'?: SsOpts
  // hysteria
  up?: string
  down?: string
  auth?: string
  'auth-str'?: string
  'obfs-password'?: string
  protocolHysteria?: string
  ca?: string
  'ca-str'?: string
  'disable-mtu-discovery'?: boolean
  'recv-window-conn'?: number
  'recv-window'?: number
  ports?: string
  // hysteria2
  cwnd?: number
  // tuic
  version?: number
  token?: string[]
  users?: Record<string, string>
  'congestion-controller'?: string
  'max-udp-relay-packet-size'?: number
  'reduce-rtt'?: boolean
  'heartbeat-interval'?: number
  'disable-sni'?: boolean
  'max-open-streams'?: number
  // wireguard
  ip?: string
  ipv6?: string
  'public-key'?: string
  'pre-shared-key'?: string
  'allowed-ips'?: string[]
  reserved?: number[] | string
  'persistent-keepalive'?: number
  mtu?: number
  'remote-dns-resolve'?: boolean
  dns?: string[]
  'amnezia-wg-option'?: Record<string, unknown>
  peers?: WireGuardPeer[]
  // ssh
  'host-key'?: string[]
  'host-key-algorithms'?: string[]
  // openvpn
  'openvpn-opts'?: Record<string, unknown>
  // unknown
  _unknownFields?: Record<string, unknown>
}

// === Proxy discriminated union types for type-safe editing ===

export type ProxyType =
  | 'ss' | 'ssr' | 'http' | 'socks' | 'vmess' | 'vless' | 'trojan'
  | 'snell' | 'hysteria' | 'hysteria2' | 'tuic' | 'wireguard' | 'ssh'
  | 'anytls' | 'mieru' | 'sudoku' | 'tailscale' | 'masque'
  | 'trusttunnel' | 'openvpn' | 'direct' | 'dns'
  | 'reject' | 'reject-drop' | 'compatible' | 'pass'

export function isProxyType(type: string): type is ProxyType {
  return [
    'ss', 'ssr', 'http', 'socks', 'vmess', 'vless', 'trojan',
    'snell', 'hysteria', 'hysteria2', 'tuic', 'wireguard', 'ssh',
    'anytls', 'mieru', 'sudoku', 'tailscale', 'masque',
    'trusttunnel', 'openvpn',
  ].includes(type)
}

export function getProxyTypeFields(type: string): string[] {
  const base: string[] = ['name', 'type', 'server', 'port', 'udp', 'tfo', 'mptcp', 'dialer-proxy', 'interface-name', 'routing-mark', 'ip-version', 'smux']
  const tls: string[] = ['tls', 'sni', 'servername', 'fingerprint', 'alpn', 'skip-cert-verify', 'client-fingerprint', 'reality-opts', 'ech-opts']
  const transport: string[] = ['network', 'http-opts', 'h2-opts', 'grpc-opts', 'ws-opts']

  const typeFields: Record<string, string[]> = {
    ss: ['cipher', 'password', 'udp-over-tcp', 'udp-over-tcp-version', 'plugin', 'plugin-opts'],
    ssr: ['cipher', 'password', 'protocol', 'protocol-param', 'obfs', 'obfs-param', 'udp-over-tcp'],
    http: ['username', 'password', 'headers'],
    socks: ['username', 'password'],
    vmess: ['uuid', 'alterId', 'security', 'cipher', 'packet-encoding', 'ws-opts', 'http-opts', 'h2-opts', 'grpc-opts', 'xhttp-opts'],
    vless: ['uuid', 'flow', 'encryption', 'packet-encoding', 'xhttp-opts'],
    trojan: ['password', 'ss-opts'],
    snell: ['psk', 'obfs-opts', 'version'],
    hysteria: ['up', 'down', 'auth', 'auth-str', 'protocol', 'obfs', 'obfs-password', 'ca', 'ca-str', 'disable-mtu-discovery', 'recv-window-conn', 'recv-window', 'ports', 'sni', 'alpn'],
    hysteria2: ['password', 'up', 'down', 'obfs', 'obfs-password', 'sni', 'skip-cert-verify', 'cwnd'],
    tuic: ['uuid', 'password', 'version', 'token', 'congestion-controller', 'reduce-rtt', 'heartbeat-interval', 'disable-sni', 'max-open-streams', 'max-udp-relay-packet-size', 'alpn', 'ca', 'ca-str'],
    wireguard: ['private-key', 'public-key', 'pre-shared-key', 'ip', 'ipv6', 'allowed-ips', 'reserved', 'persistent-keepalive', 'mtu', 'remote-dns-resolve', 'dns', 'peers', 'amnezia-wg-option'],
    ssh: ['username', 'password', 'private-key', 'host-key', 'host-key-algorithms'],
    anytls: [],
    mieru: ['username', 'password'],
    sudoku: [],
    tailscale: [],
    masque: [],
    trusttunnel: [],
    openvpn: ['openvpn-opts'],
  }

  const fields = [...base]
  if (['vmess', 'vless', 'trojan', 'ss', 'ssr', 'tuic', 'hysteria', 'hysteria2'].includes(type)) {
    fields.push(...tls)
  }
  if (['vmess', 'vless', 'trojan', 'ss'].includes(type)) {
    fields.push(...transport)
  }
  const extra = typeFields[type]
  if (extra) fields.push(...extra)

  return fields
}

export interface SmuxConfig {
  enabled?: boolean
  protocol?: string
  'max-connections'?: number
  'min-streams'?: number
  'max-streams'?: number
  statistic?: boolean
  'only-tcp'?: boolean
  padding?: boolean
  'brutal-opts'?: BrutalOpts
}

export interface BrutalOpts {
  enabled?: boolean
  up?: number
  down?: number
}

export interface RealityOpts {
  'public-key'?: string
  'short-id'?: string
  'support-x25519mlkem768'?: boolean
}

export interface EchOpts {
  enable?: boolean
  config?: string
  'query-server-name'?: string
}

export interface HttpOpts {
  method?: string
  path?: string[]
  headers?: Record<string, string[]>
}

export interface H2Opts {
  host?: string[]
  path?: string
}

export interface GrpcOpts {
  'grpc-service-name'?: string
  'grpc-user-agent'?: string
  'ping-interval'?: number
  'max-connections'?: number
  'min-streams'?: number
  'max-streams'?: number
}

export interface WsOpts {
  path?: string
  headers?: Record<string, string[]>
  'max-early-data'?: number
  'early-data-header-name'?: string
  'v2ray-http-upgrade'?: boolean
  'v2ray-http-upgrade-fast-open'?: boolean
}

export interface XHttpOpts {
  path?: string
  host?: string
  mode?: string
  headers?: Record<string, string[]>
  'no-grpc-header'?: boolean
  'x-padding-bytes'?: string
  'x-padding-obfs-mode'?: boolean
  'x-padding-key'?: string
  'x-padding-header'?: string
  'x-padding-placement'?: string
  'x-padding-method'?: string
  'uplink-http-method'?: string
  'session-placement'?: string
  'session-key'?: string
  'seq-placement'?: string
  'seq-key'?: string
  'uplink-data-placement'?: string
  'uplink-data-key'?: string
  'uplink-chunk-size'?: number
  'sc-max-each-post-bytes'?: number
  'sc-min-posts-interval-ms'?: number
  'reuse-settings'?: ReuseSettings
  'download-settings'?: ReuseSettings
}

export interface ReuseSettings {
  'max-concurrency'?: string
  'max-connections'?: string
  'c-max-reuse-times'?: string
  'h-max-request-times'?: string
  'h-max-reusable-secs'?: string
  'h-keep-alive-period'?: number
}

export interface SsOpts {
  enabled?: boolean
  method?: string
  password?: string
}

export interface PluginOpts {
  mode?: string
  host?: string
  port?: number
  path?: string
  password?: string
  // shadow-tls
  version?: number
  'shadow-tls-password'?: string
  // restls
  'restls-script'?: string
  // kcptun
  'kcptun-opts'?: Record<string, unknown>
}

export interface WireGuardPeer {
  server?: string
  port?: number
  'public-key'?: string
  'pre-shared-key'?: string
  'allowed-ips'?: string[]
  reserved?: number[]
}

// === Proxy Providers ===

export interface ProxyProviderConfig {
  type: string
  url?: string
  path?: string
  interval?: number
  proxy?: string
  'size-limit'?: number
  'age-secret-key'?: string
  header?: Record<string, string | string[]>
  'health-check'?: HealthCheckConfig
  override?: ProxyProviderOverride
  filter?: string
  'exclude-filter'?: string
  'exclude-type'?: string
  payload?: ProxyConfig[]
}

export interface HealthCheckConfig {
  enable?: boolean
  url?: string
  interval?: number
  timeout?: number
  lazy?: boolean
  'expected-status'?: string
}

export interface ProxyProviderOverride {
  tfo?: boolean
  mptcp?: boolean
  udp?: boolean
  'udp-over-tcp'?: boolean
  down?: string
  up?: string
  'skip-cert-verify'?: boolean
  'dialer-proxy'?: string
  'interface-name'?: string
  'routing-mark'?: number
  'ip-version'?: string
  'additional-prefix'?: string
  'additional-suffix'?: string
  'proxy-name'?: ProxyNameOverride[]
}

export interface ProxyNameOverride {
  pattern: string
  target: string
}

// === Proxy Groups ===

export interface ProxyGroupConfig {
  name: string
  type: string
  proxies?: string[]
  use?: string[]
  url?: string
  interval?: number
  lazy?: boolean
  'empty-fallback'?: string
  timeout?: number
  'max-failed-times'?: number
  'disable-udp'?: boolean
  'interface-name'?: string
  'routing-mark'?: number
  'include-all'?: boolean
  'include-all-proxies'?: boolean
  'include-all-providers'?: boolean
  filter?: string
  'exclude-filter'?: string
  'exclude-type'?: string
  'expected-status'?: string
  hidden?: boolean
  icon?: string
  // url-test/fallback specific
  tolerance?: number
  // load-balance specific
  strategy?: string
}

// === Rule Providers ===

export interface RuleProviderConfig {
  type: string
  url?: string
  path?: string
  interval?: number
  proxy?: string
  behavior?: string
  format?: string
  'path-in-bundle'?: string
  'size-limit'?: number
  header?: Record<string, string | string[]>
  payload?: string[]
}

// === Tunnels ===

export interface TunnelConfig {
  network?: string[]
  address?: string
  target?: string
  proxy?: string
}

// === NTP ===

export interface NtpConfig {
  enable?: boolean
  'write-to-system'?: boolean
  server?: string
  port?: number
  interval?: number
  'dialer-proxy'?: string
}

// === Experimental ===

export interface ExperimentalConfig {
  'quic-go-disable-gso'?: boolean
  'quic-go-disable-ecn'?: boolean
  'dialer-ip4p-convert'?: boolean
  fingerprints?: string[]
}
