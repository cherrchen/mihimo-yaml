# sniffer

## 职责
Configures domain sniffing settings for detecting real target domains from TLS/HTTP traffic.

## 文件
- `src/components/editors/sniffer/SnifferEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **Sniffer**。**基本嗅探**常显；**协议与端口**、**域名例外**整组默认折叠。整页标记为仅 mihomo，字段帮助通过中文 Tooltip 展示；逗号分隔列表的读写行为保持不变。字段网格在窄屏为单列，`md` 及以上为双列。

## 配置字段
- `sniffer.enable` (`boolean`) — master enable switch
- `sniffer.override-destination` (`boolean`) — override request destination with sniffed domain
- `sniffer.force-dns-mapping` (`boolean`) — force DNS mapping for sniffed domains
- `sniffer.parse-pure-ip` (`boolean`) — also sniff connections to raw IP addresses
- `sniffer.sniffing` (`string[]`) — comma-separated protocol list (HTTP, TLS, QUIC, etc.)
- `sniffer.force-domain` (`string[]`) — domains to always force-sniff
- `sniffer.skip-domain` (`string[]`) — domains to skip sniffing
- `sniffer.port-whitelist` (`string[]`) — ports to allow sniffing on

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `TextField`
- `BoolField`

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`（标题、分组、折叠和响应式布局）

## 关联测试
None.
