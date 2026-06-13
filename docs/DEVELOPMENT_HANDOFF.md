# mihomo-yaml 开发交接文档

> 本文档面向下一个接手本项目的 AI agent 或人类开发者，旨在最大程度降低交接成本。
> 所有内容均基于实际仓库状态验证，不包含编造或推测。

---

## 1. 项目概览

| 项目 | 说明 |
|------|------|
| **项目名称** | mihomo-yaml |
| **项目类型** | 纯前端 SPA（无后端依赖） |
| **功能简述** | 创建、导入、图形化编辑、校验并导出 mihomo / Stash YAML 配置文件 |
| **技术栈** | React 19 + TypeScript 6.0 + Vite 8 + Tailwind CSS 4 + Zustand + Dexie + CodeMirror 6 + React Flow |
| **包管理器** | npm |
| **当前版本** | 0.1.0 |
| **当前完成度** | 约 95%——P0/P1/P2 全部完成，20 个配置模块编辑器全部实现，Zod 运行时校验已集成，YAML diff 已实现，92 个测试全部通过 |

### 当前状态关键结论

| 检查项 | 状态 |
|--------|------|
| 可启动 (`npm run dev`) | ✅ 通过 |
| 可构建 (`npm run build`) | ✅ 通过，生成 `dist/` |
| TypeScript typecheck | ✅ 通过，0 错误 |
| ESLint | ✅ 0 错误，0 warning（已全部修复） |
| 单元测试 | ✅ 92/92 通过（18 个测试文件） |
| mihomo YAML 导入 | ✅ 文件/URL/剪贴板/模板四种方式，导入后自动关闭对话框并设置配置名，含 Zod 运行时字段级校验 |
| mihomo YAML 导出 | ✅ 下载 .yaml 或复制到剪贴板 |
| Stash 兼容导出 | ✅ 含兼容性报告，DNS 多服务器策略交互已修复 |
| YAML diff 对比 | ✅ 预览面板"对比"标签，行级差异高亮 |
| 链式代理静态测试 | ✅ dialer-proxy + relay 链路验证 |
| unknownFields round-trip | ✅ 导入→编辑→导出不丢失 |
| YAML 注释保留 | ⚠️ 已替换为 yaml 包（支持注释），基础注释提取已实现 |
| 自动保存 | ✅ localStorage + Dexie IndexedDB 双层持久化，支持配置改名不创建重复记录 |
| 撤销/重做 | ✅ 50 步历史深度 |
| 响应式布局 | ⚠️ 基本断点已添加（预览面板 ≤1024px 隐藏，按钮文字 ≤768px 隐藏） |

---

## 2. 当前 Git 状态

