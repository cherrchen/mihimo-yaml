# iptables

## 职责
Configures Linux iptables transparent proxy / TPROXY forwarding rules.

## 文件
- `src/components/editors/iptables/IptablesEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **Linux iptables设置**。所有字段位于常显的 **透明代理转发** 分组，并显示整组“仅 mihomo”标记。字段帮助通过中文 Tooltip 展示；窄屏单列、`md` 及以上双列。

## 配置字段
- `iptables` (top-level object)
  - `enable` — enable iptables rules
  - `inbound-interface` — network interface name (e.g. `eth0`)
  - `dns-redirect` — redirect DNS requests through the proxy
  - `bypass` — array of addresses to bypass (comma-separated input)

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `BoolField`, `TextField`

## 关联引擎
(No dedicated engine module)

## 关联测试
- `src/__tests__/components/FormEditorUx.test.tsx`
