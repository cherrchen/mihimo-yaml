# dns

## 职责
Configures DNS resolution settings, nameservers, nameserver policies, and fallback filtering.

## 文件
- `src/components/editors/dns/DnsEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **DNS**，标题右侧的 shadcn `Switch` 是整个 DNS 模块的总开关。关闭时原始 DNS 编辑值保留以供重新开启恢复，但标题下方的字段、折叠按钮和拖拽操作全部禁用；有效配置、完整性检查、兼容报告和 YAML 输出均忽略整个 `dns` 对象。**解析与上游**中默认 DNS 与主要 DNS 在 `md` 及以上等宽并排，备用 DNS 位于其下并占满整行且保留“仅 mihomo”标记；窄屏回落为单列。**监听与缓存**、**分流 DNS**、**域名策略**默认折叠，其中分流 DNS 仅包含代理节点和直连上游；增强模式为 `fake-ip` 时显示默认折叠的 **Fake IP**，配置 `fallback` 后显示默认折叠的 **Fallback 过滤**。

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
- `Switch`（DNS 模块总开关）
- Inline sub-components: `StringListEditor` (with `@dnd-kit/core` + `@dnd-kit/sortable` for drag reorder), `NameserverPolicyEditor`
- `lucide-react` (Plus, Trash2, GripVertical)

## 关联引擎
- `src/lib/constants.ts` – `DNS_ENHANCED_MODES`, `DNS_CACHE_ALGORITHMS`, `DNS_FAKE_IP_FILTER_MODES`

## 关联测试
- `src/__tests__/components/EditorLayouts.test.tsx` (renders DnsEditor)
- `src/__tests__/components/FormEditorUx.test.tsx`（分组、条件区块、空值下拉和响应式布局）