| 项目 | 值 |
|------|-----|
| **当前分支** | `main` |
| **当前 commit** | `b5be08d` |
| **HEAD 对应** | `merge: fix dashboard quick-start button text overflow on narrow viewports` |
| **未提交改动** | 无（working tree clean） |
| **dev/* 分支** | 38 个（见下方） |
| **已合并到 main** | 是（所有 dev 分支均已合并） |
| **已 push 到 origin/main** | 是 |
| **git worktree** | 1 个（`C:/Users/chenj/Desktop/Coding/mihomo-yaml`） |
| **远程仓库** | `git@github.com:cherrchen/mihimo-yaml.git` |

### dev 分支列表

```
dev/add-component-tests
dev/add-custom-ua-setting
dev/add-external-controller
dev/add-missing-config-ui
dev/add-yaml-diff
dev/add-zod-validation
dev/fix-autosave-name-persistence
dev/fix-dashboard-button-overflow
dev/fix-delete-recent
dev/fix-drag-reorder-rules-proxygroups
dev/fix-editable-config-name
dev/fix-editor-panel-center
dev/fix-eslint-warnings
dev/fix-export-hover
dev/fix-hide-scrollbars
dev/fix-import-autoclose
dev/fix-import-set-name
dev/fix-import-tabs
dev/fix-navtree-search-color
dev/fix-page-margins
dev/fix-rule-click-edit
dev/fix-save-button
dev/fix-shared-input-style
dev/fix-stash-dns-strategy-export
dev/fix-stringlist-drag-reorder
dev/fix-system-theme-icon
dev/fix-theme-transparency
dev/fix-yaml-preview-scroll
dev/fix-yaml-scroll-v2
dev/mihomo-config-editor
dev/refactor-proxy-discriminated-union
dev/remove-header-border
dev/replace-recent-icon-with-delete
dev/responsive-layout
dev/unify-input-general-style
dev/unify-input-styles
dev/unify-shared-components-v2
dev/yaml-comment-preservation
```

### 最近合并到 main 的 commit（按时间倒序）

```
b5be08d merge: fix dashboard quick-start button text overflow on narrow viewports
c33e17d fix: prevent dashboard quick-start buttons text overflow on narrow viewports
0f010b5 merge: add responsive layout breakpoints
8482a3c feat: add responsive layout breakpoints - hide preview panel on mobile
641c68d merge: replace js-yaml with yaml package for comment preservation support
044ca39 feat: replace js-yaml with yaml package, add comment extraction on YAML parse
7bd0bb5 merge: add iptables, ebpf and clash-for-android editors
5c44fd3 feat: add iptables, ebpf, and clash-for-android editor components
9f98e01 merge: add Proxy discriminated union types and field helpers
d599a42 feat: add ProxyType discriminated union, isProxyType guard, getProxyTypeFields
353d7f1 merge: add component rendering tests
0af38c9 feat: add component rendering tests for YamlDiff, GeneralEditor, NavTree, ExportDialog
d52e0af merge: fix all ESLint react-hooks/exhaustive-deps warnings
0506392 fix: resolve all 6 ESLint react-hooks/exhaustive-deps warnings
960a1b1 merge: add YAML diff viewer with comparison tab
608160c feat: add YAML diff viewer with line-level change highlighting and comparison tab
d72c5f0 merge: add external-controller connection hook
409402c feat: add external-controller connection hook with test button in settings
ae06876 merge: add Zod runtime schema validation for YAML import
e5987b0 feat: add Zod runtime schema validation for YAML import
6716e2c merge: fix Stash DNS strategy export to apply user choices
1988ddb fix: apply DNS strategy choices to Stash exported YAML
3006cfc merge: add custom User-Agent setting for URL import
82e6c57 feat: add customizable User-Agent for URL import
```

---

## 3. 开发流程回顾

本轮开发遵循以下流程：

1. ✅ 从 `main` 拉取最新
2. ✅ 在 `dev/*` 分支进行开发（每轮修复 1 个或多个相关 bug）
3. ✅ 开发完成后在 dev 分支运行 `typecheck` / `lint` / `build` / `test`
4. ✅ 全部通过后合并到 `main`（使用 `--no-ff`）
5. ✅ 在 `main` 再次运行 4 个验证命令（全量通过）
6. ✅ push 到 `origin/main`

**无偏差**。所有流程均按规范执行。

---

## 4. 功能完成情况总览

| 模块 | 状态 | 关键文件 | 说明 |
|------|------|----------|------|
| 工作台布局 | 已完成 | `src/components/layout/AppShell.tsx` | 3 面板（侧边栏+编辑+预览），可调整大小 |
| YAML 文件导入 | 已完成 | `src/components/import/FileImport.tsx` | 拖拽或选择 .yaml 文件，预览后确认导入，导入后自动关闭并设配置名 |
| URL 拉取 | 已完成 | `src/components/import/UrlImport.tsx` | fetch 拉取 + CORS 错误兜底（手动粘贴/文件上传/CORS proxy）+ 自定义 User-Agent 请求头 |
| 剪贴板导入 | 已完成 | `src/components/import/ClipboardImport.tsx` | readText + 手动粘贴 |
| 模板导入 | 已完成 | `src/pages/Dashboard.tsx` | 5 个内置模板 |
| 导入对话框 Tab 定位 | 已完成 | `src/components/import/ImportDialog.tsx` | 工作台按钮精确跳转到文件/URL/剪贴板 Tab |
| YAML 实时预览 | 已完成 | `src/components/preview/YamlPreview.tsx` | CodeMirror 6，YAML 语法高亮，行号，支持滚动 |
| YAML 导出 | 已完成 | `src/components/export/ExportDialog.tsx` | mihomo 完整+Stash 兼容双模式，下载/剪贴板 |
| mihomo 导出 | 已完成 | `src/schema/yaml.ts` (stringifyYamlOrdered) | 字段顺序：general→dns→hosts→... |
| Stash 导出 | 已完成 | `src/compatibility/stash.ts` | 含兼容性报告 |
| Stash DNS 单服务器策略 | 已完成 | `src/compatibility/dns-strategy.ts` + `src/components/export/ExportDialog.tsx` | DNS 多服务器策略导出交互已修复，用户选择正确应用到导出 YAML |
| unknownFields round-trip | 已完成 | `src/schema/unknown-fields.ts` | 导入→编辑→导出不丢失 |
| Zod 运行时 schema 校验 | 已完成 | `src/schema/validation.ts` | Zod schema 覆盖所有配置模块，导入时提供逐字段类型错误，集成到 integrity 检查 |
| YAML diff 对比 | 已完成 | `src/components/preview/YamlDiff.tsx` | 预览面板"对比"标签，自动对比上次版本，行级红/绿差异高亮 |
| general 配置 | 已完成 | `src/components/editors/general/GeneralEditor.tsx` | mode/log-level/ipv6/external-controller 等 |
| DNS 配置 | 已完成 | `src/components/editors/dns/DnsEditor.tsx` | nameserver 列表(含拖拽排序)/策略表格/fallback-filter |
| hosts 配置 | 已完成 | `src/components/editors/hosts/HostsEditor.tsx` | 域名→IP 映射 |
| proxy 配置 | 已完成 | `src/components/editors/proxies/ProxiesEditor.tsx` | 列表+类型分发表单（见第 10 节详细覆盖） |
| proxy-provider 配置 | 已完成 | `src/components/editors/proxy-providers/ProxyProvidersEditor.tsx` | http 预览/override/health-check |
| proxy-group 配置 | 已完成 | `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx` | 成员选择(含拖拽排序)/拓扑图 |
| rule-provider 配置 | 已完成 | `src/components/editors/rule-providers/RuleProvidersEditor.tsx` | MetaCubeX 内置模板选择器 |
| rules 配置 | 已完成 | `src/components/editors/rules/RulesEditor.tsx` | 可展开编辑/类型选择/provider 绑定/拖拽排序 |
| sub-rules 配置 | 已完成 | `src/components/editors/sub-rules/SubRulesEditor.tsx` | 子规则定义与编辑 |
| inbounds 配置 | 已完成 | `src/components/editors/inbounds/InboundsEditor.tsx` | 12+ listener 类型表单 |
| tun 配置 | 已完成 | `src/components/editors/tun/TunEditor.tsx` | 20+ 字段 |
| sniffer 配置 | 已完成 | `src/components/editors/sniffer/SnifferEditor.tsx` | 完整字段 |
| tunnels 配置 | 已完成 | `src/components/editors/tunnels/TunnelsEditor.tsx` | 列表编辑 |
| ntp 配置 | 已完成 | `src/components/editors/ntp/NtpEditor.tsx` | 6 个字段 |
| experimental 配置 | 已完成 | `src/components/editors/experimental/ExperimentalEditor.tsx` | 4 个字段 |
| iptables 配置 | 已完成 | `src/components/editors/iptables/IptablesEditor.tsx` | Linux 专用，4 个字段 |
| ebpf 配置 | 已完成 | `src/components/editors/ebpf/EbpfEditor.tsx` | Linux 专用，4 个字段 |
| clash-for-android 配置 | 已完成 | `src/components/editors/clash-for-android/ClashForAndroidEditor.tsx` | 安卓专用，2 个字段 |
| 链式代理构建器 | 已完成 | `src/components/editors/chain-builder/ChainBuilderEditor.tsx` | React Flow 拓扑 + dialer-proxy 链路列表 |
| 链式代理静态测试 | 已完成 | `src/engine/chain-validator.ts` | UDP/空组/断链/自引用检测 |
| external-controller 连接 | 部分完成 | `src/hooks/useExternalController.ts` | Settings 页提供"测试连接"按钮，已实现代理列表和延迟获取 Hook |
| 模板库 | 已完成 | `src/schema/defaults.ts` | 5 个模板 |
| 历史版本 / 自动保存 | 已完成 | `src/hooks/useAutoSave.ts` + `src/lib/db.ts` | localStorage + Dexie IndexedDB，支持改名不重复 |
| 撤销/重做 | 已完成 | `src/store/config-store.ts` | 50 步历史深度的 undo/redo |
| 拖拽排序 | 已完成 | `@dnd-kit/sortable` | DNS 服务器列表、路由规则、代理组成员均支持拖拽排序 |
| 深色模式 | 已完成 | `src/store/ui-store.ts` + `src/index.css` | light/dark/system 三模式，含 Monitor 专属图标 |
| 设置页面 | 已完成 | `src/pages/Settings.tsx` | 主题/CORS proxy/自定义 User-Agent/controller 配置 |
| 关于页面 | 已完成 | `src/pages/About.tsx` | 协议+attribution+技术栈 |
| 可编辑配置名 | 已完成 | `src/components/layout/Header.tsx` | 点击编辑，同步 localStorage + IndexedDB |
| 最近项目删除 | 已完成 | `src/pages/Dashboard.tsx` | Trash2 按钮直接删除 IndexedDB 记录 |
| 保存按钮 | 已完成 | `src/components/layout/Header.tsx` | 有未保存改动时启用，点击触发立即保存 |
| 导出菜单 hover 触发 | 已完成 | `src/components/layout/Header.tsx` | 鼠标移入显示，移出隐藏，菜单居中 |
| 全局滚动条隐藏 | 已完成 | `src/index.css` | 默认透明，hover 时显示，WebKit+Firefox |
| 页面边距统一 | 已完成 | 19 个编辑器/页面 | 统一 `p-6 max-w-3xl mx-auto` |
| 详情面板居中 | 已完成 | ProxyGroups/ProxyProviders/Inbounds | 右侧编辑面板添加 `mx-auto` |
| 组件渲染测试 | 已完成 | `src/__tests__/components/` | YamlDiff / GeneralEditor / NavTree / ExportDialog 4 个 smoke test |
| Proxy discriminated union | 部分完成 | `src/schema/model.ts` | `ProxyType` + `isProxyType` + `getProxyTypeFields` 已添加，编辑器层面应用剩余 |

---

## 5. 架构说明

### 入口和路由

- **入口文件**: `src/main.tsx` — ReactDOM.createRoot，挂载到 `index.html` 的 `#root`
- **路由方式**: 基于 Zustand 状态驱动的单页视图切换（非 react-router）。`src/App.tsx` 的 `renderEditor()` 将 `activeSection` 映射到对应编辑器组件。

### 状态管理

- **配置状态**: `src/store/config-store.ts` — Zustand store，包含当前配置（`MihomoConfig`）、撤销/重做历史栈（50 步）、YAML 字符串、完整性报告、兼容性报告、`hasUnsavedChanges`、`saveTrigger`、`currentDraftId`
- **UI 状态**: `src/store/ui-store.ts` — Zustand store，包含主题、侧边栏宽度、活动面板、预览模式、导出模式

### 关键文件路径索引

| 文件 | 职责 |
|------|------|
| `src/schema/model.ts` | 全部 TypeScript 接口定义（MihomoConfig、ProxyConfig、DnsConfig 等），含 ProxyType discriminated union |
| `src/schema/metadata.ts` | 字段元数据注册表（150+ 字段，含 mihomo/Stash 兼容性标记） |
| `src/schema/metadata-types.ts` | FieldMeta 类型定义 |
| `src/schema/yaml.ts` | YAML parse/stringify/ordered-export/clone（基于 `yaml` npm 包） |
| `src/schema/unknown-fields.ts` | 未知字段提取和注入（round-trip 保证） |
| `src/schema/validation.ts` | Zod 运行时 schema 校验（覆盖所有配置模块，导入时逐字段类型检查） |
| `src/schema/defaults.ts` | 5 个内置配置模板 |
| `src/schema/index.ts` | Schema 模块统一导出 |
| `src/compatibility/stash.ts` | Stash 兼容性引擎（字段移除、DNS 转换、报告生成） |
| `src/compatibility/dns-strategy.ts` | DNS 多服务器策略解析（auto-first/manual/block） |
| `src/engine/references.ts` | 交叉引用收集和悬挂引用检测 |
| `src/engine/cycle-detector.ts` | 代理组循环引用检测（DFS） |
| `src/engine/chain-validator.ts` | Relay + dialer-proxy 链路静态验证 |
| `src/engine/rule-validator.ts` | 规则冲突/不可达/重复检测 |
| `src/engine/integrity.ts` | 统一完整性检查入口（含 Zod 校验错误收集） |
| `src/store/config-store.ts` | 主配置 Zustand store（含 undo/redo、save 状态、currentDraftId） |
| `src/store/ui-store.ts` | UI 状态 Zustand store（previewMode 含 'diff' 对比模式） |
| `src/lib/db.ts` | Dexie IndexedDB schema（drafts/templates/history/preferences） |
| `src/lib/constants.ts` | 所有常量（PROXY_TYPES、RULE_TYPES、LISTENER_TYPES 等） |
| `src/lib/utils.ts` | cn() 工具函数（clsx + tailwind-merge） |
| `src/hooks/useAutoSave.ts` | 自动保存（localStorage + Dexie debounce），支持 currentDraftId 避免改名重复 |
| `src/hooks/useExternalController.ts` | mihomo REST API 连接 Hook（代理列表获取、延迟测试） |
| `src/components/preview/YamlDiff.tsx` | YAML 行级差异对比组件（`diff` npm 包） |

---

## 6. 数据模型和 Schema

### 根模型

`src/schema/model.ts` 定义 `MihomoConfig` 接口，包含 50+ 个顶级字段和嵌套子模型：

- `DnsConfig` — DNS 完整配置（含 fallback-filter、nameserver-policy）
- `SnifferConfig` — 域名嗅探配置
- `TunConfig` — TUN 虚拟网卡配置（30+ 字段）
- `ListenerConfig` — Inbound 监听器配置
- `ProxyConfig` — 代理节点配置（50+ 字段，含 TLS/transport/smux）
- `ProxyProviderConfig` — 代理 Provider 配置
- `ProxyGroupConfig` — 代理组配置
- `RuleProviderConfig` — 规则 Provider 配置
- `TunnelConfig` — 隧道配置
- `NtpConfig` — NTP 配置
- `ExperimentalConfig` — 实验性配置
- `IptablesConfig` — iptables 配置（Linux 专用）
- `EbpfConfig` — eBPF 配置（Linux 专用）
- `ClashForAndroidConfig` — 安卓客户端配置

### Proxy 模型

`ProxyConfig` 接口使用"扁平化"设计：所有 proxy 类型的字段都在同一个接口上，通过 `type` 字段区分。

**优点**: 简单，不需要 discriminated union
**缺点**: TypeScript 无法在编译时检查类型专属字段的必填性

> 已补充 `ProxyType` discriminated union + `isProxyType` + `getProxyTypeFields` 辅助函数用于类型安全的编辑器开发。

### unknownFields 保存

`MihomoConfig._unknownFields` 是一个 `Record<string, unknown>`，存储导入 YAML 中未建模的顶级字段。通过 `src/schema/unknown-fields.ts` 的 `extractUnknownFields()` 和 `injectUnknownFields()` 实现 round-trip。

### YAML 注释保存

`MihomoConfig._comments` 存储导入时提取的 YAML 注释（`Record<string, string[]>`）。`parseYaml()` 通过 `yaml` 包的 `parseDocument()` 提取顶层注释。

### Zod 校验错误

`MihomoConfig._validationErrors` 存储导入时 Zod 校验产生的字段级类型错误，由 integrity 检查收集并在 YAML 预览"问题"标签中展示。

### 字段元数据

`src/schema/metadata.ts` 通过 `f()` 工厂函数集中维护 150+ 个字段的元数据，包括：

- YAML key 名称和路径
- TypeScript 类型
- 是否必填
- mihomo / Stash 支持标记
- 枚举值列表
- 描述和示例
- Stash 导出动作（remove/warn/transform/block）

### 当前覆盖的字段

覆盖了 mihomo 文档中的主要配置模块（general/dns/hosts/sniffer/tun/inbounds/proxies/proxy-providers/proxy-groups/rule-providers/rules/sub-rules/tunnels/ntp/experimental），共计约 150+ 个字段。

### 仍缺少的字段

- 部分 proxy 类型的高级嵌套字段（如 `xhttp-opts.reuse-settings` 的完整子字段）在 UI 中未全部暴露
- `profile` 配置段已建模且有元数据，但 General 编辑器中部分字段未展示

### TypeScript 类型和 Zod 的关系

`zod` (v4.4.3) **已使用**。`src/schema/validation.ts` 维护完整的 Zod schema（覆盖 `MihomoConfig` 及所有子配置），`parseYaml()` 导入时自动运行校验，逐字段类型错误收集到 `_validationErrors`，并在 integrity 报告的"问题"标签中展示。Zod schema 使用 `.passthrough()` 确保未知字段不被拒绝。

### Proxy 类型系统

`src/schema/model.ts` 新增：
- `ProxyType` — discriminated union 类型（`'ss' | 'ssr' | 'http' | ...`）
- `isProxyType(type)` — 类型守卫函数
- `getProxyTypeFields(type)` — 返回给定代理类型的所有相关字段名（基础字段 + TLS + 传输层 + 类型专属字段）

编辑器可通过 `getProxyTypeFields()` 动态决定哪些表单区域需要展示。

---

## 7. YAML 导入 / 导出流程

### 导入流程

1. 用户通过 FileImport / UrlImport / ClipboardImport 获取 YAML 字符串
2. `src/schema/yaml.ts` 的 `parseYaml(yamlString)` 调用 `YAML.parse()` 解析
3. `extractUnknownFields()` 将已知字段和未知字段分离
4. `validateConfig(raw)` 运行 Zod schema 校验，逐字段类型错误存入 `_validationErrors`
5. `YAML.parseDocument()` 提取顶层注释存入 `_comments`
6. 已知字段写入 Zustand config store，未知字段存入 `config._unknownFields`
7. 导入成功后自动设置配置名（FileImport 用文件名，UrlImport 用 "从URL导入"，Clipboard 用 "从剪贴板导入"）
8. 解析错误通过 try-catch 捕获，显示错误消息给用户
9. 对话框自动关闭

### 导出流程

1. `stringifyYamlOrdered(config)` 将 config 按预定义顺序组装为 Record
2. 跳过空数组、空对象、undefined、null 值，跳过 `_` 前缀的内部字段
3. `injectUnknownFields()` 将 `_unknownFields` 追加到输出末尾
4. `YAML.stringify()` 生成 YAML 字符串（`indent: 2`, `lineWidth: 0`）
5. 通过 ExportDialog（hover 触发菜单）下载 .yaml 或复制到剪贴板

### 字段顺序

`stringifyYamlOrdered` 使用 `SECTION_ORDER` 数组定义推荐顺序：
`mode → log-level → ... → dns → hosts → sniffer → tun → proxies → proxy-providers → proxy-groups → rule-providers → rules → sub-rules → tunnels → ntp → experimental`

### 特殊字符串和引号

- `YAML.stringify()` 默认仅在必要时添加引号
- `lineWidth: 0` 禁用自动换行

### 注释保留

⚠️ **部分支持**。已从 `js-yaml` 替换为 `yaml` 包（`npm: yaml`），`parseYaml()` 通过 `parseDocument()` 提取顶层注释存入 `_comments`。当前暂未在 stringify 时注入注释，后续可基于 `yaml` 包的 `Document` API 实现完整 round-trip。

---

## 8. mihomo 导出策略

### 导出入口

`src/components/export/ExportDialog.tsx`（mode='mihomo'）

### 流程

1. 调用 `generateMihomoReport(config)` → `src/compatibility/stash.ts`
2. 检测 `global-client-fingerprint` 等已弃用字段，生成警告
3. `stringifyYamlOrdered(config)` 直接输出完整 YAML
4. 允许导出（即使有警告，仅阻止 error 级别的 incompatible 配置）

### 阻止导出的条件

- mihomo 完整模式**没有**硬阻止条件（仅生产 warning）

### 未覆盖的 mihomo 配置项

- 部分 TUN 高级字段在 UI 中未暴露
- `tuic-server` 配置的完整 UI

---

## 9. Stash 导出策略

### 导出入口

`src/components/export/ExportDialog.tsx`（mode='stash'）

### 流程

1. `generateStashReport(config)` → `src/compatibility/stash.ts`
2. 按 `STASH_REMOVE_FIELDS`（43 个顶级字段）和 `STASH_DNS_REMOVE_FIELDS`（17 个 DNS 字段）移除不支持的字段
3. DNS 特殊处理：`transformDnsForStash()` 移除 enhanced-mode/fake-ip-range/use-hosts 等，将 `respect-rules` 转换为 `follow-rule`
4. 检测不支持的 proxy 类型和 rule 类型，标记为 error
5. 检测 sub-rules 存在，标记为 error
6. 生成兼容性报告（removed/warnings/errors/transformed 计数）
7. 如有多服务器 DNS 策略，弹出 `DnsStrategyDialog` 让用户选择处理方式

### DNS 策略处理

三选一策略：

1. **自动选择第一个** — 默认，安静处理
2. **用户手动选择** — 弹出对话框，逐条选择
3. **阻止导出** — 拒绝导出直到解决

三种策略通过 `src/compatibility/dns-strategy.ts` 的 `resolveSingleServerDns()` 实现。UI 通过 `src/components/export/DnsStrategyDialog.tsx` 提供交互。

### 静默丢字段风险

**存在但可控**。`STASH_REMOVE_FIELDS` 集合中的字段在导出时会被静默删除，但同时会生成警告级别的兼容性报告条目。导出前用户可在 `CompatibilityReport` 组件中看到全部变更。

---

## 10. Proxy / Proxy Group 覆盖情况

### Proxy 类型覆盖

| Proxy 类型 | 编辑器支持 | 说明 |
|-----------|-----------|------|
| DIRECT | ✅ 仅 YAML | 内置策略，无表单（通过规则目标下拉可用） |
| DNS | ✅ 仅 YAML | 内置策略 |
| REJECT / REJECT-DROP / COMPATIBLE / PASS | ✅ 仅 YAML | 内置策略 |
| Shadowsocks (ss) | ✅ 完整表单 | cipher/password/plugin/udp-over-tcp |
| ShadowsocksR (ssr) | ✅ 类型选择可用 | 基础字段 |
| HTTP | ✅ 完整表单 | username/password/tls/headers |
| SOCKS5 | ✅ 完整表单 | username/password/tls |
| VMess | ✅ 完整表单 | uuid/alterId/cipher/tls/servername/network/transport |
| VLESS | ✅ 完整表单 | uuid/flow/tls/network/transport |
| Trojan | ✅ 完整表单 | password/tls/sni/network/transport |
| Snell | ✅ 完整表单 | psk/obfs-opts |
| Hysteria | ✅ 完整表单 | auth/up/down/obfs/sni/alpn |
| Hysteria2 | ✅ 完整表单 | password/up/down/obfs/sni/skip-cert-verify |
| TUIC | ✅ 完整表单 | uuid/password/congestion-controller/disable-sni |
| WireGuard | ✅ 完整表单 | private-key/public-key/ip/ipv6/mtu/allowed-ips |
| SSH | ✅ 完整表单 | username/password(private-key)/host-key |
| AnyTLS | ✅ 类型选择可用 | 高级字段在 YAML 预览编辑 |
| Mieru | ✅ 类型选择可用 | 同上 |
| Sudoku | ✅ 类型选择可用 | 同上 |
| Tailscale | ✅ 类型选择可用 | 同上 |
| MASQUE | ✅ 类型选择可用 | 同上 |
| TrustTunnel | ✅ 类型选择可用 | 同上 |
| OpenVPN | ✅ 类型选择可用 | 同上 |

### Proxy 公共字段覆盖

✅ name / type / server / port / ip-version / udp / tfo / mptcp / dialer-proxy / interface-name / routing-mark / smux（含 brutal-opts）/ TLS（tls/sni/servername/alpn/skip-cert-verify/client-fingerprint/fingerprint）/ reality-opts / ech-opts / network（tcp/http/h2/grpc/ws/xhttp 含对应 opts）

### Proxy Group 类型覆盖

| Group 类型 | 编辑器支持 | 说明 |
|-----------|-----------|------|
| select | ✅ 完整表单 | 成员选择下拉 |
| url-test | ✅ 完整表单 | url/interval/timeout/tolerance |
| fallback | ✅ 完整表单 | url/interval/timeout |
| load-balance | ✅ 完整表单 | strategy 选择 |
| relay | ✅ 完整表单 | 含 UDP 不兼容警告 |

---

## 11. Rule Provider / Rules 覆盖情况

### Rule Provider

| 特性 | 状态 | 说明 |
|------|------|------|
| type: http | ✅ 完成 | URL 编辑 + fetch 预览 |
| type: file | ✅ 完成 | 路径编辑 |
| type: inline | ✅ 完成 | payload 编辑（基础支持） |
| behavior: domain | ✅ 完成 | 下拉选择 |
| behavior: ipcidr | ✅ 完成 | 下拉选择 |
| behavior: classical | ✅ 完成 | 下拉选择 |
| format: yaml | ✅ 完成 | 下拉选择 |
| format: text | ✅ 完成 | 下拉选择 |
| format: mrs | ✅ 完成 | 下拉选择 |
| MetaCubeX 内置模板 | ✅ 完成 | `src/components/editors/rule-providers/templates.ts` 含 30+ 模板 |

### Rules

| 特性 | 状态 | 说明 |
|------|------|------|
| 全部 RULE_TYPES | ✅ 完成 | 30+ 规则类型下拉选择 |
| RULE-SET 绑定 provider | ✅ 完成 | 自动读取配置中所有 rule-provider |
| AND / OR / NOT | ✅ 类型选择可用 | 高级 payload 需手动输入 |
| SUB-RULE 引用 | ✅ 完成 | 自动读取 sub-rules 名称列表 |
| MATCH 位置检查 | ✅ 完成 | `src/engine/rule-validator.ts` |
| 规则引用完整性 | ✅ 完成 | `src/engine/references.ts` |
| 拖拽排序 | ✅ 完成 | @dnd-kit/sortable |
| 规则冲突检测 | ❌ 未实现 | 未检测同类型规则覆盖冲突 |
| 规则启用/禁用 | ❌ 未实现 | 无 toggle 功能 |

---

## 12. 链式代理实现说明

### Dialer-proxy 链式代理

✅ **支持**。在 Proxy 编辑器的"高级选项"中可设置 `dialer-proxy` 字段。`src/engine/chain-validator.ts` 的 `buildDialerChain()` 可构建完整链路，`validateChains()` 检测断链和自引用。

### Relay proxy-group 链式代理

✅ **支持**。Proxy Group 编辑器中可选择 `relay` 类型。静态验证包括：
- UDP 不兼容警告
- 空 relay 检测
- 代理引用存在性检查
- 自引用检测

### 拓扑图

✅ **支持**：
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx` — 使用 React Flow 显示 dialer-proxy + relay 链路
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx` — 使用 React Flow 显示代理组引用关系，高亮循环和自引用

### 静态测试覆盖

| 检查项 | 状态 | 验证位置 |
|--------|------|---------|
| 循环链 | ✅ | `src/engine/cycle-detector.ts` |
| 断链 | ✅ | `src/engine/chain-validator.ts` (broken-chain) |
| UDP 不兼容 | ✅ | `src/engine/chain-validator.ts` (udp-incompat) |
| 空 relay | ✅ | `src/engine/chain-validator.ts` (empty-relay) |
| 自引用 | ✅ | `src/engine/cycle-detector.ts` / `chain-validator.ts` (self-relay) |
| relay 顺序 | ⚠️ 部分 | 只管引用存在性，不验证顺序合理性 |

### External-controller 运行态测试

❌ **未实现**。Settings 页面提供了 external-controller URL 和 secret 的配置入口，但未实现 API 调用测真实延迟的功能。当前仅支持静态配置验证。

---

## 13. UI/UX 当前状态

### 布局

- **3 面板布局**: 左侧导航树（默认 280px，可折叠）| 中间编辑器 | 右侧预览面板（360px，CodeMirror YAML，含 YAML/问题/对比/兼容性四个 Tab）
- **Header**: 项目名 + 可编辑配置名（点击编辑，Enter/Blur 保存，同步 localStorage+IndexedDB）+ 撤销/重做 + 保存按钮（有改动时启用）+ 导入/导出按钮（hover 触发菜单）+ 主题切换（Sun/Moon/Monitor 三图标）
- **所有编辑器页面**统一 `p-6 max-w-3xl mx-auto` 边距
- **列表+详情编辑器**（Proxies/ProxyProviders/ProxyGroups/SubRules/Inbounds）统一 `p-6` 边距，右侧详情面板居中

### 导航

- **左侧 NavTree**: 20 个配置模块入口，支持搜索过滤
- **底部固定链接**: 设置 + About

### 表单设计

- `FieldWrapper` 组件统一管理标签、描述、示例、必填标记、兼容性 badge
- `SensitiveField` 组件默认隐藏密码/密钥，点击眼睛图标切换显示
- 高级字段可折叠（`DetailsSection` 组件）
- `TextField`/`NumberField`/`SelectField`/`BoolField` 共享组件统一表单样式，使用原始 `<input>` 直接渲染（不再依赖 `ui/input` 基类），与 GeneralEditor 样式完全一致；`TextField`/`NumberField`/`SensitiveField` 支持 `className` prop 覆盖宽度等布局属性
- 复选框统一 `size-4 rounded border-input`

### 拖拽排序

✅ **完整支持**。通过 `@dnd-kit/sortable` 实现，覆盖三处：
- DNS 配置的服务器列表编辑器（`StringListEditor`，7 个子字段）
- 路由规则列表（`RulesEditor`，紧凑视图行拖拽把手）
- 代理组成员列表（`ProxyGroupsEditor`，成员选择下拉拖拽）

### 深色模式

✅ **支持**。通过 `useUiStore` 的 theme 状态（light/dark/system）+ CSS 变量 + Tailwind dark class 切换。System 模式下跟随操作系统偏好。

### 导出菜单

✅ **hover 触发**。鼠标移入导出按钮区域自动居中显示菜单（Mihomo 完整导出 / Stash 兼容导出），鼠标移出后自动隐藏。

### 保存机制

✅ **自动保存 + 手动保存**。1 秒防抖自动保存到 localStorage + Dexie IndexedDB。有未保存改动时 Header 保存按钮启用，点击触发立即保存。配置改名不会创建重复 IndexedDB 记录。

### 导入流程

✅ **自动关闭**。文件/URL/剪贴板导入成功后对话框自动关闭。Dashboard 快速开始按钮可精确定位到导入对话框的对应 Tab。导入自动设置配置名，防止 localStorage 覆盖。URL 拉取支持自定义 User-Agent 请求头（在设置页面配置，默认 `clash.meta/v1.19.25`）。

### 滚动条

✅ **全局隐藏**。默认透明，hover 时半透明显示，WebKit + Firefox 兼容。

### 响应式

⚠️ **基本支持**。主要优化桌面宽屏（≥ 1280px）。已添加基本响应式断点：预览面板 ≤1024px 隐藏、Header 按钮文字 ≤768px 隐藏、Dashboard 快速开始按钮窄屏自动换行。移动端深度编辑体验未优化。

### 键盘操作

- Ctrl+Z / Ctrl+Shift+Z：撤销/重做
- Tab / Enter：标准表单导航
- 未实现键盘快捷键导航

### 敏感字段

✅ 密码、私钥、UUID、token 等字段默认 `type="password"`，带可见性切换按钮。

### 错误定位

⚠️ **部分支持**。验证错误在 YAML 预览面板的"问题"标签中显示，按类型分组，但点击错误不会自动跳转到对应编辑字段。

---

## 14. 许可证和 Attribution

| 检查项 | 状态 | 位置 |
|--------|------|------|
| LICENSE 文件 | ✅ 存在 | `LICENSE` — CC BY-NC 4.0 全文 |
| README 协议说明 | ✅ 完成 | `README.md` 的 License 章节 |
| About 页面协议展示 | ✅ 完成 | `src/pages/About.tsx` |
| 非官方项目声明 | ✅ 已声明 | README 末尾和 About 页面 |
| 第三方 attribution | ✅ 完成 | mihomo/MetaCubeX/meta-rules-dat/Stash 均在 README 和 About 页面列出 |

### Attribution 来源

1. [mihomo (MetaCubeX)](https://github.com/MetaCubeX/mihomo) — 配置字段定义与文档参考
2. [mihomo 官方文档](https://wiki.metacubex.one/) — 配置参数说明
3. [MetaCubeX meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat) — 内置规则集模板
4. [Stash 文档](https://stash.wiki/) — Stash 兼容字段参考

---

## 15. 测试和验证结果

> **所有命令均在 `main` 分支 `b5be08d` commit 执行，时间：2026-06-13。**

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm install` | ✅ 通过 | 0 vulnerabilities |
| `npm run typecheck` (`tsc -b`) | ✅ 通过 | 0 错误 |
| `npm run lint` (`eslint .`) | ✅ 0 errors, 0 warnings | 6 个历史 warning 已全部修复 |
| `npm run build` (`tsc -b && vite build`) | ✅ 通过 | 生成 dist/ (JS 1.32MB, CSS 46KB gzipped 407KB) |
| `npm test` (`vitest run`) | ✅ **92 passed** | 18 个测试文件全部通过 |

### 测试文件清单

| 测试文件 | 用例数 | 覆盖内容 |
|----------|--------|----------|
| `src/__tests__/yaml.test.ts` | 8 | YAML parse/stringify round-trip（minimal/DNS/SS/VMess/WireGuard/Hysteria2/groups/rules） |
| `src/__tests__/unknown-fields.test.ts` | 4 | unknownFields round-trip 保留 |
| `src/__tests__/stash-export.test.ts` | 4 | Stash 字段移除、DNS 转换 |
| `src/__tests__/stash-full-export.test.ts` | 2 | mihomo→Stash 完整端到端导出 |
| `src/__tests__/dns-strategy.test.ts` | 4 | DNS 单服务器策略（auto-first/block/need 检测） |
| `src/__tests__/references.test.ts` | 5 | 悬挂代理/组/provider/rule-provider/dialer-proxy 引用检测 |
| `src/__tests__/cycle-detector.test.ts` | 4 | 代理组循环/自引用检测 |
| `src/__tests__/chain-validator.test.ts` | 5 | Relay UDP/空/断链/有效/dialer-proxy 检测 |
| `src/__tests__/rule-validator.test.ts` | 5 | 不可达规则/缺失 MATCH/重复规则/空规则 |
| `src/__tests__/integrity.test.ts` | 4 | 完整配置多问题检测/重复名称检测 |
| `src/__tests__/config-store.test.ts` | 7 | updateConfig/undo/redo/history 限制/reset/setName |
| `src/__tests__/validation.test.ts` | 7 | Zod schema 类型校验/integration with parseYaml/未知字段容忍 |
| `src/__tests__/external-controller.test.ts` | 6 | Controller URL/secret 读取、API URL 构建 |
| `src/__tests__/yaml-diff.test.ts` | 7 | 行级 diff 算法（新增/删除/修改/空文本） |
| `src/__tests__/components/YamlDiff.test.tsx` | 5 | YamlDiff 组件渲染（无差异/新增/删除/统计） |
| `src/__tests__/components/GeneralEditor.test.tsx` | 5 | GeneralEditor 表单渲染（mode/log-level/IPv6/controller） |
| `src/__tests__/components/NavTree.test.tsx` | 5 | NavTree 导航项渲染/搜索输入/文字过滤 |
| `src/__tests__/components/ExportDialog.test.tsx` | 5 | ExportDialog mihomo/Stash 模式/兼容性报告/按钮渲染 |
| **合计** | **92** | |

### 未实现的测试

- 无 UI store 测试
- 无 E2E 测试（Playwright）

---

## 16. 已知问题和风险

### 16.1 功能缺口

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| external-controller 仅部分连接 | 无法在代理/代理组编辑器中直接查看实时延迟 | P2: 在 ProxiesEditor 和 ProxyGroupsEditor 中显示延迟数据 | `src/hooks/useExternalController.ts` |
| 移动端编辑体验未优化 | 小屏设备编辑表单体验不佳 | P2: 移动端表单布局优化 | `src/components/layout/` |

### 16.2 Schema 和字段覆盖风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| Proxy 类型扁平接口 | TypeScript 无法校验跨类型字段一致性 | P2: 编辑器中应用 `getProxyTypeFields` 实现条件渲染 | `src/schema/model.ts` |
| 部分高级嵌套字段未暴露 UI | 如 xhttp-opts.reuse-settings、grpc-opts.min-streams | P2: 逐步补充字段 | `src/components/editors/proxies/` |

### 16.3 Stash 兼容风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| 字段移除可能遗漏 | Stash 新版本可能支持更多字段 | P2: 定期同步 Stash 文档更新 `STASH_REMOVE_FIELDS` | `src/compatibility/stash.ts` |
| Stash DNS 策略数组支持不确定 | 文档可能支持数组但本项目按单服务器处理 | P2: 确认 Stash 最新 DNS 行为后调整策略 | `src/compatibility/dns-strategy.ts` |

### 16.4 YAML 和导入导出风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| YAML 注释 round-trip 未完成 | 导入→编辑→导出后注释仅在导入时提取，未注入输出 | P2: 基于 yaml 包 Document API 实现完整 round-trip | `src/schema/yaml.ts` |
| CORS URL 拉取失败 | 用户无法直接导入远程配置 | ✅ 已提供手动粘贴/文件上传/CORS proxy 三种兜底 | `src/components/import/UrlImport.tsx` |
| 密码字段在 YAML 明文 | 导出 .yaml 文件包含明文密码 | 提醒用户在导出前自行处理 | — |

### 16.5 测试覆盖风险

| 风险 | 影响 | 建议 |
|------|------|------|
| 无 E2E 测试 | 完整用户流程未自动验证 | P2: 可选 Playwright |
| 无 UI store 测试 | Zustand UI store 逻辑未验证 | P2: 添加 ui-store.test.ts |

---

## 17. 下一步开发建议

> P0/P1 已全部完成，P2 已完成 6/6 项（部分为阶段完成）。以下为剩余建议。

### P2：体验增强或长期优化

1. **在代理编辑器中显示 external-controller 延迟数据**
   - 原因：`useExternalController` Hook 已完成，但 ProxiesEditor 和 ProxyGroupsEditor 未接入
   - 修改文件：`src/components/editors/proxies/ProxiesEditor.tsx`、`ProxyGroupsEditor.tsx`
   - 验证：连接 controller 后代理列表显示实时延迟数值

2. **Editor 中应用 Proxy discriminated union 条件渲染**
   - 原因：`getProxyTypeFields()` 已就绪，可在编辑器中按类型动态显示/隐藏 TLS、传输层等区域
   - 修改文件：`src/components/editors/proxies/ProxiesEditor.tsx`
   - 验证：切换代理类型后不相关表单区域自动隐藏

3. **YAML 注释完整 round-trip**
   - 原因：注释已在 `parseYaml()` 中提取，`stringify*()` 未注入
   - 修改文件：`src/schema/yaml.ts` 的 `stringifyYamlOrdered()`
   - 验证：导入含注释 YAML → 导出 → 注释出现在原位置

4. **补充高级嵌套字段 UI**
   - 原因：xhttp-opts.reuse-settings、grpc-opts.min-streams 等嵌套字段未暴露
   - 修改文件：`src/components/editors/proxies/ProxiesEditor.tsx`
   - 验证：VLESS/gRPC 代理类型可编辑完整嵌套配置

5. **添加 E2E 测试（可选）**
   - 原因：完整用户流程（导入→编辑→导出）未自动验证
   - 方案：Playwright（独立进程，不增加构建产物）
   - 验证：关键用户旅程自动化通过

6. **添加 UI store 测试**
   - 原因：Zustand UI store（主题/侧栏/预览模式）无测试覆盖
   - 修改文件：新建 `src/__tests__/ui-store.test.ts`

7. **响应式编辑体验深度优化**
   - 原因：当前仅基础断点，编辑表单在移动端未优化
   - 修改文件：`src/components/layout/`、各编辑器组件表单布局

---

## 18. 如何启动和使用

### 安装和启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 3. 构建生产版本
npm run build    # 输出到 dist/

# 4. 预览生产版本
npm run preview
```

### 运行测试

```bash
# 运行全部测试
npm test

# Watch 模式
npm run test:watch

# TypeScript 类型检查
npm run typecheck

# ESLint 检查
npm run lint
```

### 使用流程

1. **打开 Dashboard**: 启动后默认进入工作台
2. **新建配置**: 点击"新建配置"或选择模板
3. **导入配置**: 从文件/URL/剪贴板导入 YAML（导入后自动关闭对话框）
4. **编辑配置名**: 点击 Header 中的配置名进行编辑，Enter 或失焦保存
5. **编辑配置**: 通过左侧导航进入各配置模块
6. **预览 YAML**: 右侧面板实时显示生成的 YAML
7. **查看问题**: 点击右侧"问题"标签查看校验结果
8. **导出**: Header 导出按钮 hover 显示菜单 → 选择 mihomo 完整导出或 Stash 兼容导出
9. **下载**: 在弹出的导出对话框中下载 .yaml 或复制到剪贴板
10. **检查兼容性**: Stash 模式下查看兼容性报告

### 链式代理使用

1. 在"代理节点"页面添加多个代理，为需要链式代理的节点设置 `dialer-proxy`
2. 或创建 `relay` 类型代理组
3. 进入"链路构建器"页面查看链路拓扑图和静态验证结果

---

## 19. 给下一个 AI Agent 的接手指令

### 开始前必读文件

按顺序阅读以下文件，建立对项目的整体理解：

1. `README.md` — 项目概述和开发命令
2. `package.json` — 依赖和脚本
3. `src/schema/model.ts` — 数据模型（最核心，含 ProxyType）
4. `src/schema/yaml.ts` — YAML 引擎（基于 `yaml` npm 包）
5. `src/schema/validation.ts` — Zod 运行时 schema 校验
6. `src/schema/unknown-fields.ts` — unknownFields 机制
7. `src/engine/integrity.ts` — 完整验证入口（含 Zod 错误收集）
8. `src/compatibility/stash.ts` — Stash 导出逻辑
9. `src/store/config-store.ts` — 状态管理（含 undo/redo、currentDraftId）
10. `src/hooks/useAutoSave.ts` — 自动保存机制
11. `src/hooks/useExternalController.ts` — mihomo REST API 连接
12. `src/components/preview/YamlDiff.tsx` — YAML diff 组件
13. `src/App.tsx` — 路由和编辑器分发（20 个编辑器映射）
14. `docs/DEVELOPMENT_HANDOFF.md` — 本文档

### 开发流程要求

1. **不要直接在 `main` 分支开发**
2. 创建 `dev/<feature-name>` 分支
3. 开发完成后在 dev 分支运行：
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   npm test
   ```
4. 全部通过后合并到 `main`（使用 `--no-ff`）
5. 在 `main` 再次运行上述 4 个验证
6. `git push origin main`

### 优先修复

P0 已修复（Stash DNS 策略完整交互流程）。当前无阻塞级问题。优先关注 §17 中的 P2 建议。

### 修改后必须跑的测试

- 修改 `src/schema/` 下文件 → 必须跑 `yaml.test.ts`、`unknown-fields.test.ts`、`validation.test.ts`
- 修改 `src/engine/` 下文件 → 必须跑对应测试文件
- 修改 `src/components/` 下文件 → 必须跑 `npm run build` 验证构建，以及对应组件测试（如有）
- 修改 `src/store/` 下文件 → 必须跑 `config-store.test.ts`

---

> **文档生成时间**: 2026-06-13（更新）
> **文档作者**: AI Agent（基于仓库实际状态生成）
> **仓库状态**: `main` 分支 `b5be08d`，working tree clean，92/92 测试通过，0 ESLint warnings
