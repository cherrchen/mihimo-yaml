import type { FieldMeta } from './metadata-types'

function f(partial: Pick<FieldMeta, 'key' | 'path' | 'type' | 'description' | 'category'> & Partial<FieldMeta>): FieldMeta {
  return {
    required: false,
    mihomo: true,
    stash: true,
    advanced: false,
    deprecated: false,
    sensitive: false,
    ...partial,
  }
}

// === General Fields ===

const generalFields: FieldMeta[] = [
  f({ key: 'mode', path: 'mode', type: 'enum', enumValues: ['rule', 'global', 'direct'], defaultValue: 'rule', description: '代理模式', category: 'general' }),
  f({ key: 'log-level', path: 'log-level', type: 'enum', enumValues: ['silent', 'error', 'warning', 'info', 'debug'], defaultValue: 'info', description: '日志级别', category: 'general' }),
  f({ key: 'allow-lan', path: 'allow-lan', type: 'boolean', defaultValue: false, description: '允许局域网连接', category: 'general', stashAction: 'remove' }),
  f({ key: 'bind-address', path: 'bind-address', type: 'string', defaultValue: '*', description: '绑定地址', category: 'general', stashAction: 'remove' }),
  f({ key: 'lan-allowed-ips', path: 'lan-allowed-ips', type: 'string[]', description: 'LAN 允许 IP 范围', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'lan-disallowed-ips', path: 'lan-disallowed-ips', type: 'string[]', description: 'LAN 禁止 IP 范围', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'authentication', path: 'authentication', type: 'string[]', description: '认证用户:密码列表', category: 'general', sensitive: true, stash: false, stashAction: 'remove' }),
  f({ key: 'skip-auth-prefixes', path: 'skip-auth-prefixes', type: 'string[]', description: '跳过认证的 IP 前缀', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'ipv6', path: 'ipv6', type: 'boolean', defaultValue: true, description: '允许 IPv6', category: 'general', stashAction: 'remove' }),
  f({ key: 'keep-alive-interval', path: 'keep-alive-interval', type: 'number', description: 'TCP Keep Alive 间隔 (秒)', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'keep-alive-idle', path: 'keep-alive-idle', type: 'number', description: 'TCP Keep Alive 空闲时间', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'disable-keep-alive', path: 'disable-keep-alive', type: 'boolean', defaultValue: false, description: '禁用 TCP Keep Alive', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'find-process-mode', path: 'find-process-mode', type: 'enum', enumValues: ['always', 'strict', 'off'], defaultValue: 'strict', description: '进程匹配模式', category: 'general', stashAction: 'remove' }),
  f({ key: 'external-controller', path: 'external-controller', type: 'string', description: 'RESTful API 监听地址', example: '127.0.0.1:9090', category: 'general', stash: false, stashAction: 'remove' }),
  f({ key: 'external-controller-tls', path: 'external-controller-tls', type: 'string', description: 'HTTPS API 地址', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'external-controller-unix', path: 'external-controller-unix', type: 'string', description: 'Unix socket API 路径', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'external-controller-pipe', path: 'external-controller-pipe', type: 'string', description: 'Windows named pipe 路径', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'secret', path: 'secret', type: 'string', description: 'API 密钥', category: 'general', sensitive: true, stash: false, stashAction: 'remove' }),
  f({ key: 'external-ui', path: 'external-ui', type: 'string', description: '外部 UI 路径', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'external-ui-name', path: 'external-ui-name', type: 'string', description: '自定义 UI 子目录名', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'external-ui-url', path: 'external-ui-url', type: 'string', description: '外部 UI 下载 URL', category: 'general', advanced: true, stash: false, stashAction: 'remove' }),
  f({ key: 'external-doh-server', path: 'external-doh-server', type: 'string', description: 'DOH 服务器路径', category: 'general', advanced: true, stash: false }),
  f({ key: 'unified-delay', path: 'unified-delay', type: 'boolean', defaultValue: false, description: '统一延迟计算', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'tcp-concurrent', path: 'tcp-concurrent', type: 'boolean', defaultValue: false, description: 'TCP 并发连接', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'interface-name', path: 'interface-name', type: 'string', description: '出站接口名称', category: 'general' }),
  f({ key: 'routing-mark', path: 'routing-mark', type: 'number', description: '默认路由标记 (Linux)', category: 'general', advanced: true }),
  f({ key: 'geodata-mode', path: 'geodata-mode', type: 'boolean', defaultValue: false, description: 'GeoData 格式 (true=dat, false=mmdb)', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'geodata-loader', path: 'geodata-loader', type: 'enum', enumValues: ['standard', 'memconservative'], defaultValue: 'memconservative', description: 'GeoData 加载模式', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'geosite-matcher', path: 'geosite-matcher', type: 'string', description: 'GeoSite 匹配实现', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'geo-auto-update', path: 'geo-auto-update', type: 'boolean', defaultValue: false, description: '自动更新 GEO 数据', category: 'general', stashAction: 'remove' }),
  f({ key: 'geo-update-interval', path: 'geo-update-interval', type: 'number', defaultValue: 24, description: 'GEO 更新间隔 (小时)', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'global-ua', path: 'global-ua', type: 'string', description: '全局 User-Agent', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'etag-support', path: 'etag-support', type: 'boolean', defaultValue: true, description: 'ETag 支持', category: 'general', advanced: true }),
  f({ key: 'global-client-fingerprint', path: 'global-client-fingerprint', type: 'string', description: '全局 TLS 指纹 (已弃用)', category: 'general', advanced: true, deprecated: true, stashAction: 'remove' }),
]

