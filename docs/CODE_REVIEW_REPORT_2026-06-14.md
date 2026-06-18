# mihomo-yaml Code Review Report

> 审查日期: 2026-06-14  
> 审查范围: `docs/DEVELOPMENT_HANDOFF.md`、README、构建/测试脚本、配置 store、YAML/规则解析、导入导出、Stash 兼容、拓扑图、主要编辑器和现有测试。  
> 当前分支: `main`  
> 当前 HEAD: `7d0ffba` (`docs: update DEVELOPMENT_HANDOFF to reflect 104 tests, review fixes, and current state at b7c85eb`)

## 1. 总体结论

项目当前的类型检查、Lint、测试和生产构建均可通过。上一轮审查报告中的多项 P1/P2 问题已经修复，例如 undo/redo 快照时序、搜索结果 index 错位、Stash 导出复制阻断、`_comments` 内部字段外泄、NavTree 搜索过滤和 React Flow 白屏等。

本轮审查仍发现若干会影响配置正确性或用户承诺一致性的行为问题，优先级最高的是规则解析和导入/打开配置后的 undo 历史污染。建议先修复 P1，再处理拓扑图完整性、规则集模板一致性和文档口径。

## 2. 验证结果

| 命令 | 结果 | 备注 |
|------|------|------|
| `npm run typecheck` | 通过 | `tsc -b` 0 错误 |
| `npm run lint` | 通过 | `eslint .` 0 输出 |
| `npm test` | 通过 | 104 个测试、19 个测试文件全部通过 |
| `npm run build` | 通过 | 生成 `dist/`，但 Vite 提示主 JS chunk 超过 500 kB |

注意: `npm test` 和 `npm run build` 在沙箱内因 Windows 原生依赖加载触发 `spawn EPERM` 失败；按权限流程提升权限后验证通过。这与旧审查报告记录的失败模式一致。

构建产物:

- `dist/assets/index-BsAyog0C.js`: 1,321.72 kB, gzip 407.53 kB
- `dist/assets/index-C71eY-Y0.css`: 46.06 kB, gzip 8.55 kB

## 3. Findings

### P1 - `RULE-SET` 规则目标解析错位

位置:

- `src/lib/rule-parser.ts:10`
- `src/lib/rule-parser.ts:12`
- `src/lib/rule-parser.ts:31`
- `src/components/editors/rules/RulesEditor.tsx`
- `src/engine/references.ts`
- `src/engine/rule-validator.ts:43`

`RULE-SET,cn,DIRECT` 的目标应是第三段 `DIRECT`，但 `RULE_TARGET_INDEX` 把 `RULE-SET` 的 target index 设置成 `3`。这会导致:

- RulesEditor 中 `RULE-SET` 的目标显示为空。
- `collectReferences()` 无法校验 `RULE-SET` 的真实目标是否存在。
- 用户编辑该规则后，可能把合法规则改写成错误结构。

同时，`analyzeRules()` 目前只检查 `parts.length < 2`，普通三段规则即使缺少 target 也不会报错。

建议:

- 将 `RULE-SET` 的 target index 修正为 `2`。
- 确认 `SUB-RULE` 的字段语义，并为其单独写解析测试。
- 增加 `parseRule()` / `getRuleTarget()` 单测，覆盖 `MATCH`、`RULE-SET`、`SUB-RULE`、`IP-CIDR,...,no-resolve`。
- 在 `analyzeRules()` 中按规则类型检查最少字段数和 target 是否为空。

### P1 - 导入或打开新配置不会重置 undo 历史

位置:

- `src/store/config-store.ts:64`
- `src/components/import/FileImport.tsx:46`
- `src/components/import/ClipboardImport.tsx:35`
- `src/components/import/UrlImport.tsx:55`
- `src/components/import/UrlImport.tsx:68`
- `src/pages/Dashboard.tsx:41`
- `src/pages/Dashboard.tsx:49`
- `src/components/layout/Header.tsx:92`

