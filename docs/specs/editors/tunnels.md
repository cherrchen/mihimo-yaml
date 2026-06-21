# tunnels

## 职责
Configures tunnel definitions for port forwarding — each tunnel listens on a local address:port and forwards traffic to a target through a specified proxy.

## 文件
- `src/components/editors/tunnels/TunnelsEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **隧道**。**端口转发**核心分组保留堆叠卡片和新增入口，并显示整组“仅 mihomo”标记。卡片字段在窄屏为单列、`md` 及以上为双列；空列表提供可直接创建第一条隧道的空状态，图标按钮具有可访问名称。

## 配置字段
- `tunnels` (`TunnelConfig[]`) — each entry has:
  - `network` (`string[]`) — comma-separated protocol list (tcp, udp)
  - `address` (`string`) — listen address:port
  - `target` (`string`) — target address:port
  - `proxy` (`string`) — proxy name to route through

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `TextField`
- `lucide-react` (Plus, Trash2)
- `TunnelConfig` type from `@/schema/model`

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`（标题、空状态、增删和响应式卡片）

## 关联测试
None.