// === Legacy Inbound ===
const legacyInboundFields: FieldMeta[] = [
  f({ key: 'port', path: 'port', type: 'number', description: 'HTTP 代理端口 (已弃用)', category: 'inbounds', advanced: true, deprecated: true, stash: false }),
  f({ key: 'socks-port', path: 'socks-port', type: 'number', description: 'SOCKS5 代理端口 (已弃用)', category: 'inbounds', advanced: true, deprecated: true, stash: false }),
  f({ key: 'redir-port', path: 'redir-port', type: 'number', description: 'Redirect 端口 (已弃用)', category: 'inbounds', advanced: true, deprecated: true, stash: false }),
  f({ key: 'tproxy-port', path: 'tproxy-port', type: 'number', description: 'TProxy 端口 (已弃用)', category: 'inbounds', advanced: true, deprecated: true, stash: false }),
  f({ key: 'mixed-port', path: 'mixed-port', type: 'number', description: 'Mixed 端口 (已弃用)', category: 'inbounds', advanced: true, deprecated: true, stash: false }),
  f({ key: 'inbound-tfo', path: 'inbound-tfo', type: 'boolean', description: '入站 TCP Fast Open', category: 'inbounds', advanced: true, stash: false }),
  f({ key: 'inbound-mptcp', path: 'inbound-mptcp', type: 'boolean', description: '入站 TCP Multi Path', category: 'inbounds', advanced: true, stash: false }),
]

// === Profile ===
const profileFields: FieldMeta[] = [
  f({ key: 'store-selected', path: 'profile.store-selected', type: 'boolean', defaultValue: true, description: '持久化选中的代理组', category: 'general', stashAction: 'remove' }),
  f({ key: 'store-fake-ip', path: 'profile.store-fake-ip', type: 'boolean', defaultValue: false, description: '持久化 Fake IP 映射', category: 'general', advanced: true, stashAction: 'remove' }),
]

// === GeoX URL ===
const geoxUrlFields: FieldMeta[] = [
  f({ key: 'geoip', path: 'geox-url.geoip', type: 'string', description: 'GeoIP .dat URL', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'geosite', path: 'geox-url.geosite', type: 'string', description: 'GeoSite .dat URL', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'mmdb', path: 'geox-url.mmdb', type: 'string', description: 'GeoIP MMDB URL', category: 'general', advanced: true, stashAction: 'remove' }),
  f({ key: 'asn', path: 'geox-url.asn', type: 'string', description: 'ASN MMDB URL', category: 'general', advanced: true, stashAction: 'remove' }),
]

