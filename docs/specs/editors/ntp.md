# ntp

## 职责
Configures the built-in NTP time synchronization client.

## 文件
- `src/components/editors/ntp/NtpEditor.tsx`

## UI 结构
Simple single-page form layout with a heading and a 2-column grid of form fields.

## 配置字段
- `ntp` (top-level object)
  - `enable` — enable NTP sync
  - `write-to-system` — write synced time to system clock (requires root)
  - `server` — NTP server address (e.g. `time.apple.com`)
  - `port` — NTP server port (default `123`)
  - `interval` — sync interval in minutes
  - `dialer-proxy` — proxy for NTP traffic (e.g. `DIRECT`)

## 使用组件
- `FieldWrapper`
- `TextField`, `NumberField`, `BoolField`

## 关联引擎
(No dedicated engine module)

## 关联测试
(No component-specific tests)
