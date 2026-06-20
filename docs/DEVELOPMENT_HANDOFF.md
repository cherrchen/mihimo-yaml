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
| **当前完成度** | 核心导入、编辑、校验和导出流程已实现；包含 18 个配置模块编辑器和 1 个链路可视化工具。仍有注释 round-trip、移动端体验、运行态延迟展示等增强项，详见 §16–§17 |

### 当前状态关键结论

| 检查项 | 状态 |
|--------|------|
| 可启动 (`npm run dev`) | ✅ 通过 |
| 可构建 (`npm run build`) | ✅ 通过，生成 `dist/` |
| TypeScript typecheck | ✅ 通过，0 错误 |
| ESLint | ✅ 0 错误，0 warning（已全部修复） |
| 单元测试 | ✅ 149/149 通过（28 个测试文件） |
| mihomo YAML 导入 | ✅ 文件/URL/剪贴板/模板四种方式，导入后自动关闭对话框并设置配置名，含 Zod 运行时字段级校验 |
| mihomo YAML 导出 | ✅ 下载 .yaml 或复制到剪贴板 |
| Stash 兼容导出 | ✅ 含兼容性报告，DNS 多服务器策略交互已修复 |
| YAML diff 对比 | ✅ 预览面板"对比"标签，行级差异高亮 |
| 链式代理静态测试 | ✅ dialer-proxy + relay 链路验证，含 DFS 多节点环路检测 |
| unknownFields round-trip | ✅ 未建模的顶层字段可在导入→编辑→导出后保留；嵌套字段依赖原对象透传 |
| YAML 注释保留 | ⚠️ 仅提取文档前置注释到内部元数据，导出不会恢复注释 |
| 自动保存 | ✅ localStorage + Dexie IndexedDB 双层持久化，支持配置改名不创建重复记录 |
| 撤销/重做 | ✅ 50 步历史深度（已修复真实编辑路径下的 history 快照时序） |
| 大型配置性能 | ✅ 5 万规则 + 100 节点验收；线性校验、结构共享、后台派生及列表/YAML 虚拟化 |
| 响应式布局 | ⚠️ 基本断点已添加（预览面板 ≤1024px 隐藏，按钮文字 ≤768px 隐藏），窄屏侧边栏 `max-md:w-0` 隐藏（无 toggle 按钮） |

---

## 2. Git 审查基线

本文档于 2026-06-18 以以下本地状态复核；这些值是审查基线，不应被当作长期不变的仓库状态：

| 项目 | 值 |
|------|-----|
| **分支 / HEAD** | `dev/optimize-large-config-performance` / `b355048`（基于当前 `main`，性能改动尚未提交） |
| **上游本地跟踪引用** | `main...origin/main` 为 `0 ahead / 0 behind`；未执行远程 `fetch`，不据此承诺远端实时状态 |
| **审查开始时工作区** | clean；当前工作区包含本次性能实现、测试和文档改动 |
| **远程仓库** | `git@github.com:cherrchen/mihimo-yaml.git` |
| **CI** | `.github/workflows/verify.yml`，对 `main` push / PR 运行 `npm ci`、typecheck、lint、test、build |

交接时请重新运行以下命令，不要手工维护分支列表或提交日志：

```bash
git status -sb
git log -5 --oneline --decorate
git branch --no-merged main
git worktree list
```

---

## 3. 开发与验证流程

仓库已有 GitHub Actions 验证工作流。开发改动建议在 `dev/*` 分支完成，并在提交或合并前运行：

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI 使用 Node.js 24 和 `npm ci`。本地验证通过不代表远端 CI 已运行，交接时应同时检查工作区和 CI 状态。

---

## 4. 功能完成情况总览

