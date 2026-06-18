# inbounds

## 职责
Configures mihomo listener (inbound) entries — HTTP, SOCKS5, Mixed, Shadowsocks, and Tunnel listeners.

## 文件
- `src/components/editors/inbounds/InboundsEditor.tsx`

## UI 结构
List/detail split layout. Left sidebar lists all listeners with name and `type:port` summary; right pane shows a detail form for the selected listener. An "Add" button creates a default HTTP listener on port 8080. Fields are shown/hidden based on the selected listener type.

## 配置字段
- `listeners[]` (top-level array)
  - `name` — listener name
  - `type` — (`http` | `socks` | `mixed` | `shadowsocks` | `tunnel`)
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
