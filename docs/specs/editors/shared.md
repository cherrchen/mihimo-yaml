# editor-shared

## 职责
提供配置编辑器共用的字段、分组、连续列表和双栏布局原语，集中维护交互语义与尺寸约束。

## 文件
- `src/components/editors/shared/EditorList.tsx`
- `src/components/editors/shared/SplitEditorLayout.tsx`
- `src/components/editors/shared/fields.tsx`

## 导出组件
- `EditorList` — 单一圆角边框列表容器。
- `EditorListRow` — 根据 `isLast` 统一添加行分隔线。
- `BoolField` — 配置布尔值的共享 shadcn Switch 适配层，保留 `value`、`onChange`、`disabled` API，并支持 `ariaLabel`。
- `SplitEditorLayout` — 双栏编辑器根容器。
- `SplitEditorListPane` — 占页面 30% 且最小 14rem 的统一列表栏。
- `SplitEditorDetailPane` — 占据剩余宽度、可滚动且内容居中的详情栏。

## 使用方
- 路由规则和 Hosts 共用 `EditorList` / `EditorListRow`。
- 所有编辑器布尔字段共用 `BoolField`；配置编辑页面不再直接渲染原生 checkbox。
- Inbounds、Proxies、ProxyProviders、ProxyGroups、SubRules 共用双栏布局组件。