| 模块 | 状态 | 关键文件 | 说明 |
|------|------|----------|------|
| 工作台布局 | 已完成 | `src/components/layout/AppShell.tsx` | 3 面板（侧边栏+编辑+预览）；宽度由 props/store 控制，当前无可见拖拽调宽控件 |
| YAML 文件导入 | 已完成 | `src/components/import/FileImport.tsx` | 拖拽或选择 .yaml 文件，预览后确认导入，导入后自动关闭并设配置名 |
| URL 拉取 | 已完成 | `src/components/import/UrlImport.tsx` | fetch 拉取 + CORS 错误兜底（手动粘贴/文件上传/CORS proxy）；浏览器直连不再承诺自定义 User-Agent |
| 剪贴板导入 | 已完成 | `src/components/import/ClipboardImport.tsx` | readText + 手动粘贴 |
| 模板导入 | 已完成 | `src/pages/Dashboard.tsx` | 5 个内置模板 |
| 导入对话框 Tab 定位 | 已完成 | `src/components/import/ImportDialog.tsx` | 工作台按钮精确跳转到文件/URL/剪贴板 Tab |
| YAML 实时预览 | 已完成 | `src/components/preview/YamlPreview.tsx` | 缓存 YAML；≤5000 行使用 CodeMirror，超长文档使用带行号虚拟列表 |
| YAML 导出 | 已完成 | `src/components/export/ExportDialog.tsx` | mihomo 完整+Stash 兼容双模式，下载/剪贴板 |
| mihomo 导出 | 已完成 | `src/schema/yaml.ts` (stringifyYamlOrdered) | 字段顺序：general→dns→hosts→... |
| Stash 导出 | 已完成 | `src/compatibility/stash.ts` | 含兼容性报告 |
| Stash DNS 单服务器策略 | 已完成 | `src/compatibility/dns-strategy.ts` + `src/components/export/ExportDialog.tsx` | DNS 多服务器策略导出交互已修复，用户选择正确应用到导出 YAML |
| unknownFields round-trip | 已完成（顶层） | `src/schema/unknown-fields.ts` | 未建模顶层字段导入→编辑→导出不丢失；嵌套对象由原结构透传 |
| Zod 运行时 schema 校验 | 已完成（主要字段） | `src/schema/validation.ts` | 覆盖主要模块和常用字段；高级字段可 passthrough，集成到 integrity 检查 |
| YAML diff 对比 | 已完成 | `src/components/preview/YamlDiff.tsx` | 预览面板"对比"标签，自动对比上次版本，行级红/绿差异高亮 |
| general 配置 | 已完成 | `src/components/editors/general/GeneralEditor.tsx` | mode/log-level/ipv6/external-controller 等 |
| DNS 配置 | 已完成 | `src/components/editors/dns/DnsEditor.tsx` | nameserver 列表(含拖拽排序)/策略表格/fallback-filter |
| hosts 配置 | 已完成 | `src/components/editors/hosts/HostsEditor.tsx` | 域名→IP 映射 |
| proxy 配置 | 已完成 | `src/components/editors/proxies/ProxiesEditor.tsx` | 列表+类型分发表单，超过 200 个匹配项时虚拟渲染 |
| proxy-provider 配置 | 已完成 | `src/components/editors/proxy-providers/ProxyProvidersEditor.tsx` | http 预览/override/health-check |
| proxy-group 配置 | 已完成 | `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx` | 成员选择(含拖拽排序)/拓扑图 |
| rule-provider 配置 | 已完成 | `src/components/editors/rule-providers/RuleProvidersEditor.tsx` | MetaCubeX 内置模板选择器 |
| rules 配置 | 已完成 | `src/components/editors/rules/RulesEditor.tsx` | 可展开编辑/搜索/拖拽；超过 200 条时动态高度虚拟渲染 |
| sub-rules 配置 | 已完成 | `src/components/editors/sub-rules/SubRulesEditor.tsx` | 子规则定义与编辑 |
| inbounds 配置 | 部分完成 | `src/components/editors/inbounds/InboundsEditor.tsx` | 可选择 19 种 listener；仅 5 类有专属字段块，其余只能编辑公共字段 |
| tun 配置 | 已完成（常用字段） | `src/components/editors/tun/TunEditor.tsx` | 14 个常用字段 |
| sniffer 配置 | 已完成（常用字段） | `src/components/editors/sniffer/SnifferEditor.tsx` | 8 个常用字段；未暴露 `sniff`、skip-src/dst-address 等高级字段 |
| tunnels 配置 | 已完成 | `src/components/editors/tunnels/TunnelsEditor.tsx` | 列表编辑 |
| ntp 配置 | 已完成 | `src/components/editors/ntp/NtpEditor.tsx` | 6 个字段 |
| experimental 配置 | 已完成 | `src/components/editors/experimental/ExperimentalEditor.tsx` | 3 个字段 |
| iptables 配置 | 已完成 | `src/components/editors/iptables/IptablesEditor.tsx` | Linux 专用，4 个字段 |
| ebpf 配置 | 已完成 | `src/components/editors/ebpf/EbpfEditor.tsx` | Linux 专用，4 个字段 |
| clash-for-android 配置 | 已完成 | `src/components/editors/clash-for-android/ClashForAndroidEditor.tsx` | 安卓专用，2 个字段 |
| 链式代理构建器 | 已完成 | `src/components/editors/chain-builder/ChainBuilderEditor.tsx` | React Flow 拓扑 + dialer-proxy 链路列表 |
| 链式代理静态测试 | 已完成 | `src/engine/chain-validator.ts` | UDP/空组/断链/自引用/多节点环路(DFS)检测 |
| external-controller 连接 | 部分完成 | `src/hooks/useExternalController.ts` | Settings 页提供"测试连接"按钮，Hook 已实现代理列表读取和延迟测试；编辑器内尚未展示延迟数据 |
| 模板库 | 已完成 | `src/schema/defaults.ts` | 5 个模板 |
| 草稿自动保存 | 已完成 | `src/hooks/useAutoSave.ts` + `src/lib/db.ts` | 复用 Worker 派生 YAML；并发时仅持久化仍为当前的快照 |
| 撤销/重做 | 已完成 | `src/store/config-store.ts` | 50 步 Immer 结构共享快照，避免重复深拷贝 |
| 拖拽排序 | 已完成 | `@dnd-kit/sortable` | DNS 服务器列表、路由规则、代理组成员均支持拖拽排序 |
| 深色模式 | 已完成 | `src/store/ui-store.ts` + `src/index.css` | light/dark/system 三模式，含 Monitor 专属图标 |
| 设置页面 | 已完成 | `src/pages/Settings.tsx` | 主题/CORS proxy/自定义 User-Agent 限制说明/controller 配置 |
| 关于页面 | 已完成 | `src/pages/About.tsx` | 协议+attribution+技术栈 |
| 可编辑配置名 | 已完成 | `src/components/layout/Header.tsx` | 点击编辑，同步 localStorage + IndexedDB |
| 最近项目删除 | 已完成 | `src/pages/Dashboard.tsx` | Trash2 按钮直接删除 IndexedDB 记录 |
| 保存按钮 | 已完成 | `src/components/layout/Header.tsx` | 有未保存改动时启用，点击触发立即保存 |
| 导出菜单 hover 触发 | 已完成 | `src/components/layout/Header.tsx` | 鼠标移入显示，移出隐藏，菜单居中 |
| 全局滚动条隐藏 | 已完成 | `src/index.css` | 默认透明，hover 时显示，WebKit+Firefox |
| 页面边距统一 | 已完成 | 19 个编辑器/页面 | 统一 `p-6 max-w-3xl mx-auto` |
| 详情面板居中 | 已完成 | ProxyGroups/ProxyProviders/Inbounds | 右侧编辑面板添加 `mx-auto` |
| 组件测试 | 已完成（部分覆盖） | `src/__tests__/components/` | 9 个组件测试文件、41 个用例；未覆盖全部编辑器和完整用户流程 |
| NavTree 搜索过滤 | 已完成 | `src/components/layout/NavTree.tsx` | 父子节点匹配过滤，含搜索输入受控和过滤测试 |
| React Flow 拓扑图 | 已完成 | `src/components/editors/chain-builder/ChainBuilderEditor.tsx`、`ProxyGroupTopology.tsx` | 受控模式（`nodes={initialNodes}`）、config 变化自动同步、含组件测试 |
| Proxy 类型辅助 API | 部分完成 | `src/schema/model.ts` | `ProxyType` 字符串联合 + `isProxyType` + `getProxyTypeFields` 已添加，编辑器尚未使用 |