// === DNS ===
const dnsFields: FieldMeta[] = [
  f({ key: 'enable', path: 'dns.enable', type: 'boolean', defaultValue: false, description: '启用 DNS 模块', category: 'dns' }),
  f({ key: 'cache-algorithm', path: 'dns.cache-algorithm', type: 'enum', enumValues: ['lru', 'arc'], defaultValue: 'lru', description: 'DNS 缓存算法', category: 'dns', advanced: true }),
  f({ key: 'cache-max-size', path: 'dns.cache-max-size', type: 'number', description: 'DNS 缓存大小', category: 'dns', advanced: true }),
  f({ key: 'prefer-h3', path: 'dns.prefer-h3', type: 'boolean', defaultValue: false, description: 'DOH 优先 HTTP/3', category: 'dns' }),
  f({ key: 'listen', path: 'dns.listen', type: 'string', description: 'DNS 监听地址', category: 'dns' }),
  f({ key: 'ipv6', path: 'dns.ipv6', type: 'boolean', defaultValue: false, description: '解析 IPv6 (AAAA)', category: 'dns', stashAction: 'remove' }),
  f({ key: 'ipv6-timeout', path: 'dns.ipv6-timeout', type: 'number', defaultValue: 100, description: 'IPv6 超时 (ms)', category: 'dns', advanced: true, stashAction: 'remove' }),
  f({ key: 'enhanced-mode', path: 'dns.enhanced-mode', type: 'enum', enumValues: ['fake-ip', 'redir-host'], defaultValue: 'redir-host', description: 'DNS 增强模式', category: 'dns', stashAction: 'remove' }),
  f({ key: 'fake-ip-range', path: 'dns.fake-ip-range', type: 'string', defaultValue: '198.18.0.1/16', description: 'Fake-IP IPv4 CIDR', category: 'dns', stashAction: 'remove' }),
  f({ key: 'fake-ip-range6', path: 'dns.fake-ip-range6', type: 'string', description: 'Fake-IP IPv6 CIDR', category: 'dns', advanced: true, stashAction: 'remove' }),
  f({ key: 'fake-ip-filter', path: 'dns.fake-ip-filter', type: 'string[]', description: 'Fake-IP 排除域名', category: 'dns', advanced: true, stash: false }),
  f({ key: 'fake-ip-filter-mode', path: 'dns.fake-ip-filter-mode', type: 'enum', enumValues: ['blacklist', 'whitelist', 'rule'], defaultValue: 'blacklist', description: 'Fake-IP 过滤模式', category: 'dns', advanced: true, stashAction: 'remove' }),
  f({ key: 'fake-ip-ttl', path: 'dns.fake-ip-ttl', type: 'number', defaultValue: 1, description: 'Fake-IP TTL', category: 'dns', advanced: true }),
  f({ key: 'use-hosts', path: 'dns.use-hosts', type: 'boolean', defaultValue: true, description: '使用 hosts 文件', category: 'dns', stashAction: 'remove' }),
  f({ key: 'use-system-hosts', path: 'dns.use-system-hosts', type: 'boolean', defaultValue: true, description: '使用系统 hosts', category: 'dns', stashAction: 'remove' }),
  f({ key: 'respect-rules', path: 'dns.respect-rules', type: 'boolean', defaultValue: false, description: 'DNS 遵循路由规则', category: 'dns' }),
  f({ key: 'default-nameserver', path: 'dns.default-nameserver', type: 'string[]', description: '默认 DNS 服务器 (仅 IP)', category: 'dns' }),
  f({ key: 'nameserver', path: 'dns.nameserver', type: 'string[]', description: 'DNS 服务器列表', category: 'dns' }),
  f({ key: 'nameserver-policy', path: 'dns.nameserver-policy', type: 'map', description: '按域名的 DNS 服务器策略', category: 'dns' }),
  f({ key: 'proxy-server-nameserver', path: 'dns.proxy-server-nameserver', type: 'string[]', description: '代理节点域名解析 DNS', category: 'dns', stashAction: 'remove' }),
  f({ key: 'proxy-server-nameserver-policy', path: 'dns.proxy-server-nameserver-policy', type: 'map', description: '按代理域名的 DNS 策略', category: 'dns', advanced: true, stashAction: 'remove' }),
  f({ key: 'direct-nameserver', path: 'dns.direct-nameserver', type: 'string[]', description: '直连 DNS 服务器', category: 'dns', stashAction: 'remove' }),
  f({ key: 'direct-nameserver-follow-policy', path: 'dns.direct-nameserver-follow-policy', type: 'boolean', defaultValue: false, description: '直连 DNS 遵循策略', category: 'dns', advanced: true, stashAction: 'remove' }),
  f({ key: 'fallback', path: 'dns.fallback', type: 'string[]', description: '备用 DNS 服务器', category: 'dns', stash: false, stashAction: 'remove' }),
  f({ key: 'geoip', path: 'dns.fallback-filter.geoip', type: 'boolean', defaultValue: true, description: '启用 GeoIP 备用过滤', category: 'dns', stash: false, stashAction: 'remove' }),
  f({ key: 'geoip-code', path: 'dns.fallback-filter.geoip-code', type: 'string', defaultValue: 'CN', description: 'GeoIP 国家代码', category: 'dns', stash: false, stashAction: 'remove' }),
  f({ key: 'geosite', path: 'dns.fallback-filter.geosite', type: 'string[]', description: '污染域名 GeoSite 分类', category: 'dns', stash: false, stashAction: 'remove' }),
  f({ key: 'ipcidr', path: 'dns.fallback-filter.ipcidr', type: 'string[]', description: '污染 IP CIDR', category: 'dns', stash: false, stashAction: 'remove' }),
  f({ key: 'domain', path: 'dns.fallback-filter.domain', type: 'string[]', description: '污染域名列表', category: 'dns', stash: false, stashAction: 'remove' }),
]

