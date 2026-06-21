# inbounds

## 职责
Configures mihomo listener (inbound) entries. The type selector exposes all 19 values from `LISTENER_TYPES`; dedicated conditional fields currently exist only for HTTP/SOCKS/Mixed authentication, Shadowsocks credentials, and Tunnel targets.

## 文件
- `src/components/editors/inbounds/InboundsEditor.tsx`

## UI 结构
Shared list/detail split layout. The left pane uses 30% width with a 14rem minimum and lists all listeners with name and `type:port` summary; the right pane shows a centered detail form for the selected listener. An "Add" button creates a default HTTP listener on port 8080. Fields are shown/hidden based on the selected listener type.

## 配置字段
- `listeners[]` (top-level array)
  - `name` — listener name
  - `type` — one of the 19 `LISTENER_TYPES`; types without a dedicated block can edit only common fields
  - `port` — listen port
  - `listen` — bind address (default `0.0.0.0`)
  - `udp` — enable UDP (default `true`)
  - `proxy` — proxy all traffic through this target
  - `rule` — sub-rule name
  - `username` / `password` — authentication (http/socks/mixed)
  - `cipher` — encryption method (shadowsocks)
  - `target` / `network` — tunnel destination and network types (tunnel)

## 使用组件
- `FieldWrapper`
- `TextField`, `NumberField`, `BoolField`, `SelectField`
- `SensitiveField`

## 关联引擎
- `src/engine/references.ts` — collects listener names for reference checking

## 关联测试
(No component-specific tests)