`setConfig()` 只替换当前 config，不会重置 `history` 和 `historyIndex`。文件导入、剪贴板导入、URL 导入、模板选择和打开草稿都会调用 `setConfig()`。如果用户先编辑配置 A，再导入或打开配置 B，撤销按钮仍可能回到配置 A 的历史状态。

这属于跨文档历史污染，影响较大: 用户可能以为只是在撤销当前配置 B 的改动，实际回到了旧配置 A。

建议:

- 让 `setConfig(config)` 默认重置 history 为 `[{ config: cloneConfig(config) }]`，`historyIndex = 0`。
- 如果后续需要“替换 config 但保留历史”的内部能力，另开明确命名的 action。
- 增加测试: 编辑 A -> `setConfig(B)` -> `canUndo()` 应为 false，或 undo 后仍不应回到 A。

### P2 - ASN 规则集模板写入不一致的 `format: list`

位置:

- `src/components/editors/rule-providers/templates.ts:5`
- `src/components/editors/rule-providers/templates.ts:55`
- `src/lib/constants.ts:75`
- `src/components/editors/rule-providers/RuleProvidersEditor.tsx:105`
- `src/schema/validation.ts:283`

规则 Provider UI 的合法 format 是 `yaml` / `text` / `mrs`，但 ASN 模板写入 `format: list`。Zod schema 又只把 `format` 校验为普通 string，因此这个不一致不会被导入校验或编辑器拦住。

影响:

- 用户点击 ASN 模板后会得到 UI 下拉框中不存在的值。
- 导出 YAML 可能包含项目自身常量体系外的 format。
- 测试无法发现 provider format 拼写错误。

建议:

- 确认 mihomo 对 meta-rules-dat ASN `.list` 文件的 provider `format` 应为 `text` 还是其他合法值。
- 如果应为 `text`，模板中保留 URL 后缀 `.list`，但 config 写 `format: text`。
- 将 `RuleProviderConfigSchema.format` 改为枚举或至少复用常量。
- 添加模板回归测试，确保所有模板输出的 `format` 都在 UI 支持范围内。

### P2 - 链路构建器漏画后置 `dialer-proxy` 目标边

位置:

- `src/components/editors/chain-builder/ChainBuilderEditor.tsx:27`
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx:30`
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx:51`

链路构建器在遍历 proxies 时，只在 `added.has(p['dialer-proxy'])` 为 true 时创建边。也就是说，只有当目标代理已经在数组中更早出现时，边才会被画出。若 A 的 `dialer-proxy` 指向列表中更靠后的 B，验证可以通过，但拓扑图不会显示 A -> B。

建议:

- 先创建全部 proxy nodes，再第二轮创建 `dialer-proxy` edges。
- 对缺失目标不要创建正常边，而应依赖 `validateChains()` 报错。
- 增加组件或纯函数测试: A 在前、B 在后时仍应生成 A -> B 边。

### P2 - 代理组拓扑图把边连到未创建的节点

位置:

- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:48`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:55`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:78`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx:93`

`allNames` 包含 proxies、groups 和 providers，但组件实际只为 groups 创建 nodes。随后它会为 group -> proxy、group -> provider 创建 edge，目标节点却不存在。React Flow 中这些边无法完整表达实际关系，用户看到的拓扑图会缺少代理节点和 provider 节点。

现有测试只验证 wrapper 和计数，无法发现图中边是否真的连到可见节点。

建议:

- 为 proxy 和 provider 创建不同样式的节点，或只对已创建的 group 节点画边。
- 如果目标是完整拓扑，建议节点类型分层: group / proxy / provider。
- 测试中断言具体节点 label 和边目标可见，而不只断言 wrapper。

### P2 - 浏览器端 `User-Agent` 设置是无效或不可靠的用户承诺

位置:

- `src/components/import/UrlImport.tsx:32`
- `src/components/import/UrlImport.tsx:34`
- `src/pages/Settings.tsx:68`
- `docs/DEVELOPMENT_HANDOFF.md`
- `README.md`

代码在浏览器 `fetch()` 中传入 `headers: { 'User-Agent': ua }`，设置页和文档也宣称 URL 拉取支持自定义 User-Agent。但浏览器环境通常禁止页面脚本设置 `User-Agent` 这类 forbidden header，实际请求不会可靠携带该值。

