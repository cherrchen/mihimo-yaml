# ebpf

## 职责
Configures Linux eBPF packet forwarding (`ebpf` section).

## 文件
- `src/components/editors/ebpf/EbpfEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **Linux eBPF转发设置**。**eBPF 转发**常显，**接口映射**默认折叠；两个分组均显示“仅 mihomo”标记。接口列表继续使用逗号分隔输入，字段网格在窄屏为单列、`md` 及以上双列。

## 配置字段
- `ebpf.enable`
- `ebpf.bpf-fs-path`
- `ebpf.auto-redir`
- `ebpf.redirect-to-tun`

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `BoolField`
- `TextField`

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`

## 关联测试
None.