---

## 5. 架构说明

### 入口和路由

- **入口文件**: `src/main.tsx` — ReactDOM.createRoot，挂载到 `index.html` 的 `#root`
- **路由方式**: 基于 Zustand 状态驱动的单页视图切换（非 react-router）。`src/App.tsx` 的 `renderEditor()` 将 `activeSection` 映射到对应编辑器组件。

### 状态管理

- **配置状态**: `src/store/config-store.ts` — Zustand + Immer store；历史最多 50 个结构共享快照，YAML/完整性报告由后台派生并带当前快照保护
- **UI 状态**: `src/store/ui-store.ts` — Zustand store，包含主题、侧边栏宽度、活动面板、预览模式、导出模式

### 大型配置性能管线

- `ConfigBackgroundTasks` 隔离 Worker 派生和自动保存订阅，配置变化不再重渲染 `App` 外壳。
- 配置变化约 200ms 后由 `config-derivation.worker.ts` 生成有序 YAML 和完整性报告；旧快照结果会被丢弃，Worker 不可用时异步回退到主线程。
- 规则重复检测由 O(n²) 改为 O(n)，引用检查每条规则只解析一次。5 万规则 Vitest 基准约 70ms。
- rules/proxies/issues 超过 200 项时使用 TanStack Virtual；超长 YAML 超过 5000 行时使用虚拟行预览。5 万规则组件用例约 47ms。
- 生产构建导入 2.19MB、5 万规则 + 100 节点配置约 955ms；桌面视口下 DOM 从改造前约 101,179 个降至约 531 个，其中 YAML 挂载 60 行。浏览器随后阻止了该 localhost 的点击交互，因此未取得真实切页点击耗时；组件和生产 DOM 数据已覆盖主要渲染风险。

### 关键文件路径索引

| 文件 | 职责 |
|------|------|
| `src/schema/model.ts` | 全部 TypeScript 接口定义（MihomoConfig、ProxyConfig、DnsConfig 等），含 ProxyType 字符串联合和字段查询辅助函数 |
| `src/schema/metadata.ts` | 字段元数据注册表（当前 157 条，含 mihomo/Stash 兼容性标记；尚未接入编辑器/转换器运行时） |
| `src/schema/metadata-types.ts` | FieldMeta 类型定义 |
| `src/schema/yaml.ts` | YAML parse/stringify/ordered-export/clone（基于 `yaml` npm 包） |
| `src/schema/unknown-fields.ts` | 未知字段提取和注入（round-trip 保证） |
| `src/schema/validation.ts` | Zod 运行时 schema 校验（覆盖主要模块和常用字段，导入时收集字段路径错误） |
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
| `src/lib/rule-parser.ts` | 统一规则解析器（parseRule/buildRuleString/getRuleTarget），供 `references.ts` 和 `RulesEditor` 共用 |
| `src/lib/utils.ts` | cn() 工具函数（clsx + tailwind-merge） |
| `src/lib/config-derivation.ts` | Worker 客户端、单快照结果复用和无 Worker 回退 |
| `src/workers/config-derivation.worker.ts` | 后台 YAML 序列化和完整性检查 |
| `src/hooks/useConfigDerivation.ts` | 200ms debounce、过期结果保护和低优先级派生应用 |
| `src/hooks/useAutoSave.ts` | 快照安全的 localStorage + Dexie debounce 自动保存 |
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

