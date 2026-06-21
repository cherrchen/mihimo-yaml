# ntp

## 职责
Configures the built-in NTP time synchronization client.

## 文件
- `src/components/editors/ntp/NtpEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **NTP**。**同步服务**常显；**系统与路由**默认折叠。字段帮助通过中文 Tooltip 展示，字段网格在窄屏为单列、`md` 及以上为双列。

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
- `EditorSection`
- `TextField`, `NumberField`, `BoolField`

## 关联引擎
(No dedicated engine module)

## 关联测试
- `src/__tests__/components/FormEditorUx.test.tsx`
