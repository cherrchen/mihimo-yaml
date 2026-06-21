# experimental

## 职责
Configures experimental/advanced QUIC and dialer options.

## 文件
- `src/components/editors/experimental/ExperimentalEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **Experimental**。三个布尔字段位于常显的 **实验性网络选项** 分组，字段帮助通过中文 Tooltip 展示；窄屏单列、`md` 及以上双列。

## 配置字段
- `experimental.quic-go-disable-gso`
- `experimental.quic-go-disable-ecn`
- `experimental.dialer-ip4p-convert`

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `BoolField`

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`

## 关联测试
None.
