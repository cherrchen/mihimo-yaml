# tunnels

## 职责
Configures tunnel definitions for port forwarding — each tunnel listens on a local address:port and forwards traffic to a target through a specified proxy.

## 文件
- `src/components/editors/tunnels/TunnelsEditor.tsx`

## UI 结构
Stacked list of tunnel cards with an "add tunnel" button at the top. Each card is a bordered block with a header (tunnel number + delete button) and a 2-column form grid inside. Shows a placeholder message when the list is empty.

## 配置字段
- `tunnels` (`TunnelConfig[]`) — each entry has:
  - `network` (`string[]`) — comma-separated protocol list (tcp, udp)
  - `address` (`string`) — listen address:port
  - `target` (`string`) — target address:port
  - `proxy` (`string`) — proxy name to route through

## 使用组件
- `FieldWrapper`
- `TextField`
- `lucide-react` (Plus, Trash2)
- `TunnelConfig` type from `@/schema/model`

## 关联引擎
None.

## 关联测试
None.