// === DNS Rules export for Stash ===
const dnsStashFields: FieldMeta[] = [
  f({ key: 'default-nameserver', path: 'dns.default-nameserver', type: 'string[]', description: '默认 DNS 服务器 (仅 IP)', category: 'dns', stash: true }),
  f({ key: 'nameserver', path: 'dns.nameserver', type: 'string[]', description: 'DNS 服务器列表', category: 'dns', stash: true }),
  f({ key: 'nameserver-policy', path: 'dns.nameserver-policy', type: 'map', description: '按域名的 DNS 服务器策略', category: 'dns', stash: true }),
  f({ key: 'skip-cert-verify', path: 'dns.skip-cert-verify', type: 'boolean', description: '跳过 DoH/DoT 证书验证', category: 'dns', stash: true }),
  f({ key: 'fake-ip-filter', path: 'dns.fake-ip-filter', type: 'string[]', description: 'Fake-IP 排除域名', category: 'dns', stash: true }),
  f({ key: 'follow-rule', path: 'dns.follow-rule', type: 'boolean', description: 'DNS 遵循代理规则', category: 'dns', stash: true }),
]

// === Hosts ===
const hostsFields: FieldMeta[] = [
  f({ key: 'hosts', path: 'hosts', type: 'map', description: '静态域名映射', category: 'hosts' }),
]

// === Sniffer ===
const snifferFields: FieldMeta[] = [
  f({ key: 'enable', path: 'sniffer.enable', type: 'boolean', defaultValue: false, description: '启用域名嗅探', category: 'sniffer' }),
  f({ key: 'override-destination', path: 'sniffer.override-destination', type: 'boolean', defaultValue: true, description: '使用嗅探域名覆盖目标', category: 'sniffer' }),
  f({ key: 'force-dns-mapping', path: 'sniffer.force-dns-mapping', type: 'boolean', defaultValue: true, description: '强制 redir-host 流量嗅探', category: 'sniffer', advanced: true }),
  f({ key: 'parse-pure-ip', path: 'sniffer.parse-pure-ip', type: 'boolean', defaultValue: true, description: '强制纯 IP 流量嗅探', category: 'sniffer', advanced: true }),
  f({ key: 'sniffing', path: 'sniffer.sniffing', type: 'string[]', description: '嗅探协议列表', category: 'sniffer', advanced: true }),
  f({ key: 'force-domain', path: 'sniffer.force-domain', type: 'string[]', description: '强制嗅探域名', category: 'sniffer', advanced: true }),
  f({ key: 'skip-domain', path: 'sniffer.skip-domain', type: 'string[]', description: '跳过嗅探域名', category: 'sniffer', advanced: true }),
  f({ key: 'skip-src-address', path: 'sniffer.skip-src-address', type: 'string[]', description: '跳过嗅探源地址', category: 'sniffer', advanced: true }),
  f({ key: 'skip-dst-address', path: 'sniffer.skip-dst-address', type: 'string[]', description: '跳过嗅探目标地址', category: 'sniffer', advanced: true }),
  f({ key: 'port-whitelist', path: 'sniffer.port-whitelist', type: 'string[]', description: '端口白名单', category: 'sniffer', advanced: true }),
]

