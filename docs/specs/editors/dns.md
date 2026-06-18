# dns

## 职责
Configures DNS resolution settings, nameservers, nameserver policies, and fallback filtering.

## 文件
- `src/components/editors/dns/DnsEditor.tsx`

## UI 结构
Two-column form for basic DNS settings. Conditional `fake-ip` fields appear when enhanced mode is `fake-ip`. Below the form: sortable string-list editors for `default-nameserver`, `nameserver`, `fallback`, `proxy-server-nameserver`, `direct-nameserver`. A key-value editor for `nameserver-policy`. Conditional fallback-filter section (geoip, geosite, domain) when `fallback` is non-empty.

## 配置字段
- `dns.enable`
- `dns.enhanced-mode`
- `dns.listen`
- `dns.ipv6`
- `dns.cache-algorithm`
- `dns.prefer-h3`
- `dns.fake-ip-range`
- `dns.fake-ip-ttl`
- `dns.fake-ip-filter-mode`
- `dns.default-nameserver`
- `dns.nameserver`
- `dns.fallback`
- `dns.proxy-server-nameserver`
- `dns.direct-nameserver`
- `dns.nameserver-policy`
- `dns.fallback-filter.geoip`
- `dns.fallback-filter.geoip-code`
- `dns.fallback-filter.geosite`
- `dns.fallback-filter.domain`

## 使用组件
- `FieldWrapper`
- `TextField`
- `NumberField`
- Inline sub-components: `StringListEditor` (with `@dnd-kit/core` + `@dnd-kit/sortable` for drag reorder), `NameserverPolicyEditor`
- `lucide-react` (Plus, Trash2, GripVertical)

## 关联引擎
- `src/lib/constants.ts` – `DNS_ENHANCED_MODES`, `DNS_CACHE_ALGORITHMS`, `DNS_FAKE_IP_FILTER_MODES`

## 关联测试
- `src/__tests__/components/EditorLayouts.test.tsx` (renders DnsEditor)
