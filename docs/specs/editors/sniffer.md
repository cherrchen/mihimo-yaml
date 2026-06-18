# sniffer

## 职责
Configures domain sniffing settings for detecting real target domains from TLS/HTTP traffic.

## 文件
- `src/components/editors/sniffer/SnifferEditor.tsx`

## UI 结构
Two-column grid form. Each field is wrapped in `FieldWrapper` with a label and description. Boolean fields are checkboxes; comma-separated list fields are text inputs split/joined automatically.

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
- `TextField`
- `BoolField`

## 关联引擎
None.

## 关联测试
None.
