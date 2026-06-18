# tun

## 职责
Configures the TUN virtual network interface for transparent proxy — device name, protocol stack, routing, DNS hijack, and advanced performance options.

## 文件
- `src/components/editors/tun/TunEditor.tsx`

## UI 结构
Two-column grid form with header. Advanced fields (GSO, GSO max size, endpoint-independent NAT, route-exclude-address) are collapsed by default behind a chevron toggle in `FieldWrapper`.

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
- `TextField`
- `NumberField`
- `BoolField`
- `SelectField`
- `TUN_STACKS` from `@/lib/constants`

## 关联引擎
None.

## 关联测试
None.
