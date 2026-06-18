# mihomo-yaml 项目审查报告

> 审查时间: 2026-06-13 23:57:18 +08:00  
> 审查范围: 交接文档、README、构建脚本、核心 schema/YAML 引擎、兼容导出、完整性校验、状态管理、导入导出组件、主要编辑器与现有测试。  
> 当前分支: `main`  
> 当前 HEAD: `dcb751f` (`docs: update README to reflect P0/P1/P2 completion and current feature set`)

## 1. 总体结论

项目整体结构清晰，核心模块划分合理，`typecheck`、`lint`、测试与生产构建在当前环境下最终均通过。代码已经具备可用的 mihomo/Stash YAML 编辑、校验和导出主流程。

但本次审查发现多处测试未覆盖的行为级问题，主要集中在撤销/重做历史、搜索后编辑目标错位、规则引用解析、Stash 导出阻断、链式代理循环检测、设置项未生效，以及若干文档承诺与实际实现不一致的地方。建议在继续开发新功能前，优先修复 P1 项。

## 2. 验证结果

| 命令 | 结果 | 备注 |
|------|------|------|
| `npm run typecheck` | 通过 | `tsc -b` 0 错误 |
| `npm run lint` | 通过 | `eslint .` 0 输出 |
| `npm test` | 通过 | 沙箱内首次因 `@tailwindcss/oxide` 原生依赖加载与 `spawn EPERM` 失败；提升权限后 18 个测试文件、92 个用例全部通过 |
| `npm run build` | 通过 | 沙箱内首次同样因 `spawn EPERM` 失败；提升权限后构建成功 |

构建产物提示:

- `dist/assets/index-Db9RAj_b.js`: 1,320.22 kB, gzip 407.10 kB
- Vite 报告 chunk 超过 500 kB，建议后续考虑按页面/重组件 code splitting。

## 3. 主要发现

### P1 - 撤销/重做历史在真实编辑路径下会丢失 redo 目标

位置:

- `src/store/config-store.ts:74`
- `src/store/config-store.ts:110`
- `src/store/config-store.ts:123`
- `src/store/config-store.ts:137`
- `src/__tests__/config-store.test.ts`

`updateConfig()` 先 clone 当前配置并执行 updater，但随后调用 `saveToHistory()` 保存的是旧的 `config`，不是 updater 后的新配置。结果是用户第一次编辑后，history 中并没有新状态；撤销后再重做会回到旧状态，而不是恢复刚才的编辑。

现有测试没有覆盖真实 `updateConfig()` 产生的 history，而是手工塞入两条历史记录后验证 `undo()`/`redo()`，因此测试通过但实际路径仍有风险。

建议:

- 在 updater 执行后把新配置写入 history。
- historyIndex 应指向当前配置快照。
- 增加测试: 通过 `updateConfig()` 连续编辑两次，然后验证 undo/redo 往返。

### P1 - 代理节点和代理组搜索后会编辑错对象

位置:

- `src/components/editors/proxies/ProxiesEditor.tsx:30`
- `src/components/editors/proxies/ProxiesEditor.tsx:102`
- `src/components/editors/proxies/ProxiesEditor.tsx:105`
- `src/components/editors/proxies/ProxiesEditor.tsx:124`
- `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx:20`
- `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx:84`
- `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx:87`
- `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx:98`

`filtered.map((item, i) => ...)` 使用的是过滤后数组的下标，但后续 `selectedIdx` 又用于访问原始 `proxies[selectedIdx]` 或 `groups[selectedIdx]`。当搜索结果不是从原数组第 0 项开始时，点击搜索结果会打开、编辑或删除错误条目。

建议:

- filtered 列表保留原始 index，例如 `{ item, index }`。
- 更稳妥的做法是用稳定 id/name 作为选中态，而不是数组下标。
- 增加组件测试: 三个节点中搜索第三个，点击后应编辑第三个。

### P1 - 规则引用校验会把 `no-resolve` 等额外参数误判为代理目标

位置:

- `src/engine/references.ts:123`
- `src/engine/references.ts:124`

当前逻辑用 `parts[parts.length - 1]` 作为规则目标。对常见规则 `IP-CIDR,10.0.0.0/8,DIRECT,no-resolve`，实际目标是 `DIRECT`，最后一段 `no-resolve` 是额外参数。该实现会把 `no-resolve` 当作代理/代理组名，产生错误的 dangling reference。

建议:

- 建立按规则类型解析 target 的小型 parser。
- 对 `no-resolve`、`src`、`dst` 等额外参数做白名单或结构化解析。
- 增加 `collectReferences()` 测试覆盖 `IP-CIDR,...,DIRECT,no-resolve`。

### P1 - Stash 导出存在阻断路径不一致

位置:

- `src/components/export/ExportDialog.tsx:46`
- `src/components/export/ExportDialog.tsx:122`
- `src/components/export/ExportDialog.tsx:169`
- `src/components/export/ExportDialog.tsx:173`

`canExport` 只用于禁用“下载 .yaml”按钮，`复制到剪贴板`按钮没有禁用，也没有在 `handleCopy()` 中检查 `canExport`。因此当 Stash 报告包含 error 时，用户不能下载，但仍可复制不兼容配置。

建议:

- 对复制和下载使用同一套 `canExport` 阻断逻辑。
- 如果允许复制，应在 UI 中明确标注“含阻断错误，风险自担”。当前实现没有这种提示。

### P1 - dialer-proxy 环路未被检测

位置:

- `src/engine/chain-validator.ts:17`
- `src/engine/chain-validator.ts:71`
- `src/engine/chain-validator.ts:88`

注释写明要检测 dialer-proxy circular chain，但实现只检测不存在引用和直接自引用。A `dialer-proxy` B、B `dialer-proxy` A 这种多节点环会被判定为正常。

建议:

- 对 proxy 的 `dialer-proxy` 建图并 DFS 检测环。
- `buildDialerChain()` 已有 visited 停止逻辑，但 `validateChains()` 需要把环报告为 error。
- 增加测试覆盖 A -> B -> A 与 A -> B -> C -> A。

### P1 - Stash DNS 转换留下原字段，且 sub-rules 错误检查不可达

位置:

- `src/compatibility/stash.ts:42`
- `src/compatibility/stash.ts:124`
- `src/compatibility/stash.ts:153`
- `src/compatibility/stash.ts:194`
- `src/compatibility/stash.ts:196`

`respect-rules` 被转换为 `follow-rule` 后没有删除原字段，导出的 Stash YAML 可能同时包含 `respect-rules: true` 和 `follow-rule: true`。

另外，`sub-rules` 已在 `STASH_REMOVE_FIELDS` 中被提前删除，后面的 `if (transformed['sub-rules'])` 永远不会命中，所以“Stash 不支持 sub-rules”的 error 报告不可达，实际只会作为 warning/remove 处理。

建议:

- 转换 `respect-rules` 后删除原字段，或明确确认 Stash 同时接受两个字段。
- 调整 `sub-rules` 检查顺序，先报告 error 再决定是否移除。
- 补充 Stash full export 测试，断言输出不包含 `respect-rules` 且 sub-rules 被阻断。

### P2 - 设置页的 CORS 代理 URL 未被 URL 导入使用

位置:

- `src/pages/Settings.tsx:10`
- `src/pages/Settings.tsx:57`
- `src/pages/Settings.tsx:58`
- `src/components/import/UrlImport.tsx:21`
- `src/components/import/UrlImport.tsx:33`

设置页保存 `mihomo-yaml-cors-proxy`，但 `UrlImport` 的 `proxyUrl` 初始值是空字符串，没有读取该设置。因此用户在设置页配置代理后，URL 拉取不会自动使用它。

此外，`UrlImport` 直接在浏览器 `fetch()` 中设置 `User-Agent` 请求头。该能力在浏览器环境中通常不可控或会受 CORS/Forbidden header 限制，功能承诺应重新验证，或改为由可信 CORS proxy 代发请求头。