> 已补充 `ProxyType` 字符串字面量联合、`isProxyType` 和 `getProxyTypeFields`。`ProxyConfig` 本身仍是扁平接口，编辑器也尚未接入字段查询辅助函数。

### unknownFields 保存

`MihomoConfig._unknownFields` 是一个 `Record<string, unknown>`，存储导入 YAML 中未建模的顶级字段。通过 `src/schema/unknown-fields.ts` 的 `extractUnknownFields()` 和 `injectUnknownFields()` 实现 round-trip。

### YAML 注释元数据

`MihomoConfig._comments` 可存储注释元数据（`Record<string, string[]>`）。当前 `parseYaml()` 只读取 `Document.commentBefore`，即文档内容之前的注释；字段前注释和行尾注释不会被收集，`stringify*()` 也不会恢复注释。

### Zod 校验错误

`MihomoConfig._validationErrors` 存储导入时 Zod 校验产生的字段级类型错误，由 integrity 检查收集并在 YAML 预览"问题"标签中展示。

### 字段元数据

`src/schema/metadata.ts` 通过 `f()` 工厂函数维护 157 条字段元数据，包括：

- YAML key 名称和路径
- TypeScript 类型
- 是否必填
- mihomo / Stash 支持标记
- 枚举值列表
- 描述和示例
- Stash 导出动作（remove/warn/transform/block）

当前编辑器和 Stash 转换器均未读取这份注册表；它是可复用的描述数据，不是现有表单或兼容性逻辑的运行时来源。修改字段行为时仍需同步检查 `model.ts`、`validation.ts`、具体编辑器和 `compatibility/stash.ts`。

### 当前覆盖的字段

覆盖了 mihomo 文档中的主要配置模块（general/dns/hosts/sniffer/tun/inbounds/proxies/proxy-providers/proxy-groups/rule-providers/rules/sub-rules/tunnels/ntp/experimental），共计约 150+ 个字段。

### 仍缺少的字段

- 部分 proxy 类型的高级嵌套字段（如 `xhttp-opts.reuse-settings` 的完整子字段）在 UI 中未全部暴露
- `profile` 配置段已建模且有元数据，但 General 编辑器中部分字段未展示

### TypeScript 类型和 Zod 的关系

`zod` (v4.4.3) **已使用**。`src/schema/validation.ts` 对主要顶层模块和常用子字段做运行时类型校验；部分高级字段只通过 `.passthrough()` 透传，并非每个模型字段都有约束。`parseYaml()` 导入时自动运行校验，错误收集到 `_validationErrors`，并在 integrity 报告的"问题"标签中展示。

### Proxy 类型系统

`src/schema/model.ts` 新增：
- `ProxyType` — 代理类型字符串字面量联合（`'ss' | 'ssr' | 'http' | ...`），并不是 `ProxyConfig` 的 discriminated union
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
5. `YAML.parseDocument()` 仅提取文档前置注释存入 `_comments`
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

⚠️ **部分支持**。`parseYaml()` 通过 `parseDocument()` 提取文档前置注释存入 `_comments`，但字段前/行尾注释未收集，stringify 时也不会注入任何注释。完整 round-trip 需要保留并修改 `yaml` AST，而不只是普通 JS 对象。

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
2. 按 `STASH_REMOVE_FIELDS`（50 个顶级字段，含特殊处理的 `sub-rules`）和 `STASH_DNS_REMOVE_FIELDS`（17 个 DNS 字段）移除不支持的字段
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

**存在但可见**。`STASH_REMOVE_FIELDS` 中出现的字段会从转换结果删除，并生成兼容性报告条目；`sub-rules` 会产生阻止导出的 error。用户可在 `CompatibilityReport` 中检查变更。

---

## 10. Proxy / Proxy Group 覆盖情况

### Proxy 类型覆盖

