# preview

## 职责
提供配置的实时 YAML 预览、问题诊断、差异对比和兼容性报告查看功能。

## 文件
- `src/components/preview/YamlPreview.tsx`
- `src/components/preview/YamlDiff.tsx`

## 导出组件
| 组件 | 说明 |
|------|------|
| `YamlPreview` | 右侧预览面板：缓存 YAML / 完整性问题 / 差异对比 / 兼容性占位四个视图 |
| `YamlDiff` | YAML 差异比对组件：行级 diff 展示，绿色标记新增、红色标记删除，底部统计变更行数 |

## UI 结构
`YamlPreview` 占据侧边面板全高，采用 flex 纵向布局：
- **标签栏**：四个标签页 — "YAML"（≤5000 行使用 CodeMirror，超长文档使用带行号的虚拟列表）、"问题"（超过 200 项时虚拟化）、"对比"、"兼容性"
- **内容区**：根据 `previewMode` 切换渲染对应视图
- **底部状态栏**：显示派生中的状态，完成后显示当前 YAML 的行数和字符数

`YamlDiff` 全高布局：
- **内容区**：行级 diff，使用 `diff` 库的 `diffLines` 计算差异。新增行绿色背景带 `+` 前缀，删除行红色背景带 `-` 前缀，未变更行灰色。空状态（新旧一致或均为空）时居中显示"没有差异"
- **底部状态栏**：显示新增行数、删除行数和变更处数

## 依赖
- **状态管理**: `useConfigStore` (configYaml, integrityReport, derivationPending), `useUiStore` (previewMode, setPreviewMode, theme)
- **第三方库**: `@tanstack/react-virtual`, `@uiw/react-codemirror`, CodeMirror YAML/theme packages, `diff`
- **UI 组件**: `Badge` from `@/components/ui/badge`
- **工具**: `cn` from `@/lib/utils`

## 关联测试
- `src/__tests__/components/YamlDiff.test.tsx` — 测试相同文本无差异、新增行显示、删除行显示、变更计数、空文本处理
- `src/__tests__/components/YamlPreview.test.tsx` — 测试超长 YAML 和问题列表的有界虚拟渲染
- `src/__tests__/yaml-diff.test.ts` — 测试 diffLines 工具函数的增加/删除/修改/空文本/多段 YAML 等场景
