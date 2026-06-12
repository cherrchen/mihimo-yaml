// Built-in proxy strategy names
export const DIRECT = 'DIRECT'
export const REJECT = 'REJECT'
export const REJECT_DROP = 'REJECT-DROP'
export const COMPATIBLE = 'COMPATIBLE'
export const PASS = 'PASS'

export const BUILTIN_STRATEGIES = [DIRECT, REJECT, REJECT_DROP, COMPATIBLE, PASS] as const

export const RULE_TARGETS = [
  DIRECT,
  REJECT,
  REJECT_DROP,
  COMPATIBLE,
  PASS,
] as const

export const PROXY_TYPES = [
  'direct', 'dns', 'reject', 'reject-drop', 'compatible', 'pass',
  'ss', 'ssr', 'snell', 'http', 'socks',
  'vmess', 'vless', 'trojan',
  'hysteria', 'hysteria2', 'tuic',
  'wireguard', 'ssh', 'anytls', 'mieru',
  'sudoku', 'tailscale', 'masque', 'trusttunnel', 'openvpn',
] as const

export const PROXY_GROUP_TYPES = [
  'select', 'url-test', 'fallback', 'load-balance', 'relay',
] as const

export const LISTENER_TYPES = [
  'http', 'socks', 'mixed', 'redir', 'tproxy',
  'shadowsocks', 'vmess', 'vless', 'trojan', 'anytls',
  'mieru', 'sudoku', 'tuic', 'hysteria2', 'hysteria2-realm',
  'trusttunnel', 'snell', 'tunnel', 'tun',
] as const

export const RULE_TYPES = [
  'DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD', 'DOMAIN-WILDCARD', 'DOMAIN-REGEX',
  'GEOSITE', 'IP-CIDR', 'IP-CIDR6', 'IP-SUFFIX', 'IP-ASN', 'GEOIP',
  'SRC-GEOIP', 'SRC-IP-ASN', 'SRC-IP-CIDR', 'SRC-IP-SUFFIX',
  'DST-PORT', 'SRC-PORT', 'IN-PORT', 'IN-TYPE', 'IN-USER', 'IN-NAME',
  'PROCESS-PATH', 'PROCESS-PATH-WILDCARD', 'PROCESS-PATH-REGEX',
  'PROCESS-NAME', 'PROCESS-NAME-WILDCARD', 'PROCESS-NAME-REGEX',
  'UID', 'NETWORK', 'DSCP', 'RULE-SET',
  'AND', 'OR', 'NOT', 'SUB-RULE', 'MATCH',
] as const

export const LOG_LEVELS = ['silent', 'error', 'warning', 'info', 'debug'] as const

export const MODES = ['rule', 'global', 'direct'] as const

export const FIND_PROCESS_MODES = ['always', 'strict', 'off'] as const

export const DNS_CACHE_ALGORITHMS = ['lru', 'arc'] as const

export const DNS_ENHANCED_MODES = ['fake-ip', 'redir-host'] as const

export const DNS_FAKE_IP_FILTER_MODES = ['blacklist', 'whitelist', 'rule'] as const

export const GEODATA_LOADERS = ['standard', 'memconservative'] as const

export const TUN_STACKS = ['system', 'gvisor', 'mixed'] as const

export const NETWORK_TYPES = ['tcp', 'http', 'h2', 'grpc', 'ws', 'xhttp'] as const

export const IP_VERSIONS = ['dual', 'ipv4', 'ipv6', 'ipv4-prefer', 'ipv6-prefer'] as const

export const SMUX_PROTOCOLS = ['smux', 'yamux', 'h2mux'] as const

export const LOAD_BALANCE_STRATEGIES = ['consistent-hashing', 'round-robin'] as const

export const RULE_PROVIDER_BEHAVIORS = ['domain', 'ipcidr', 'classical'] as const

export const RULE_PROVIDER_FORMATS = ['yaml', 'text', 'mrs'] as const

export const PROVIDER_TYPES = ['http', 'file', 'inline'] as const