| Proxy 类型 | 编辑器支持 | 说明 |
|-----------|-----------|------|
| DIRECT | ✅ 仅 YAML | 内置策略，无表单（通过规则目标下拉可用） |
| DNS | ✅ 仅 YAML | 内置策略 |
| REJECT / REJECT-DROP / COMPATIBLE / PASS | ✅ 仅 YAML | 内置策略 |
| Shadowsocks (ss) | ✅ 专属基础表单 | cipher/password/plugin/udp-over-tcp |
| ShadowsocksR (ssr) | ⚠️ 类型选择可用 | 仅公共字段，未提供专属字段表单 |
| HTTP / SOCKS5 | ✅ 专属基础表单 | username/password；其他高级字段依赖 YAML 透传 |
| VMess | ✅ 专属基础表单 | uuid/alterId/security + 公共 TLS/transport 子集 |
| VLESS | ✅ 专属基础表单 | uuid/flow + 公共 TLS/transport 子集 |
| Trojan | ✅ 专属基础表单 | password + 公共 TLS/transport 子集 |
| Snell | ✅ 专属基础表单 | psk；未暴露全部 obfs 选项 |
| Hysteria | ✅ 专属基础表单 | auth/up/down/obfs + 公共 TLS 字段 |
| Hysteria2 | ✅ 专属基础表单 | password/up/down/obfs-password + 公共 TLS 字段 |
| TUIC | ✅ 专属基础表单 | uuid/password/congestion-controller/disable-sni |
| WireGuard | ✅ 专属基础表单 | private-key/public-key/ip/ipv6/mtu/allowed-ips |
| SSH | ✅ 专属基础表单 | username + password/private-key；未暴露全部 SSH 高级字段 |
| AnyTLS | ✅ 类型选择可用 | 高级字段在 YAML 预览编辑 |
| Mieru | ✅ 类型选择可用 | 同上 |
| Sudoku | ✅ 类型选择可用 | 同上 |
| Tailscale | ✅ 类型选择可用 | 同上 |
| MASQUE | ✅ 类型选择可用 | 同上 |
| TrustTunnel | ✅ 类型选择可用 | 同上 |
| OpenVPN | ✅ 类型选择可用 | 同上 |

### Proxy 公共字段覆盖

界面实际暴露 name / type / server / port / ip-version / udp / tfo / mptcp / dialer-proxy / interface-name / routing-mark、基础 SMUX、常用 TLS 字段，以及 ws/grpc/h2 的单个常用路径字段。`brutal-opts`、`reality-opts`、`ech-opts`、xhttp 和更完整的 transport 子字段虽已建模，但尚未全部提供 UI。

### Proxy Group 类型覆盖

| Group 类型 | 编辑器支持 | 说明 |
|-----------|-----------|------|
| select | ✅ 完整表单 | 成员选择下拉 |
| url-test | ✅ 常用字段 | url/interval/timeout/max-failed-times；未暴露 tolerance/lazy 等全部模型字段 |
| fallback | ✅ 常用字段 | url/interval/timeout/max-failed-times |
| load-balance | ✅ 常用字段 | 健康检查字段 + strategy |
| relay | ✅ 常用字段 | 成员列表 + UDP 不兼容警告 |

---

## 11. Rule Provider / Rules 覆盖情况

### Rule Provider

| 特性 | 状态 | 说明 |
|------|------|------|
| type: http | ✅ 完成 | URL 编辑；Rule Provider 编辑器不提供远程 fetch 预览 |
| type: file | ✅ 完成 | 路径编辑 |
| type: inline | ⚠️ 部分 | 类型可选，但编辑器没有 `payload` 列表输入控件 |
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
| 全部 RULE_TYPES | ✅ 完成 | 36 种规则类型下拉选择 |
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
| dialer-proxy 环路 | ✅ | `src/engine/chain-validator.ts` (circular-chain, DFS) |
| relay 顺序 | ⚠️ 部分 | 只管引用存在性，不验证顺序合理性 |

### External-controller 运行态测试

⚠️ **部分实现**。`useExternalController` 已实现 `GET /proxies` 和单代理 delay API，Settings 页面可测试连接并显示代理数量。现有测试只覆盖设置读取和 URL 拼接，没有 mock fetch 验证请求、认证和错误分支；Proxies/ProxyGroups 编辑器也尚未展示延迟数据。

---

## 13. UI/UX 当前状态

### 布局

- **3 面板布局**: 左侧导航树（默认 280px；store/AppShell 支持折叠，但当前没有可见 toggle）| 中间编辑器 | 右侧预览面板（360px，CodeMirror YAML，含 YAML/问题/对比/兼容性四个 Tab）
- **Header**: 项目名 + 可编辑配置名（点击编辑，Enter/Blur 保存，同步 localStorage+IndexedDB）+ 撤销/重做 + 保存按钮（有改动时启用）+ 导入/导出按钮（hover 触发菜单）+ 主题切换（Sun/Moon/Monitor 三图标）
- **所有编辑器页面**统一 `p-6 max-w-3xl mx-auto` 边距
- **列表+详情编辑器**（Proxies/ProxyProviders/ProxyGroups/SubRules/Inbounds）统一 `p-6` 边距，右侧详情面板居中

### 导航

- **左侧 NavTree**: 18 个配置模块入口 + 链路构建器，支持搜索过滤（含父子节点匹配），有组件测试覆盖
- **底部固定链接**: 设置 + About

### 表单设计