// === TUN ===
const tunFields: FieldMeta[] = [
  f({ key: 'enable', path: 'tun.enable', type: 'boolean', defaultValue: false, description: '启用 TUN', category: 'tun' }),
  f({ key: 'stack', path: 'tun.stack', type: 'enum', enumValues: ['system', 'gvisor', 'mixed'], defaultValue: 'gvisor', description: 'TUN 协议栈', category: 'tun' }),
  f({ key: 'device', path: 'tun.device', type: 'string', description: 'TUN 设备名', category: 'tun', advanced: true }),
  f({ key: 'auto-route', path: 'tun.auto-route', type: 'boolean', defaultValue: true, description: '自动设置全局路由', category: 'tun' }),
  f({ key: 'auto-redirect', path: 'tun.auto-redirect', type: 'boolean', defaultValue: false, description: '自动 iptables 重定向', category: 'tun', advanced: true }),
  f({ key: 'auto-detect-interface', path: 'tun.auto-detect-interface', type: 'boolean', defaultValue: true, description: '自动检测出站接口', category: 'tun', advanced: true }),
  f({ key: 'dns-hijack', path: 'tun.dns-hijack', type: 'string[]', description: 'DNS 劫持地址', category: 'tun' }),
  f({ key: 'strict-route', path: 'tun.strict-route', type: 'boolean', defaultValue: false, description: '严格路由 (防泄漏)', category: 'tun' }),
  f({ key: 'mtu', path: 'tun.mtu', type: 'number', defaultValue: 9000, description: 'MTU', category: 'tun', advanced: true }),
  f({ key: 'gso', path: 'tun.gso', type: 'boolean', defaultValue: false, description: 'Generic Segmentation Offload', category: 'tun', advanced: true }),
  f({ key: 'gso-max-size', path: 'tun.gso-max-size', type: 'number', defaultValue: 65536, description: 'GSO 最大数据块', category: 'tun', advanced: true }),
  f({ key: 'endpoint-independent-nat', path: 'tun.endpoint-independent-nat', type: 'boolean', defaultValue: false, description: '端点独立 NAT', category: 'tun', advanced: true }),
  f({ key: 'route-address', path: 'tun.route-address', type: 'string[]', description: '自定义路由 CIDR', category: 'tun' }),
  f({ key: 'route-exclude-address', path: 'tun.route-exclude-address', type: 'string[]', description: '排除路由 CIDR', category: 'tun', advanced: true }),
]

// === Proxy common ===
const proxyCommonFields: FieldMeta[] = [
  f({ key: 'name', path: 'proxies[].name', type: 'string', required: true, description: '代理名称 (唯一)', category: 'proxies' }),
  f({ key: 'type', path: 'proxies[].type', type: 'enum', required: true, description: '代理类型', category: 'proxies' }),
  f({ key: 'server', path: 'proxies[].server', type: 'string', description: '服务器地址', category: 'proxies' }),
  f({ key: 'port', path: 'proxies[].port', type: 'number', description: '服务器端口', category: 'proxies' }),
  f({ key: 'ip-version', path: 'proxies[].ip-version', type: 'enum', enumValues: ['dual', 'ipv4', 'ipv6', 'ipv4-prefer', 'ipv6-prefer'], defaultValue: 'dual', description: 'IP 协议版本', category: 'proxies', advanced: true }),
  f({ key: 'udp', path: 'proxies[].udp', type: 'boolean', defaultValue: false, description: '启用 UDP 中继', category: 'proxies' }),
  f({ key: 'interface-name', path: 'proxies[].interface-name', type: 'string', description: '出站接口', category: 'proxies', advanced: true }),
  f({ key: 'routing-mark', path: 'proxies[].routing-mark', type: 'number', description: '路由标记', category: 'proxies', advanced: true }),
  f({ key: 'tfo', path: 'proxies[].tfo', type: 'boolean', defaultValue: false, description: 'TCP Fast Open', category: 'proxies', advanced: true }),
  f({ key: 'mptcp', path: 'proxies[].mptcp', type: 'boolean', defaultValue: false, description: 'TCP Multi Path', category: 'proxies', advanced: true }),
  f({ key: 'dialer-proxy', path: 'proxies[].dialer-proxy', type: 'string', description: '前级代理 (链式)', category: 'proxies', advanced: true }),
]

