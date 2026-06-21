# tun

## 职责
Configures the TUN virtual network interface for transparent proxy — device name, protocol stack, routing, DNS hijack, and advanced performance options.

## 文件
- `src/components/editors/tun/TunEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **TUN**。**启用与路由**常显；**DNS 与路由范围**、**Linux 重定向**、**性能与 NAT**通过 `EditorSection` 整组默认折叠，不再逐字段折叠。整页标记为仅 mihomo，字段帮助使用中文 Tooltip。字段网格在窄屏为单列，`md` 及以上为双列。

## 配置字段
- `tun.enable` (`boolean`)
- `tun.stack` (`string`) — system / gvisor / mixed
- `tun.device` (`string`)
- `tun.auto-route` (`boolean`)
- `tun.auto-redirect` (`boolean`, Linux only)
- `tun.auto-detect-interface` (`boolean`)
- `tun.dns-hijack` (`string[]`) — comma-separated address:port list
- `tun.strict-route` (`boolean`)
- `tun.mtu` (`number`)
- `tun.gso` (`boolean`, advanced)
- `tun.gso-max-size` (`number`, advanced)
- `tun.endpoint-independent-nat` (`boolean`, advanced)
- `tun.route-address` (`string[]`) — comma-separated CIDR list
- `tun.route-exclude-address` (`string[]`, advanced) — comma-separated CIDR list

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `TextField`
- `NumberField`
- `BoolField`
- `SelectField`
- `TUN_STACKS` from `@/lib/constants`

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`（标题、分组、Tooltip、空值下拉和响应式布局）

## 关联测试
None.
