# ebpf

## 职责
Configures Linux eBPF packet forwarding (`ebpf` section).

## 文件
- `src/components/editors/ebpf/EbpfEditor.tsx`

## UI 结构
Two-column form with a heading and platform note. String fields that accept comma-separated values for interface lists.

## 配置字段
- `ebpf.enable`
- `ebpf.bpf-fs-path`
- `ebpf.auto-redir`
- `ebpf.redirect-to-tun`

## 使用组件
- `FieldWrapper`
- `BoolField`
- `TextField`

## 关联引擎
None.

## 关联测试
None.