建议:

- `UrlImport` 初始化时读取 `localStorage.getItem('mihomo-yaml-cors-proxy')`。
- 用户修改代理后可同步回设置，避免两个入口状态割裂。
- 重新定义 User-Agent 功能边界。

### P2 - NavTree 搜索框没有过滤逻辑

位置:

- `src/components/layout/NavTree.tsx:33`
- `src/components/layout/NavTree.tsx:89`
- `src/components/layout/NavTree.tsx:95`
- `docs/DEVELOPMENT_HANDOFF.md`

交接文档声称 NavTree 支持搜索过滤，但当前组件只有一个未受控 input，`NAV_ITEMS.map()` 始终渲染全部项。测试也只验证输入框可以输入文字，没有验证过滤结果。

建议:

- 增加 search state 并过滤父/子节点。
- 补充测试: 输入 `DNS` 后应显示 DNS，隐藏无关条目。

### P2 - React Flow 拓扑图不会随配置变化同步

位置:

- `src/components/editors/chain-builder/ChainBuilderEditor.tsx:26`
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx:84`
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx:85`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:40`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:112`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:113`

`initialNodes` 和 `initialEdges` 会随 config 重新计算，但 `useNodesState(initialNodes)` / `useEdgesState(initialEdges)` 只在首次初始化时使用 initial 值。进入拓扑页后再新增、删除或修改代理/代理组，画布可能停留在旧节点和旧边。

建议:

- 使用 `setNodes`/`setEdges` 在 `initialNodes`/`initialEdges` 变化时同步。
- 或直接把 `nodes={initialNodes}`、`edges={initialEdges}` 作为受控数据，若不需要交互拖拽持久化。

### P2 - RulesEditor 对 MATCH 规则解析错误

位置:

- `src/components/editors/rules/RulesEditor.tsx:88`
- `src/components/editors/rules/RulesEditor.tsx:93`
- `src/components/editors/rules/RulesEditor.tsx:137`

`getRuleParts('MATCH,PROXY')` 返回 `[MATCH, PROXY, '', '']`，但编辑器把第二列作为 payload，第三列作为 target。结果 MATCH 行在列表中显示目标为空，编辑态 target 下拉也为空。

建议:

- `MATCH` 的 target 应取 `parts[1]`。
- rule parser 与 formatter 应按规则类型处理字段位置，避免 UI 解析和校验解析各写一套不一致逻辑。

### P2 - YAML 注释保存承诺与实现不一致，且 `stringifyYaml()` 可能泄露内部字段

位置:

- `src/schema/yaml.ts:39`
- `src/schema/yaml.ts:54`
- `src/schema/yaml.ts:55`
- `src/schema/yaml.ts:58`
- `src/schema/yaml.ts:59`
- `src/schema/yaml.ts:119`

`parseYaml()` 只提取了 document-level `commentBefore`，没有做字段级注释 round-trip。`stringifyYamlOrdered()` 会跳过 `_` 开头字段，但 `stringifyYaml()` 只删除 `_unknownFields` 和 `_validationErrors`，没有删除 `_comments`。如果导入含顶层注释的 YAML 后调用 `stringifyYaml()`，可能把 `_comments` 作为普通 YAML 字段输出。

建议:

- 所有 stringify 路径统一剥离内部字段。
- 若目标是完整注释 round-trip，应基于 `yaml` Document API 保留/写回节点注释，而不是只存 `_comments`。
- 增加含注释 YAML 的 round-trip 测试，断言不会输出 `_comments:`。

### P3 - 自动保存可能在首次打开应用时创建空白草稿

位置:

- `src/hooks/useAutoSave.ts:18`
- `src/hooks/useAutoSave.ts:25`
- `src/hooks/useAutoSave.ts:45`
- `src/hooks/useAutoSave.ts:55`
- `src/hooks/useAutoSave.ts:71`

`useAutoSave()` 在 App 挂载后固定启动定时保存。`lastSavedRef` 初始为空，当前最小配置会在 1 秒后写入 localStorage 和 IndexedDB。用户只是打开应用也可能生成“未命名配置”最近项目。

建议:

- 仅在 `hasUnsavedChanges`、导入、新建、模板选择或显式编辑后保存。
- 或初始化 `lastSavedRef` 为当前 YAML，避免首次空保存。

### P3 - 小屏侧边栏隐藏规则可能被 inline width 覆盖

位置:

- `src/components/layout/AppShell.tsx:36`
- `src/components/layout/AppShell.tsx:39`

侧边栏同时使用 `max-md:w-0` 和 inline `style={{ width: sidebarOpen ? sidebarWidth : 0 }}`。inline style 优先级高于 Tailwind class，小屏下 `max-md:w-0` 可能无法生效。

建议:

- 在小屏条件下不要设置 inline width，或用 CSS 变量配合 media query。

## 4. 测试覆盖缺口

当前 92 个测试能够覆盖 YAML parse/stringify、兼容导出、校验引擎、部分组件 smoke test 和 store 基础行为，但以下关键路径缺少回归测试:

- `updateConfig()` 真实路径下的 undo/redo 往返。
- 搜索过滤后点击、编辑、删除代理节点或代理组。
- `collectReferences()` 对带额外参数规则的 target 解析。
- dialer-proxy 多节点环路。
- Stash 导出 error 状态下复制按钮禁用或阻断。
- `respect-rules` -> `follow-rule` 输出断言。
- NavTree 搜索过滤结果。
- React Flow 拓扑在 config 变化后的同步。
- 含注释 YAML 不输出 `_comments`。
- URL import 是否读取设置页 CORS proxy。

## 5. 交接文档与当前仓库差异

| 项目 | 交接文档/README 描述 | 当前审查结论 |
|------|----------------------|--------------|
| 当前 commit | `b5be08d` | 当前 HEAD 是 `dcb751f`，交接文档 Git 状态已过期 |
| NavTree 搜索 | 声称支持搜索过滤 | 当前只有输入框，无过滤逻辑 |
| 测试状态 | 92/92 通过 | 提升权限后仍为 92/92 通过；沙箱内会因 Windows 原生依赖加载失败 |
| external-controller | README 写“测试代理延迟”，交接文档也有“运行态测试未实现”的描述 | Hook 有 `testDelay()`，但主要编辑器未接入，实际功能边界需要统一文档 |
| 配置模块数 | README 写 19 个，交接文档写 20 个 | 文档口径不一致，建议统一 |
| YAML 注释保留 | 描述为已替换 yaml 包并基础提取 | 尚未完成 round-trip，且 `stringifyYaml()` 有内部字段输出风险 |

## 6. 建议修复顺序

1. 修复 `config-store` history 写入，并补真实 undo/redo 测试。
2. 修复 Proxies/ProxyGroups 搜索后的 index 错位，改用稳定 id/name 选中。
3. 抽出统一 rule parser，修复 `no-resolve` 误判和 MATCH UI 显示。
4. 修复 Stash 导出: 复制阻断、`respect-rules` 删除、sub-rules error 顺序。
5. 为 `validateChains()` 增加 dialer-proxy DFS 环检测。
6. 让 URL import 读取设置页 CORS proxy，并重新定义 User-Agent 功能。
7. 补 NavTree 搜索和 React Flow 拓扑同步。
8. 清理 YAML 内部字段输出，明确注释 round-trip 的真实完成标准。
9. 最后处理体积优化、首次自动保存、小屏侧边栏等 P3 体验项。

## 7. 审查结语

这个项目已经有不错的模块化基础，现有测试和类型检查也为继续迭代提供了安全网。但“测试全绿”目前不能等价于关键用户流程可靠，尤其是编辑器列表选择、撤销/重做、导出阻断和完整性校验这些会直接影响用户配置正确性的路径。建议下一轮集中做一组行为修复和回归测试，再继续扩展字段覆盖。