- `FieldWrapper` 组件统一管理标签、描述、示例、必填标记、兼容性 badge
- `SensitiveField` 组件默认隐藏密码/密钥，点击眼睛图标切换显示
- `FieldWrapper` 的 `advanced` 字段各自通过 chevron 展开；UI store 中的全局 `showAdvancedFields` 当前未接入编辑器
- `TextField`/`NumberField`/`SelectField`/`BoolField` 共享组件统一表单样式，使用原始 `<input>` 直接渲染（不再依赖 `ui/input` 基类），与 GeneralEditor 样式完全一致；`TextField`/`NumberField`/`SensitiveField` 支持 `className` prop 覆盖宽度等布局属性
- 复选框统一 `size-4 rounded border-input`

### 拖拽排序

✅ **完整支持**。通过 `@dnd-kit/sortable` 实现，覆盖三处：
- DNS 配置的服务器列表编辑器（`StringListEditor`，7 个子字段）
- 路由规则列表（`RulesEditor`，紧凑视图行拖拽把手）
- 代理组成员列表（`ProxyGroupsEditor`，成员选择下拉拖拽）

### 深色模式

✅ **支持**。通过 `useUiStore` 的 theme 状态（light/dark/system）+ CSS 变量 + Tailwind dark class 切换。System 模式在初始化或重新选择主题时读取系统偏好，当前未监听系统主题的实时变化。

### 导出菜单

✅ **hover 触发**。鼠标移入导出按钮区域自动居中显示菜单（Mihomo 完整导出 / Stash 兼容导出），鼠标移出后自动隐藏。

### 保存机制

✅ **自动保存 + 手动保存**。1 秒防抖自动保存到 localStorage + Dexie IndexedDB。有未保存改动时 Header 保存按钮启用，点击触发立即保存。配置改名不会创建重复 IndexedDB 记录。

### 导入流程

✅ **自动关闭**。文件/URL/剪贴板导入成功后对话框自动关闭。Dashboard 快速开始按钮可精确定位到导入对话框的对应 Tab。导入自动设置配置名，防止 localStorage 覆盖。URL 拉取支持 CORS 代理兜底；浏览器直连 fetch 不保证自定义 User-Agent 生效，设置页中的 UA 仅作为可信代理/服务端代发场景的配置提示。

### 滚动条

✅ **全局隐藏**。默认透明，hover 时半透明显示，WebKit + Firefox 兼容。

### 响应式

⚠️ **基本支持**。主要优化桌面宽屏（≥ 1280px）。已添加基本响应式断点：预览面板 ≤1024px 隐藏、Header 按钮文字 ≤768px 隐藏、Dashboard 快速开始按钮窄屏自动换行。移动端深度编辑体验未优化。

### 键盘操作

- Ctrl+Z / Ctrl+Shift+Z：撤销/重做
- Ctrl+S：当前仅阻止浏览器默认行为，不会触发 `triggerSave`；手动保存需点击 Header 按钮
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