// === Proxy Group common ===
const proxyGroupCommonFields: FieldMeta[] = [
  f({ key: 'name', path: 'proxy-groups[].name', type: 'string', required: true, description: '代理组名称 (唯一)', category: 'proxy-groups' }),
  f({ key: 'type', path: 'proxy-groups[].type', type: 'enum', enumValues: ['select', 'url-test', 'fallback', 'load-balance', 'relay'], required: true, description: '代理组类型', category: 'proxy-groups' }),
  f({ key: 'proxies', path: 'proxy-groups[].proxies', type: 'string[]', description: '代理/组引用列表', category: 'proxy-groups' }),
  f({ key: 'use', path: 'proxy-groups[].use', type: 'string[]', description: '代理 Provider 引用', category: 'proxy-groups' }),
  f({ key: 'url', path: 'proxy-groups[].url', type: 'string', description: '健康检查 URL', category: 'proxy-groups' }),
  f({ key: 'interval', path: 'proxy-groups[].interval', type: 'number', description: '健康检查间隔 (秒)', category: 'proxy-groups', advanced: true }),
  f({ key: 'lazy', path: 'proxy-groups[].lazy', type: 'boolean', defaultValue: true, description: '延迟检查', category: 'proxy-groups', advanced: true }),
  f({ key: 'empty-fallback', path: 'proxy-groups[].empty-fallback', type: 'string', defaultValue: 'COMPATIBLE', description: '空组回退策略', category: 'proxy-groups', advanced: true }),
  f({ key: 'timeout', path: 'proxy-groups[].timeout', type: 'number', defaultValue: 5000, description: '健康检查超时 (ms)', category: 'proxy-groups', advanced: true }),
  f({ key: 'max-failed-times', path: 'proxy-groups[].max-failed-times', type: 'number', defaultValue: 5, description: '最大失败次数', category: 'proxy-groups', advanced: true }),
  f({ key: 'disable-udp', path: 'proxy-groups[].disable-udp', type: 'boolean', defaultValue: false, description: '禁用 UDP', category: 'proxy-groups' }),
  f({ key: 'filter', path: 'proxy-groups[].filter', type: 'string', description: '节点筛选 (正则)', category: 'proxy-groups', advanced: true }),
  f({ key: 'exclude-filter', path: 'proxy-groups[].exclude-filter', type: 'string', description: '节点排除筛选', category: 'proxy-groups', advanced: true }),
  f({ key: 'exclude-type', path: 'proxy-groups[].exclude-type', type: 'string', description: '排除代理类型', category: 'proxy-groups', advanced: true }),
  f({ key: 'expected-status', path: 'proxy-groups[].expected-status', type: 'string', defaultValue: '*', description: '期望 HTTP 状态码', category: 'proxy-groups', advanced: true }),
  f({ key: 'hidden', path: 'proxy-groups[].hidden', type: 'boolean', description: 'API 中隐藏', category: 'proxy-groups', advanced: true }),
  f({ key: 'icon', path: 'proxy-groups[].icon', type: 'string', description: '图标 (URL 或 base64)', category: 'proxy-groups', advanced: true }),
]

// === Rule Provider ===
const ruleProviderFields: FieldMeta[] = [
  f({ key: 'type', path: 'rule-providers.<name>.type', type: 'enum', enumValues: ['http', 'file', 'inline'], required: true, description: 'Provider 类型', category: 'rule-providers' }),
  f({ key: 'url', path: 'rule-providers.<name>.url', type: 'string', description: '下载 URL', category: 'rule-providers' }),
  f({ key: 'path', path: 'rule-providers.<name>.path', type: 'string', description: '本地文件路径', category: 'rule-providers' }),
  f({ key: 'interval', path: 'rule-providers.<name>.interval', type: 'number', description: '更新间隔 (秒)', category: 'rule-providers', advanced: true }),
  f({ key: 'proxy', path: 'rule-providers.<name>.proxy', type: 'string', description: '下载代理', category: 'rule-providers', advanced: true }),
  f({ key: 'behavior', path: 'rule-providers.<name>.behavior', type: 'enum', enumValues: ['domain', 'ipcidr', 'classical'], description: '规则行为类型', category: 'rule-providers' }),
  f({ key: 'format', path: 'rule-providers.<name>.format', type: 'enum', enumValues: ['yaml', 'text', 'mrs'], defaultValue: 'mrs', description: '规则文件格式', category: 'rule-providers' }),
  f({ key: 'path-in-bundle', path: 'rule-providers.<name>.path-in-bundle', type: 'string', description: 'Bundle MRS 内部路径', category: 'rule-providers', advanced: true }),
  f({ key: 'size-limit', path: 'rule-providers.<name>.size-limit', type: 'number', description: '最大下载大小 (字节)', category: 'rule-providers', advanced: true }),
]

