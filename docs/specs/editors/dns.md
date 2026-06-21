# dns

## 职责
Configures DNS resolution settings, nameservers, nameserver policies, and fallback filtering.

## 文件
- `src/components/editors/dns/DnsEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **DNS**。页面以 `EditorSection` 按任务分组：**解析与上游**常显；**监听与缓存**、**分流 DNS**、**域名策略**默认折叠；增强模式为 `fake-ip` 时显示默认折叠的 **Fake IP**；配置 `fallback` 后显示默认折叠的 **Fallback 过滤**。服务器列表保留拖拽排序，字段帮助通过 Tooltip 显示中文说明、完整 YAML 路径和已确认默认值。字段网格在窄屏为单列，`md` 及以上为双列。

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
- `EditorSection`
- `TextField`
- `NumberField`
- `BoolField`, `SelectField`
- Inline sub-components: `StringListEditor` (with `@dnd-kit/core` + `@dnd-kit/sortable` for drag reorder), `NameserverPolicyEditor`
- `lucide-react` (Plus, Trash2, GripVertical)

## 关联引擎
- `src/lib/constants.ts` – `DNS_ENHANCED_MODES`, `DNS_CACHE_ALGORITHMS`, `DNS_FAKE_IP_FILTER_MODES`

## 关联测试
- `src/__tests__/components/EditorLayouts.test.tsx` (renders DnsEditor)
- `src/__tests__/components/FormEditorUx.test.tsx`（分组、条件区块、空值下拉和响应式布局）
