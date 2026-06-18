# pages

## 职责
提供应用的三个顶级页面视图：配置工作台（Dashboard）、设置和关于页面，通过 NavTree 导航或 `setActiveSection` 切换。

## 文件
- `src/pages/Dashboard.tsx`
- `src/pages/Settings.tsx`
- `src/pages/About.tsx`

## 导出组件
| 组件 | 说明 |
|------|------|
| `DashboardPage` | 配置工作台：快速开始入口（新建/导入）、模板库、最近项目列表 |
| `SettingsPage` | 设置页：主题切换、CORS 代理配置、自定义 UA、External Controller 连接测试、版本信息 |
| `AboutPage` | 关于页：项目说明、许可证（CC BY-NC 4.0）、Credits、技术栈信息 |

## UI 结构
`DashboardPage` 居中布局（`max-w-3xl`），自上而下三个板块：
1. **快速开始**：2x2 网格，包含"新建配置"（调用 `resetConfig`）、"导入 YAML 文件"、"从 URL 拉取"、"粘贴 YAML"四个入口按钮，后三个打开 `ImportDialog` 并设置对应 `initialTab`
2. **模板库**：5 个预设模板列表（最小配置、Fake-IP、Stash 兼容、国内直连、链式代理示例），点击后加载对应配置
3. **最近项目**：从 IndexedDB (Dexie) 加载最近 10 个草稿，支持点击打开和删除操作

`SettingsPage` 居中布局，各配置项以圆角边框卡片展示：
- 主题切换（三个按钮：浅色/深色/跟随系统）
- CORS 代理 URL 配置（含隐私风险提示）
- 自定义 User-Agent
- External Controller 连接配置（API 地址 + Secret，支持连接测试并显示代理数量）
- 版本信息

`AboutPage` 纯静态信息页，以卡片形式展示项目说明、许可证条款、Credits 列表（mihomo MetaCubeX、mihomo 官方文档、meta-rules-dat、Stash 文档）和技术栈。

## 依赖
- **状态管理**: `useConfigStore` (setConfig, setConfigName, resetConfig, setCurrentDraftId), `useUiStore` (theme, setTheme, setActiveSection)
- **工具函数**: `parseYaml` from `@/schema/yaml`, 模板常量 from `@/schema/defaults` (MINIMAL_CONFIG, FAKE_IP_TEMPLATE, STASH_TEMPLATE, CN_DIRECT_TEMPLATE, CHAIN_PROXY_TEMPLATE)
- **hooks**: `useExternalController` from `@/hooks/useExternalController`
- **UI 组件**: `Button` from `@/components/ui/button`, `TextField` from `@/components/editors/shared/fields`, `SensitiveField` from `@/components/editors/shared/SensitiveField`, `ImportDialog` from `@/components/import/ImportDialog`
- **数据**: `db` from `@/lib/db` (Dexie IndexedDB)
- **图标**: `lucide-react` (FileUp, Link, Clipboard, FileText, Plus, Loader2, Trash2)

## 关联测试
暂无直接页面组件测试。