建议:

- 将功能边界改为“CORS proxy 代发时可由 proxy 使用自定义 UA”。
- 或移除浏览器直连 fetch 的 UA 文案，避免用户误以为设置生效。
- 添加 E2E 或 mock 测试只能验证代码传参，不能证明浏览器真实请求携带 UA；文档应写清这个限制。

### P3 - 首屏 bundle 偏大，所有编辑器和重组件静态加载

位置:

- `src/App.tsx:9`
- `src/App.tsx:25`
- `src/components/preview/YamlPreview.tsx`
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx`

`App.tsx` 静态导入所有编辑器，预览面板静态导入 CodeMirror，链路/代理组拓扑静态导入 React Flow。当前生产构建主 JS chunk 约 1.32 MB，Vite 已提示 chunk 超过 500 kB。

建议:

- 对非首屏编辑器使用 `React.lazy` + `Suspense`。
- 对 React Flow 拓扑页和 CodeMirror 预览考虑按需加载。
- 若保持当前结构，至少在 `vite.config.ts` 中配置 chunk splitting，避免所有重依赖进入单一入口包。

### P3 - README 和交接文档存在口径不一致

位置:

- `README.md:5`
- `README.md:57`
- `docs/DEVELOPMENT_HANDOFF.md:18`
- `docs/DEVELOPMENT_HANDOFF.md:28`
- `docs/DEVELOPMENT_HANDOFF.md:49`
- `docs/DEVELOPMENT_HANDOFF.md:550`

当前真实测试结果是 104 个测试、19 个测试文件，但 README 仍写 92 个测试、18 个测试文件、19 个模块。交接文档写 working tree clean，但当前 `docs/PROJECT_REVIEW_REPORT.md` 是未跟踪文件。交接文档对 external-controller 也同时出现“已实现代理列表和延迟获取 Hook”和“未实现 API 调用测真实延迟”的描述，口径不一致。

建议:

- README 同步到 104 tests / 19 test files，并统一模块数量口径。
- 交接文档更新当前 HEAD 和 working tree 状态，或删除容易过期的 Git 状态描述。
- external-controller 文档区分“Settings 页可测试连接”和“编辑器内未展示延迟数据”。

## 4. 测试覆盖缺口

建议补充以下回归测试:

1. `parseRule()` 覆盖 `RULE-SET,cn,DIRECT`，目标必须为 `DIRECT`。
2. `collectReferences()` 覆盖 `RULE-SET,missing,UNKNOWN_TARGET` 或目标不存在的规则。
3. `setConfig()` 换文档后 undo 不应回到旧配置。
4. ASN 模板输出的 `format` 必须在 `RULE_PROVIDER_FORMATS` 中。
5. ChainBuilder 中 A 指向后置 B 时应生成边。
6. ProxyGroupTopology 应为所有 edge target 创建 node，或测试不允许悬空 edge。
7. README/交接文档中的测试数量可用脚本或 checklist 防止再次过期。

## 5. 建议修复顺序

1. 修复 `rule-parser` 的 `RULE-SET` target index，并补规则解析/引用校验测试。
2. 修复 `setConfig()` 的 history 重置，补换配置后 undo 测试。
3. 修复 ASN 模板 format 和 Zod 枚举校验。
4. 修复 ChainBuilder 两轮构图，确保 dialer-proxy 边完整。
5. 修复 ProxyGroupTopology 的节点/边一致性。
6. 调整 User-Agent 功能文案或实现路径。
7. 更新 README / DEVELOPMENT_HANDOFF 的过期状态。
8. 评估 lazy loading / chunk splitting。

## 6. 当前 Git 状态备注

审查时 `git status --short` 显示:

```text
?? docs/PROJECT_REVIEW_REPORT.md
```

这说明交接文档中“working tree clean”的描述与当前实际状态不一致。本报告作为新文件新增，未覆盖已有 `docs/PROJECT_REVIEW_REPORT.md`。