// === Route Rules ===
const ruleFields: FieldMeta[] = [
  f({ key: 'rules', path: 'rules', type: 'string[]', description: '路由规则列表', category: 'rules' }),
]

// === Sub-rules ===
const subRuleFields: FieldMeta[] = [
  f({ key: 'sub-rules', path: 'sub-rules', type: 'map', description: '子规则定义', category: 'sub-rules' }),
]

// === Tunnels ===
const tunnelFields: FieldMeta[] = [
  f({ key: 'tunnels', path: 'tunnels', type: 'object[]', description: '隧道配置列表', category: 'tunnels' }),
]

// === NTP ===
const ntpFields: FieldMeta[] = [
  f({ key: 'enable', path: 'ntp.enable', type: 'boolean', defaultValue: false, description: '启用 NTP 时间同步', category: 'ntp' }),
  f({ key: 'write-to-system', path: 'ntp.write-to-system', type: 'boolean', defaultValue: false, description: '同步到系统时钟', category: 'ntp', advanced: true }),
  f({ key: 'server', path: 'ntp.server', type: 'string', defaultValue: 'time.apple.com', description: 'NTP 服务器', category: 'ntp' }),
  f({ key: 'port', path: 'ntp.port', type: 'number', defaultValue: 123, description: 'NTP 端口', category: 'ntp', advanced: true }),
  f({ key: 'interval', path: 'ntp.interval', type: 'number', defaultValue: 30, description: '同步间隔 (分钟)', category: 'ntp', advanced: true }),
  f({ key: 'dialer-proxy', path: 'ntp.dialer-proxy', type: 'string', description: 'NTP 代理', category: 'ntp', advanced: true }),
]

// === Experimental ===
const experimentalFields: FieldMeta[] = [
  f({ key: 'quic-go-disable-gso', path: 'experimental.quic-go-disable-gso', type: 'boolean', defaultValue: false, description: '禁用 QUIC GSO', category: 'experimental', advanced: true }),
  f({ key: 'quic-go-disable-ecn', path: 'experimental.quic-go-disable-ecn', type: 'boolean', defaultValue: true, description: '禁用 QUIC ECN', category: 'experimental', advanced: true }),
  f({ key: 'dialer-ip4p-convert', path: 'experimental.dialer-ip4p-convert', type: 'boolean', defaultValue: false, description: '启用 IP4P 地址转换', category: 'experimental', advanced: true }),
  f({ key: 'fingerprints', path: 'experimental.fingerprints', type: 'string[]', description: '自定义 TLS 指纹', category: 'experimental', advanced: true }),
]

// === All fields merged ===
export const ALL_FIELD_META: FieldMeta[] = [
  ...generalFields,
  ...profileFields,
  ...geoxUrlFields,
  ...legacyInboundFields,
  ...dnsFields,
  ...dnsStashFields,
  ...hostsFields,
  ...snifferFields,
  ...tunFields,
  ...proxyCommonFields,
  ...proxyGroupCommonFields,
  ...ruleProviderFields,
  ...ruleFields,
  ...subRuleFields,
  ...tunnelFields,
  ...ntpFields,
  ...experimentalFields,
]

// Lookup helpers
export function getFieldMeta(path: string): FieldMeta | undefined {
  return ALL_FIELD_META.find((f) => f.path === path)
}

export function getFieldsByCategory(category: string): FieldMeta[] {
  return ALL_FIELD_META.filter((f) => f.category === category)
}

export function getStashUnsupportedFields(): FieldMeta[] {
  return ALL_FIELD_META.filter((f) => !f.stash || f.stashAction === 'remove')
}
