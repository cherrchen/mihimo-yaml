# iptables

## 职责
Configures Linux iptables transparent proxy / TPROXY forwarding rules.

## 文件
- `src/components/editors/iptables/IptablesEditor.tsx`

## UI 结构
Simple single-page form layout. A heading with description and a 2-column grid of form fields, plus a full-width bypass text area.

## 配置字段
- `iptables` (top-level object)
  - `enable` — enable iptables rules
  - `inbound-interface` — network interface name (e.g. `eth0`)
  - `dns-redirect` — redirect DNS requests through the proxy
  - `bypass` — array of addresses to bypass (comma-separated input)

## 使用组件
- `FieldWrapper`
- `BoolField`, `TextField`

## 关联引擎
(No dedicated engine module)

## 关联测试
(No component-specific tests)
