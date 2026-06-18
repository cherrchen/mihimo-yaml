# layout

## 职责
提供应用的整体布局框架，包括顶栏导航、侧边导航树和主内容区域的三栏式外壳。

## 文件
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/NavTree.tsx`

## 导出组件
| 组件 | 说明 |
|------|------|
| `AppShell` | 应用外壳布局：固定顶栏 + 左侧侧边栏 + 中央主区域 + 右侧预览面板；接收折叠状态，但当前 UI 没有触发 toggle 的按钮 |
| `Header` | 顶部工具栏：显示应用名称和配置名（可编辑）、撤销/重做/保存按钮、导入/导出入口、主题切换 |
| `NavTree` | 左侧导航树：带有搜索过滤功能的配置区段导航，支持父子分组和动态徽章 |

## UI 结构
`AppShell` 采用全高 flex 布局（`h-screen flex flex-col`）：
- **顶部**：固定高度 12（`h-12`），渲染 `header` 子节点
- **中部**：flex-1 三栏横向布局
  - **左侧** `sidebar`：宽度由 `sidebarWidth` 控制，支持 `sidebarOpen` 开合动画；当前没有可见 toggle，窄屏（<768px）下宽度为 0
  - **中央** `children`：主编辑区，占据剩余空间
  - **右侧** `previewPanel`：固定宽度 360px，在 `max-lg` 断点下隐藏

`Header` 水平三区布局：
- **左侧**：应用名 "mihomo-yaml" + 可点击编辑的配置名
- **中部**：撤销/重做按钮（根据 `canUndo`/`canRedo` 禁用）+ 保存按钮（有未保存更改时高亮）
- **右侧**：导入按钮（打开 ImportDialog）+ 导出下拉菜单（Mihomo 完整导出 / Stash 兼容导出）+ 主题循环切换按钮（浅色 → 深色 → 跟随系统）

`NavTree` 垂直布局：
- **顶部**：搜索输入框，实时过滤导航项（匹配标签名含子项展开）
- **中部**：导航列表，每项带图标和标签。`proxies` 和 `rules` 项显示动态计数徽章。有 `children` 的项（通用/入站/高级）在激活或搜索时展开子项
- **底部**：固定位置的"设置"和"About / 关于"链接

## 依赖
- **状态管理**: `useUiStore` (theme, setTheme, activeSection, setActiveSection), `useConfigStore` (config, configName, setConfigName, undo, redo, canUndo, canRedo, hasUnsavedChanges, triggerSave)
- **UI 组件**: `Button` from `@/components/ui/button`, `Badge` from `@/components/ui/badge`
- **子模块**: `ImportDialog` from `@/components/import/ImportDialog`, `ExportDialog` from `@/components/export/ExportDialog`
- **图标**: `lucide-react` (Sun, Moon, Monitor, FileDown, FileUp, Undo2, Redo2, Save, LayoutDashboard, Settings, Globe, Server, ShieldCheck, Share2, Rss, Network, ArrowLeftRight, Route, FolderTree, Workflow, Link, Clock, FlaskConical, SlidersHorizontal)
- **工具**: `cn` from `@/lib/utils`

## 关联测试
- `src/__tests__/components/NavTree.test.tsx` — 测试导航树渲染、搜索过滤、子项展开、平台编辑器分组
