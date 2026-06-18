# lib-constants

## 职责
Provides string constants and enum-like arrays for mihomo config fields (proxy types, rule types, listener types, etc.).

## 文件
`src/lib/constants.ts`

## 导出 API

| 导出 | 类型 | 值 / 说明 |
|------|------|-----------|
| `DIRECT` | `string` | `'DIRECT'` |
| `REJECT` | `string` | `'REJECT'` |
| `REJECT_DROP` | `string` | `'REJECT-DROP'` |
| `COMPATIBLE` | `string` | `'COMPATIBLE'` |
| `PASS` | `string` | `'PASS'` |
| `BUILTIN_STRATEGIES` | `readonly string[]` | `[DIRECT, REJECT, REJECT_DROP, COMPATIBLE, PASS]` |
| `RULE_TARGETS` | `readonly string[]` | Same five built-in strategies as rule targets |
| `PROXY_TYPES` | `readonly string[]` | 24 proxy types (`direct`, `ss`, `vmess`, `hysteria2`, etc.) |
| `PROXY_GROUP_TYPES` | `readonly string[]` | 5 group types (`select`, `url-test`, `fallback`, `load-balance`, `relay`) |
| `LISTENER_TYPES` | `readonly string[]` | 17 listener types (`http`, `socks`, `mixed`, `tun`, etc.) |
| `RULE_TYPES` | `readonly string[]` | 31 rule types (`DOMAIN`, `GEOSITE`, `IP-CIDR`, `MATCH`, etc.) |
| `LOG_LEVELS` | `readonly string[]` | `['silent', 'error', 'warning', 'info', 'debug']` |
| `MODES` | `readonly string[]` | `['rule', 'global', 'direct']` |
| `FIND_PROCESS_MODES` | `readonly string[]` | `['always', 'strict', 'off']` |
| `DNS_CACHE_ALGORITHMS` | `readonly string[]` | `['lru', 'arc']` |
| `DNS_ENHANCED_MODES` | `readonly string[]` | `['fake-ip', 'redir-host']` |
| `DNS_FAKE_IP_FILTER_MODES` | `readonly string[]` | `['blacklist', 'whitelist', 'rule']` |
| `GEODATA_LOADERS` | `readonly string[]` | `['standard', 'memconservative']` |
| `TUN_STACKS` | `readonly string[]` | `['system', 'gvisor', 'mixed']` |
| `NETWORK_TYPES` | `readonly string[]` | `['tcp', 'http', 'h2', 'grpc', 'ws', 'xhttp']` |
| `IP_VERSIONS` | `readonly string[]` | `['dual', 'ipv4', 'ipv6', 'ipv4-prefer', 'ipv6-prefer']` |
| `SMUX_PROTOCOLS` | `readonly string[]` | `['smux', 'yamux', 'h2mux']` |
| `LOAD_BALANCE_STRATEGIES` | `readonly string[]` | `['consistent-hashing', 'round-robin']` |
| `RULE_PROVIDER_BEHAVIORS` | `readonly string[]` | `['domain', 'ipcidr', 'classical']` |
| `RULE_PROVIDER_FORMATS` | `readonly string[]` | `['yaml', 'text', 'mrs']` |
| `PROVIDER_TYPES` | `readonly string[]` | `['http', 'file', 'inline']` |

## 依赖
None (zero imports).

## 关键数据流
This is a pure constants file. All arrays are declared `as const` for type narrowing. Downstream editors use these arrays to populate select dropdowns and validate user input against allowed values. The five singleton string constants (`DIRECT`, `REJECT`, etc.) are re-exported for convenience wherever rule targets or proxy strategies are needed.

## 关联测试
- No dedicated test file; tested indirectly through editor and validation tests