> **以下结果于 2026-06-18 在 `dev/optimize-large-config-performance`（基于 `b355048`）的本地工作区重新执行。**

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run typecheck` (`tsc -b`) | ✅ 通过 | 0 错误 |
| `npm run lint` (`eslint .`) | ✅ 0 errors, 0 warnings | 已全部修复 |
| `npm run build` (`tsc -b && vite build`) | ✅ 通过 | 入口 JS 76.40KB（gzip 21.34KB）；派生 Worker 190.35KB；最大 vendor chunk 369.42KB |
| `npm test` (`vitest run`) | ✅ **149 passed** | 28 个测试文件全部通过 |

### 测试文件清单

| 测试文件 | 用例数 | 覆盖内容 |
|----------|--------|----------|
| `src/__tests__/yaml.test.ts` | 9 | YAML parse/stringify round-trip + 内部字段不外泄 |
| `src/__tests__/unknown-fields.test.ts` | 4 | unknownFields round-trip 保留 |
| `src/__tests__/stash-export.test.ts` | 4 | Stash 字段移除、DNS 转换 |
| `src/__tests__/stash-full-export.test.ts` | 4 | mihomo→Stash 完整端到端导出 + respect-rules 转换 + sub-rules error |
| `src/__tests__/dns-strategy.test.ts` | 4 | DNS 单服务器策略（auto-first/block/need 检测） |
| `src/__tests__/references.test.ts` | 7 | 悬挂代理/组/provider/rule-provider/SUB-RULE/dialer-proxy 引用检测 |
| `src/__tests__/cycle-detector.test.ts` | 4 | 代理组循环/自引用检测 |
| `src/__tests__/chain-validator.test.ts` | 10 | Relay UDP/空/断链/有效/dialer-proxy 及 A→B→A / A→B→C→A 环路检测 / proxy-group 末端 / provider override |
| `src/__tests__/rule-parser.test.ts` | 5 | MATCH/RULE-SET/SUB-RULE/no-resolve/括号逗号解析 |
| `src/__tests__/rule-validator.test.ts` | 9 | 不可达/重复/格式检查及 5 万规则线性性能回归 |
| `src/__tests__/rule-provider-templates.test.ts` | 5 | rule-provider 模板 format 合法性和 ASN `.list` 路径 |
| `src/__tests__/integrity.test.ts` | 4 | 完整配置多问题检测/重复名称检测 |
| `src/__tests__/config-store.test.ts` | 11 | 结构共享、no-op、undo/redo、显式校验和过期派生结果保护 |
| `src/__tests__/config-derivation.test.ts` | 2 | YAML/完整性派生、无 Worker 回退及单快照缓存 |
| `src/__tests__/auto-save.test.tsx` | 2 | YAML/config 快照一致性和并发旧保存丢弃 |
| `src/__tests__/validation.test.ts` | 8 | Zod schema 类型校验/format 枚举/integration with parseYaml/未知字段容忍 |
| `src/__tests__/external-controller.test.ts` | 6 | Controller URL/secret 读取、API URL 构建 |
| `src/__tests__/yaml-diff.test.ts` | 7 | 行级 diff 算法（新增/删除/修改/空文本） |
| `src/__tests__/components/YamlDiff.test.tsx` | 5 | YamlDiff 组件渲染（无差异/新增/删除/统计） |
| `src/__tests__/components/YamlPreview.test.tsx` | 2 | 超长 YAML 与问题列表的有界虚拟渲染 |
| `src/__tests__/components/GeneralEditor.test.tsx` | 5 | GeneralEditor 表单渲染（mode/log-level/IPv6/controller） |
| `src/__tests__/components/NavTree.test.tsx` | 8 | NavTree 导航项渲染/搜索输入/过滤结果验证 |
| `src/__tests__/components/ExportDialog.test.tsx` | 5 | ExportDialog mihomo/Stash 模式/兼容性报告/按钮渲染 |
| `src/__tests__/components/ProxyGroupTopology.test.tsx` | 7 | 拓扑渲染/统计/空状态/自引用/config 变更/边端点完整性 |
| `src/__tests__/components/EditorLayouts.test.tsx` | 2 | DNS 服务器策略 + SubRules 控件等宽布局验证 |
| `src/__tests__/components/RuleProvidersEditor.test.tsx` | 1 | Rule Provider 编辑器默认 format 渲染 |
| `src/__tests__/components/RulesEditor.test.tsx` | 4 | 搜索/删除/拖拽禁用及 5 万规则虚拟化原始 index 保持 |
| `src/__tests__/components/ChainBuilderTopology.test.tsx` | 5 | dialer-proxy 边生成（含目标后置、中继成员、代理组目标、provider override） |
| **合计** | **149** | |

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
| 字段元数据未接入运行时 | `metadata.ts` 与编辑器/Stash 转换可能各自演化 | P2: 接入单一来源或增加一致性测试 | `src/schema/metadata.ts` |

### 16.3 Stash 兼容风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| 字段移除可能遗漏 | Stash 新版本可能支持更多字段 | P2: 定期同步 Stash 文档更新 `STASH_REMOVE_FIELDS` | `src/compatibility/stash.ts` |
| Stash DNS 策略数组支持不确定 | 文档可能支持数组但本项目按单服务器处理 | P2: 确认 Stash 最新 DNS 行为后调整策略 | `src/compatibility/dns-strategy.ts` |

### 16.4 YAML 和导入导出风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| YAML 注释 round-trip 未完成 | 导入→编辑→导出后注释仅在导入时提取，未注入输出 | P2: 基于 yaml 包 Document API 实现完整 round-trip | `src/schema/yaml.ts` |
| unknown field 仅显式管理顶层 | 嵌套未知字段依赖对象透传，缺少独立契约和测试 | P2: 定义嵌套保留策略并补测试 | `src/schema/unknown-fields.ts` |
| CORS URL 拉取失败 | 用户无法直接导入远程配置 | ✅ 已提供手动粘贴/文件上传/CORS proxy 三种兜底 | `src/components/import/UrlImport.tsx` |
| 密码字段在 YAML 明文 | 导出 .yaml 文件包含明文密码 | 提醒用户在导出前自行处理 | — |

### 16.5 测试覆盖风险

| 风险 | 影响 | 建议 |
|------|------|------|
| 无 E2E 测试 | 完整用户流程未自动验证 | P2: 可选 Playwright |
| 无 UI store 测试 | Zustand UI store 逻辑未验证 | P2: 添加 ui-store.test.ts |
| Controller hook 网络分支缺少测试 | 请求、认证失败、取消和延迟更新未被自动验证 | P2: mock fetch 覆盖 `useExternalController` |

### 16.6 本轮审查已修复 (2026-06-14)

基于 `docs/PROJECT_REVIEW_REPORT.md` 的审查意见，以下 P1–P3 项已在本轮修复：

| 修复项 | 优先级 | 说明 |
|--------|--------|------|
| `updateConfig` undo/redo 历史快照时序 | P1 | `saveToHistory(snapshot)` 在 `set()` 之后传入已修改的 config，补真实路径 test |
| Proxies/ProxyGroups 搜索后 index 错位 | P1 | filtered 保留原始 index `{ proxy, idx }`，编辑/删除操作目标正确 |
| 规则引用 `no-resolve` 误判为目标 | P1 | 新增 `src/lib/rule-parser.ts` 统一解析器，按规则类型定位 target |
| Stash 导出复制按钮绕过 `canExport` | P1 | `handleCopy` 加 `canExport` 检查，复制按钮同步 `disabled` |
| dialer-proxy 多节点环未检测 | P1 | `validateChains()` 新增 DFS 环检测（`circular-chain`），补 A→B→A / A→B→C→A 测试 |
| Stash DNS `respect-rules` 残留 + `sub-rules` error 不可达 | P1 | 转换后 `delete dns['respect-rules']`；sub-rules error 移到 STASH_REMOVE_FIELDS 删除循环之前；补断言测试 |
| URL import 未读取 Settings CORS proxy | P2 | `UrlImport` 初始化和修改时读写 `localStorage('mihomo-yaml-cors-proxy')` |
| NavTree 搜索无过滤逻辑 | P2 | 添加受控 search state + `useMemo` 过滤（含父子节点匹配），补过滤测试 |
| React Flow 拓扑白屏 | P2 | 根因：`useEffect` 中 `setNodes` 与 ReactFlow 初始化竞态。最终修复：受控模式 `nodes={initialNodes}`，补组件测试 |
| 规则编辑器 MATCH 解析错误 | P2 | 合并到 `rule-parser.ts` 统一解析，`parseRule` 按类型区分字段位置 |
| `stringifyYaml` 泄露 `_comments` 内部字段 | P2 | 增加 `delete output._comments`，补 round-trip 测试 |
| 首次打开创建空白草稿 | P3 | `lastSavedRef` 初始化为当前 config YAML，避免首次空保存 |
| 窄屏侧边栏 inline width 覆盖 `max-md:w-0` | P3 | `isNarrow` state 检测 `max-width: 767px` 媒体查询，窄屏不下发 inline style |

### 16.7 本轮新增审查修复 (2026-06-14)

基于 `docs/CODE_REVIEW_REPORT_2026-06-14.md` 的审查意见，以下 P1–P3 项已在本轮工作区修复：

| 修复项 | 优先级 | 说明 |
|--------|--------|------|
| `RULE-SET` 目标解析错位 | P1 | `RULE-SET,provider,policy` 目标修正为第三段，并补 `rule-parser` / references / rule-validator 测试 |
| 导入或打开新配置 undo 历史污染 | P1 | `setConfig()` 默认重置 history，防止跨配置撤销回旧文档 |
| ASN 规则集模板 `format: list` | P2 | ASN `.list` 模板改为 `format: text`，本地 path 保留 `.list` 后缀，Zod format 改为枚举 |
| ChainBuilder 漏画后置 dialer-proxy 边 | P2 | 抽出两轮构图函数，先建节点再建边，补目标后置测试 |
| ProxyGroupTopology 悬空边 | P2 | 为 group/proxy/provider/内置策略创建可见节点，补所有边端点存在测试 |
| 浏览器端 User-Agent 承诺不可靠 | P2 | 直连 fetch 不再设置 `User-Agent`，设置和文档改为限制说明 |
| 首屏 bundle 过大 | P3 | `React.lazy` 按需加载编辑器/预览面板，Vite `manualChunks` 拆分重依赖 |
| README / 交接文档口径过期 | P3 | 当时同步了测试和模块口径；本次审查进一步改为 18 个配置编辑器 + 链路构建器，并移除易过期的静态 Git 清单 |

### 16.8 最新修复 (2026-06-18)

| 修复项 | 优先级 | 说明 |
|--------|--------|------|
| 链路构建器显示顺序反转 | P2 | dialer-proxy 链路文本显示和拓扑图箭头方向与实际数据传输方向相反；反转 `[...chain].reverse()` 文本顺序，交换 topology.ts 中所有边 source↔target；更新对应测试期望值 |

---

## 17. 下一步开发建议

> 历史审查报告中的已处理项记录在 §16.6–§16.8。以下建议基于 2026-06-18 的当前代码复核，不使用“完成百分比”替代具体能力边界。

### P2：体验增强或长期优化

1. **在代理编辑器中显示 external-controller 延迟数据**
   - 原因：`useExternalController` Hook 已完成，但 ProxiesEditor 和 ProxyGroupsEditor 未接入
   - 修改文件：`src/components/editors/proxies/ProxiesEditor.tsx`、`ProxyGroupsEditor.tsx`
   - 验证：连接 controller 后代理列表显示实时延迟数值

2. **Editor 中应用 Proxy 类型辅助 API 进行条件渲染**
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
13. `src/App.tsx` — 路由和编辑器分发（18 个配置编辑器 + 链路构建器）
14. `docs/specs/` — 各模块当前行为、API、依赖和测试索引
15. `docs/EDITOR_COMPONENT_GUIDE.md` — 编辑器共享分组、字段帮助、下拉空值和迁移规范
16. `docs/DEVELOPMENT_HANDOFF.md` — 本文档

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

> **最近审查时间**: 2026-06-18
> **审查基线**: `dev/optimize-large-config-performance` 分支，基于 `main` 的 `b355048`
> **验证结果**: typecheck、lint、build 通过；28 个测试文件、149 个测试全部通过；5 万规则性能验收见 §5
