# import

## 职责
提供 YAML 配置文件导入功能，支持本地文件、远程 URL 和剪贴板三种导入方式。

## 文件
- `src/components/import/ImportDialog.tsx`
- `src/components/import/FileImport.tsx`
- `src/components/import/UrlImport.tsx`
- `src/components/import/ClipboardImport.tsx`

## 导出组件
| 组件 | 说明 |
|------|------|
| `ImportDialog` | 导入弹窗容器，以标签页切换三种导入模式 |
| `FileImport` | 本地文件导入：拖拽/选择 `.yaml` / `.yml` 文件，预览后解析导入 |
| `UrlImport` | URL 远程拉取：输入订阅链接拉取 YAML，支持 CORS 代理和手动粘贴回退 |
| `ClipboardImport` | 剪贴板导入：一键读取剪贴板或手动粘贴 YAML 内容 |

## UI 结构
`ImportDialog` 渲染为一个模态对话框，顶部显示标题"导入配置"和关闭按钮，下方为三个标签页（文件导入 / URL 拉取 / 剪贴板），通过 `initialTab` 控制初始激活标签，当前激活的标签页内容由对应子组件渲染。

- **FileImport**：初始状态显示拖拽上传区域（支持拖放和点击选择文件），选择文件后切换为预览模式，展示文件内容并通过"确认导入"按钮解析 YAML 并写入 store。
- **UrlImport**：输入框 + "拉取"按钮获取远程 YAML。遇到 CORS 错误时展示三种回退方案：手动粘贴、切换文件导入、配置 CORS 代理。获取内容后进入预览确认流程。
- **ClipboardImport**：提供"从剪贴板读取"按钮（调用 Clipboard API）和手动粘贴文本框，确认后解析导入。

所有导入成功后均调用 `setActiveSection('general')` 跳转到通用配置编辑区。

## 依赖
- **状态管理**: `useConfigStore` (setConfig, setConfigYaml, setConfigName), `useUiStore` (setActiveSection)
- **工具函数**: `parseYaml` from `@/schema/yaml`
- **UI 组件**: `Button` from `@/components/ui/button`, `TextField` from `@/components/editors/shared/fields`
- **图标**: `lucide-react` (FileUp, Link, Clipboard, Upload, FileText, AlertTriangle, ClipboardPaste)

## 关联测试
暂无直接组件测试。
