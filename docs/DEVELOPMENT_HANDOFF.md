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
| **当前完成度** | 约 80%——核心引擎完整、17 个配置模块编辑器全部实现、导入导出闭环完成、52 个测试全部通过 |

### 当前状态关键结论

| 检查项 | 状态 |
|--------|------|
| 可启动 (`npm run dev`) | ✅ 通过 |
| 可构建 (`npm run build`) | ✅ 通过，生成 `dist/` |
| TypeScript typecheck | ✅ 通过，0 错误 |
| ESLint | ✅ 0 错误，4 个 warning（不影响功能） |
| 单元测试 | ✅ 52/52 通过（11 个测试文件） |
| mihomo YAML 导入 | ✅ 文件/URL/剪贴板/模板四种方式 |
| mihomo YAML 导出 | ✅ 下载 .yaml 或复制到剪贴板 |
| Stash 兼容导出 | ✅ 带兼容性报告 |
| 链式代理静态测试 | ✅ dialer-proxy + relay 链路验证 |
| unknownFields round-trip | ✅ 导入→编辑→导出不丢失 |

---

## 2. 当前 Git 状态

| 项目 | 值 |
|------|-----|
| **当前分支** | `main` |
| **当前 commit** | `312ae38` |
| **HEAD 对应** | `Merge branch 'dev/remove-header-border'` |
| **未提交改动** | 无（working tree clean） |
| **dev/* 分支** | `dev/mihomo-config-editor`、`dev/fix-theme-transparency`、`dev/remove-header-border` |
| **已合并到 main** | 是（所有三个 dev 分支均已合并） |
| **已 push 到 origin/main** | 是 |
| **git worktree** | 未使用 |
| **远程仓库** | `git@github.com:cherrchen/mihimo-yaml.git` |

### 最近 10 个 commit

```
312ae38 Merge branch 'dev/remove-header-border'
22acd45 fix: NavTree bottom links - add relative positioning container, remove divider border
80c5397 revert: restore YamlPreview bottom bar border
283a2fc fix: remove bottom bar top border in YAML preview panel
84f41ae revert: restore header bottom border
895ec01 fix: remove header bottom border to clean up layout
348724f Merge branch 'dev/fix-theme-transparency'
9877853 fix: resolve modal transparency and dark divider line
7e8d460 feat: complete remaining editors, import/export UI, topology, persistence, about/settings, tests
95e4484 Merge branch 'dev/mihomo-config-editor'
```

---

## 3. 开发流程回顾

本轮开发遵循以下流程：

1. ✅ 从 `main` 拉取最新
2. ✅ 在 `dev/mihomo-config-editor` 分支进行初始开发
3. ✅ 开发完成后在 dev 分支运行 typecheck / lint / build / test
4. ✅ 合并到 `main`
5. ✅ 在 `main` 再次运行 typecheck / lint / build / test（全部通过）
6. ✅ push 到 `origin/main`
7. ✅ 后续 `dev/fix-theme-transparency` 分支修复弹窗透明和 CSS 变量问题，同样遵循上述流程
8. ✅ 后续 `dev/remove-header-border` 分支修复 NavTree 底部链接定位和分割线问题，同样遵循上述流程

**无偏差**。所有流程均按规范执行。

---

## 4. 功能完成情况总览

| 模块 | 状态 | 关键文件 | 说明 |
|------|------|----------|------|
| 工作台布局 | 已完成 | `src/components/layout/AppShell.tsx` | 3 面板（侧边栏+编辑+预览），可调整大小 |
| YAML 文件导入 | 已完成 | `src/components/import/FileImport.tsx` | 拖拽或选择 .yaml 文件，预览后确认导入 |
| URL 拉取 | 已完成 | `src/components/import/UrlImport.tsx` | fetch 拉取 + CORS 错误兜底（手动粘贴/文件上传/CORS proxy） |
| 剪贴板导入 | 已完成 | `src/components/import/ClipboardImport.tsx` | readText + 手动粘贴 |
| 模板导入 | 已完成 | `src/pages/Dashboard.tsx` | 5 个内置模板 |
| YAML 实时预览 | 已完成 | `src/components/preview/YamlPreview.tsx` | CodeMirror 6，YAML 语法高亮，行号 |
| YAML 导出 | 已完成 | `src/components/export/ExportDialog.tsx` | mihomo 完整+Stash 兼容双模式，下载/剪贴板 |
| mihomo 导出 | 已完成 | `src/schema/yaml.ts` (stringifyYamlOrdered) | 字段顺序：general→dns→hosts→... |
| Stash 导出 | 已完成 | `src/compatibility/stash.ts` | 含兼容性报告 |
| Stash DNS 单服务器策略 | 部分完成 | `src/compatibility/dns-strategy.ts` | 逻辑完成，UI 对话框已实现 |
| unknownFields round-trip | 已完成 | `src/schema/unknown-fields.ts` | 导入→编辑→导出不丢失 |
| general 配置 | 已完成 | `src/components/editors/general/GeneralEditor.tsx` | mode/log-level/ipv6/external-controller 等 |
| DNS 配置 | 已完成 | `src/components/editors/dns/DnsEditor.tsx` | nameserver 列表/策略表格/fallback-filter |
| hosts 配置 | 已完成 | `src/components/editors/hosts/HostsEditor.tsx` | 域名→IP 映射 |
| proxy 配置 | 已完成 | `src/components/editors/proxies/ProxiesEditor.tsx` | 列表+类型分发表单（见第 10 节详细覆盖） |
| proxy-provider 配置 | 已完成 | `src/components/editors/proxy-providers/ProxyProvidersEditor.tsx` | http 预览/override/health-check |
| proxy-group 配置 | 已完成 | `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx` | 成员选择/拓扑图 |
| rule-provider 配置 | 已完成 | `src/components/editors/rule-providers/RuleProvidersEditor.tsx` | MetaCubeX 内置模板选择器 |
| rules 配置 | 已完成 | `src/components/editors/rules/RulesEditor.tsx` | 可展开编辑/类型选择/provider 绑定 |
| sub-rules 配置 | 已完成 | `src/components/editors/sub-rules/SubRulesEditor.tsx` | 子规则定义与编辑 |
| inbounds 配置 | 已完成 | `src/components/editors/inbounds/InboundsEditor.tsx` | 12+ listener 类型表单 |
| tun 配置 | 已完成 | `src/components/editors/tun/TunEditor.tsx` | 20+ 字段 |
| sniffer 配置 | 已完成 | `src/components/editors/sniffer/SnifferEditor.tsx` | 完整字段 |
| tunnels 配置 | 已完成 | `src/components/editors/tunnels/TunnelsEditor.tsx` | 列表编辑 |
| ntp 配置 | 已完成 | `src/components/editors/ntp/NtpEditor.tsx` | 6 个字段 |
| experimental 配置 | 已完成 | `src/components/editors/experimental/ExperimentalEditor.tsx` | 4 个字段 |
| 链式代理构建器 | 已完成 | `src/components/editors/chain-builder/ChainBuilderEditor.tsx` | React Flow 拓扑 + dialer-proxy 链路列表 |
| 链式代理静态测试 | 已完成 | `src/engine/chain-validator.ts` | UDP/空组/断链/自引用检测 |
| external-controller 运行态测试 | 未实现 | — | Settings 页面提供 URL/secret 配置入口，但未实现 API 调用 |
| 模板库 | 已完成 | `src/schema/defaults.ts` | 5 个模板 |
| 历史版本 / 自动保存 | 已完成 | `src/hooks/useAutoSave.ts` + `src/lib/db.ts` | localStorage + Dexie IndexedDB |
| diff | 未实现 | — | 无 YAML diff 功能 |
| license / attribution | 已完成 | `LICENSE` + `README.md` + `src/pages/About.tsx` | CC BY-NC 4.0 |
| 撤销/重做 | 已完成 | `src/store/config-store.ts` | 50 步历史深度的 undo/redo |
| 拖拽排序 | 部分完成 | `@dnd-kit` 已安装 | 仅代理组列表提供排序基础结构，rules/proxies 拖拽未启用 |
| 深色模式 | 已完成 | `src/store/ui-store.ts` + `src/index.css` | light/dark/system |
| 设置页面 | 已完成 | `src/pages/Settings.tsx` | 主题/CORS proxy/controller 配置 |
| 关于页面 | 已完成 | `src/pages/About.tsx` | 协议+attribution+技术栈 |

---

## 5. 架构说明

### 入口和路由

- **入口文件**: `src/main.tsx` — ReactDOM.createRoot，挂载到 `index.html` 的 `#root`
- **路由方式**: 基于 Zustand 状态驱动的单页视图切换（非 react-router）。`src/App.tsx` 的 `renderEditor()` 将 `activeSection` 映射到对应编辑器组件。

### 状态管理

- **配置状态**: `src/store/config-store.ts` — Zustand store，包含当前配置（`MihomoConfig`）、撤销/重做历史栈（50 步）、YAML 字符串、完整性报告、兼容性报告
- **UI 状态**: `src/store/ui-store.ts` — Zustand store，包含主题、侧边栏宽度、活动面板、预览模式、导出模式

### 关键文件路径索引

| 文件 | 职责 |
|------|------|
| `src/schema/model.ts` | 全部 TypeScript 接口定义（MihomoConfig、ProxyConfig、DnsConfig 等，652 行） |
| `src/schema/metadata.ts` | 字段元数据注册表（150+ 字段，含 mihomo/Stash 兼容性标记） |
| `src/schema/metadata-types.ts` | FieldMeta 类型定义 |
| `src/schema/yaml.ts` | YAML parse/stringify/ordered-export/clone |
| `src/schema/unknown-fields.ts` | 未知字段提取和注入（round-trip 保证） |
| `src/schema/defaults.ts` | 5 个内置配置模板 |
| `src/schema/index.ts` | Schema 模块统一导出 |
| `src/compatibility/stash.ts` | Stash 兼容性引擎（字段移除、DNS 转换、报告生成） |
| `src/compatibility/dns-strategy.ts` | DNS 多服务器策略解析（auto-first/manual/block） |
| `src/engine/references.ts` | 交叉引用收集和悬挂引用检测 |
| `src/engine/cycle-detector.ts` | 代理组循环引用检测（DFS） |
| `src/engine/chain-validator.ts` | Relay + dialer-proxy 链路静态验证 |
| `src/engine/rule-validator.ts` | 规则冲突/不可达/重复检测 |
| `src/engine/integrity.ts` | 统一完整性检查入口 |
| `src/store/config-store.ts` | 主配置 Zustand store（含 undo/redo） |
| `src/store/ui-store.ts` | UI 状态 Zustand store |
| `src/lib/db.ts` | Dexie IndexedDB schema（drafts/templates/history/preferences） |
| `src/lib/constants.ts` | 所有常量（PROXY_TYPES、RULE_TYPES、LISTENER_TYPES 等） |
| `src/lib/utils.ts` | cn() 工具函数（clsx + tailwind-merge） |
| `src/hooks/useAutoSave.ts` | 自动保存（localStorage + Dexie debounce） |

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

### Proxy 模型

`ProxyConfig` 接口使用"扁平化"设计：所有 proxy 类型的字段都在同一个接口上，通过 `type` 字段区分。这意味着 WireGuard 的 `public-key` 和 SSH 的 `host-key` 等共存于同一接口。

**优点**: 简单，不需要 discriminated union
**缺点**: TypeScript 无法在编译时检查类型专属字段的必填性

### unknownFields 保存

`MihomoConfig._unknownFields` 是一个 `Record<string, unknown>`，存储导入 YAML 中未建模的顶级字段。通过 `src/schema/unknown-fields.ts` 的 `extractUnknownFields()` 和 `injectUnknownFields()` 实现 round-trip。

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

- `iptables` 配置段（Linux 专用）
- `ebpf` 配置段
- `clash-for-android` 配置段（已建模但无 UI 编辑器）
- 部分 proxy 类型的高级嵌套字段（如 `xhttp-opts.reuse-settings` 的完整子字段）在 UI 中未全部暴露
- `profile` 配置段已建模且有元数据，但 General 编辑器中部分字段未展示

### TypeScript 类型和 Zod 的关系

`zod` 已安装但 **未使用**。当前项目使用 TypeScript 接口做类型约束，但未实现运行时 schema 校验。如果需要运行时校验，需要在 `src/schema/` 下添加 Zod schema 定义。

---

## 7. YAML 导入 / 导出流程

### 导入流程

1. 用户通过 FileImport / UrlImport / ClipboardImport 获取 YAML 字符串
2. `src/schema/yaml.ts` 的 `parseYaml(yamlString)` 调用 `js-yaml.load()` 解析
3. `extractUnknownFields()` 将已知字段和未知字段分离
4. 已知字段写入 Zustand config store，未知字段存入 `config._unknownFields`
5. 解析错误通过 try-catch 捕获，显示错误消息给用户

### 导出流程

1. `stringifyYamlOrdered(config)` 将 config 按预定义顺序组装为 Record
2. 跳过空数组、空对象、undefined、null 值
3. `injectUnknownFields()` 将 `_unknownFields` 追加到输出末尾
4. `js-yaml.dump()` 生成 YAML 字符串
5. 通过 ExportDialog 下载 .yaml 或复制到剪贴板

### 字段顺序

`stringifyYamlOrdered` 使用 `SECTION_ORDER` 数组定义推荐顺序：
`mode → log-level → ... → dns → hosts → sniffer → tun → proxies → proxy-providers → proxy-groups → rule-providers → rules → sub-rules → tunnels → ntp → experimental`

### 特殊字符串和引号

- `js-yaml.dump()` 配置 `forceQuotes: false`，仅在必要时添加引号
- `quotingType: '"'` 使用双引号
- 无自定义引号逻辑——完全依赖 js-yaml 的默认行为

### 注释保留

**不支持**。js-yaml 不保留 YAML 注释。导入的 YAML 注释在 parse 后丢失，导出时无法恢复。

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

- `iptables`（Linux only）
- `ebpf`（Linux only）
- `clash-for-android`（已建模但编辑器未实现）
- 部分 TUN 高级字段（`include-uid-range`、`exclude-mac-address` 等）在 UI 中未暴露
- `tuic-server` 配置的完整 UI

---

## 9. Stash 导出策略

### 导出入口

`src/components/export/ExportDialog.tsx`（mode='stash'）

### 流程

1. `generateStashReport(config)` → `src/compatibility/stash.ts`
2. 按 `STASH_REMOVE_FIELDS`（43 个顶级字段）和 `STASH_DNS_REMOVE_FIELDS`（17 个 DNS 字段）移除不支持的字段
3. DNS 特殊处理：`transformDnsForStash()` 移除 enhanced-mode/fake-ip-range/use-hosts 等，将 `respect-rules` 转换为 `follow-rule`
4. 检测不支持的 proxy 类型（sudoku/mieru/openvpn/masque）和 rule 类型（PROCESS-NAME-REGEX/SRC-IP-CIDR 等），标记为 error
5. 检测 sub-rules 存在，标记为 error
6. 生成兼容性报告（removed/warnings/errors/transformed 计数）
7. 如有多服务器 DNS 策略，弹出 `DnsStrategyDialog` 让用户选择处理方式

### DNS 策略处理

**本项目采用三选一策略**：

1. **自动选择第一个** — 默认，安静处理
2. **用户手动选择** — 弹出对话框，逐条选择
3. **阻止导出** — 拒绝导出直到解决

三种策略通过 `src/compatibility/dns-strategy.ts` 的 `resolveSingleServerDns()` 实现。UI 通过 `src/components/export/DnsStrategyDialog.tsx` 提供交互。

### 静默丢字段风险

**存在但可控**。`STASH_REMOVE_FIELDS` 集合中的字段在导出时会被静默删除，但同时会生成警告级别的兼容性报告条目。导出前用户可在 `CompatibilityReport` 组件中看到全部变更。不会悄无声息地丢失数据。

---

## 10. Proxy / Proxy Group 覆盖情况

### Proxy 类型覆盖

| Proxy 类型 | 编辑器支持 | 说明 |
|-----------|-----------|------|
| DIRECT | ✅ 仅 YAML | 内置策略，无表单（通过规则目标下拉可用） |
| DNS | ✅ 仅 YAML | 内置策略 |
| REJECT / REJECT-DROP / COMPATIBLE / PASS | ✅ 仅 YAML | 内置策略 |
| Shadowsocks (ss) | ✅ 完整表单 | cipher/password/plugin/udp-over-tcp |
| ShadowsocksR (ssr) | ✅ 类型选择可用 | 基础字段（protocol/obfs 等需在 YAML 预览中编辑） |
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

### Proxy Group 公共字段覆盖

✅ name / type / proxies / use / url / interval / lazy / empty-fallback / timeout / max-failed-times / disable-udp / filter / exclude-filter / exclude-type / expected-status / hidden / icon / strategy（load-balance）

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
| MATCH 位置检查 | ✅ 完成 | `src/engine/rule-validator.ts` 检测 MATCH 后的不可达规则 |
| 规则引用完整性 | ✅ 完成 | `src/engine/references.ts` 检测悬挂 rule-provider/sub-rule 引用 |
| 拖拽排序 | ❌ 未实现 | @dnd-kit 已安装但未在规则列表启用 |
| 规则冲突检测 | ❌ 未实现 | 未检测同类型规则覆盖冲突 |
| 规则启用/禁用 | ❌ 未实现 | 无 toggle 功能，所有规则始终生效 |

---

## 12. 链式代理实现说明

### Dialer-proxy 链式代理

✅ **支持**。在 Proxy 编辑器的"高级选项"中可设置 `dialer-proxy` 字段。`src/engine/chain-validator.ts` 的 `buildDialerChain()` 可构建完整链路，`validateChains()` 检测断链和自引用。

### Relay proxy-group 链式代理

✅ **支持**。Proxy Group 编辑器中可选择 `relay` 类型。静态验证包括：
- UDP 不兼容警告（relay 不支持 UDP）
- 空 relay 检测（至少需要 2 个代理）
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

## 13. UI/UX 说明

### 布局

- **3 面板布局**: 左侧导航树（默认 280px，可折叠）| 中间编辑器 | 右侧预览面板（360px，CodeMirror YAML）
- **Header**: 项目名 + 配置名 + 撤销/重做 + 导入/导出按钮 + 主题切换
- **所有面板支持滚动**，编辑器区域 `overflow-y-auto`

### 导航

- **左侧 NavTree**: 17 个配置模块入口，支持搜索过滤
- **底部固定链接**: 设置 + About

### 表单设计

- `FieldWrapper` 组件统一管理标签、描述、示例、必填标记、兼容性 badge
- `SensitiveField` 组件默认隐藏密码/密钥，点击眼睛图标切换显示
- 高级字段可折叠（`DetailsSection` 组件）
- 每个字段有简短描述和 `mihomo only` / `stash only` 标记

### 深色模式

✅ **支持**。通过 `useUiStore` 的 theme 状态（light/dark/system）+ CSS 变量 + Tailwind dark class 切换。

### 响应式

⚠️ **有限**。主要优化桌面宽屏（≥ 1280px）。移动端基础可浏览但编辑体验未优化。

### 键盘操作

- Ctrl+Z / Ctrl+Shift+Z：撤销/重做
- Tab / Enter：标准表单导航
- 未实现键盘快捷键导航（如 Ctrl+P 搜索文件等）

### 敏感字段

✅ 密码、私钥、UUID、token 等字段默认 `type="password"`，带可见性切换按钮。

### 错误定位

⚠️ **部分支持**。验证错误在 YAML 预览面板的"问题"标签中显示，按类型分组，但点击错误**不会**自动跳转到对应编辑字段。

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

> **所有命令均在 `main` 分支 `312ae38` commit 执行，时间：2026-06-12。**

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm install` | ✅ 通过 | 0 vulnerabilities |
| `npm run typecheck` (`tsc -b`) | ✅ 通过 | 0 错误 |
| `npm run lint` (`eslint .`) | ✅ 0 errors, 4 warnings | 4 个 react-hooks/exhaustive-deps warning，不影响功能 |
| `npm run build` (`tsc -b && vite build`) | ✅ 通过 | 生成 dist/ (JS 1.1MB, CSS 44KB gzipped 349KB) |
| `npm test` (`vitest run`) | ✅ **52 passed** | 11 个测试文件全部通过 |

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
| **合计** | **52** | |

### 未实现的测试

- 无组件渲染测试（`@testing-library/react` 已安装但未使用）
- 无 UI store 测试
- 无 E2E 测试

---

## 16. 已知问题和风险

### 16.1 功能缺口

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| 无 YAML diff | 用户无法对比配置差异 | P2: 实现 CodeMirror diff 模式 | `src/components/preview/` |
| 规则拖拽排序未启用 | 规则重排需手动编辑 YAML 文本 | P1: 在 RulesEditor 启用 @dnd-kit | `src/components/editors/rules/RulesEditor.tsx` |
| external-controller 未连接 | 无法做真实延迟测试和运行态验证 | P1: 实现 API client | Settings 页面已提供配置入口 |
| 移动端体验未优化 | 小屏设备编辑困难 | P2: 响应式布局调整 | `src/components/layout/` |

### 16.2 Schema 和字段覆盖风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| Zod 未使用 | 无运行时 schema 校验 | P1: 实现 `src/schema/validation.ts` Zod schema | `package.json` 已安装 zod |
| iptables/ebpf 未建模 | 导入 Linux 配置会丢失这些段 | P2: 添加到模型和编辑器 | `src/schema/model.ts` |
| Proxy 类型扁平接口 | TypeScript 无法校验跨类型字段一致性 | P2: 考虑 discriminated union 重构 | `src/schema/model.ts` (ProxyConfig) |
| 部分高级嵌套字段未暴露 UI | 如 xhttp-opts.reuse-settings、grpc-opts.min-streams | P2: 逐步补充字段 | `src/components/editors/proxies/` |

### 16.3 Stash 兼容风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| 字段移除可能遗漏 | Stash 新版本可能支持更多字段 | P2: 定期同步 Stash 文档更新 `STASH_REMOVE_FIELDS` | `src/compatibility/stash.ts` |
| Stash DNS 策略数组支持不确定 | 文档可能支持数组但本项目按单服务器处理 | P2: 确认 Stash 最新 DNS 行为后调整策略 | `src/compatibility/dns-strategy.ts` |

### 16.4 YAML 和导入导出风险

| 风险 | 影响 | 建议 | 相关文件 |
|------|------|------|---------|
| YAML 注释丢失 | 导入→导出后注释不可恢复 | P2: 考虑使用支持注释的 YAML 库或自定义方案 | `src/schema/yaml.ts` |
| CORS URL 拉取失败 | 用户无法直接导入远程配置 | ✅ 已提供手动粘贴/文件上传/CORS proxy 三种兜底 | `src/components/import/UrlImport.tsx` |
| 密码字段在 YAML 明文 | 导出 .yaml 文件包含明文密码 | 提醒用户在导出前自行处理，或提供加密导出选项 | — |
| 密码在 UI 中默认隐藏 | ✅ SensitiveField 组件 | 已处理 | `src/components/editors/shared/SensitiveField.tsx` |

### 16.5 测试覆盖风险

| 风险 | 影响 | 建议 |
|------|------|------|
| 无组件测试 | 编辑器 UI 回归风险 | P2: 添加关键编辑器 smoke test |
| 无 E2E 测试 | 完整用户流程未自动验证 | P2: 可选 Playwright |
| 4 个 ESLint warning | 不影响功能但可能影响 useMemo 优化 | P2: 修复 dependency 警告 |

---

## 17. 下一步开发建议

### P0：必须尽快修复

1. **实现 Stash 导出中 DNS 策略的完整交互流程**
   - 原因：DnsStrategyDialog 的 onConfirm 回调未实际应用用户的选择到导出 YAML
   - 修改文件：`src/components/export/ExportDialog.tsx` 的 `handleDnsConfirm`
   - 验证：导出 Stash 时选择 DNS 策略后，导出的 YAML 中 DNS 策略已正确收敛

### P1：重要但不阻塞基本使用

2. **实现 Zod 运行时 schema 校验**
   - 原因：当前只有 TypeScript 编译时检查，无运行时校验
   - 修改文件：新建 `src/schema/validation.ts`，集成到导入流程
   - 验证：导入无效 YAML 时返回字段级错误

3. **实现 external-controller 连接**
   - 原因：用户可通过 API 测试真实代理延迟
   - 修改文件：新建 `src/hooks/useExternalController.ts`
   - 验证：输入正确的 controller 地址和 secret 后能获取 proxies 列表和延迟

4. **启用规则拖拽排序**
   - 原因：规则顺序至关重要，手动 YAML 编辑容易出错
   - 修改文件：`src/components/editors/rules/RulesEditor.tsx` 集成 `@dnd-kit/sortable`
   - 验证：拖拽规则后 YAML 预览中顺序正确变更

5. **实现 YAML diff**
   - 原因：撤销/重做后用户需要对比差异
   - 修改文件：新建 `src/components/preview/YamlDiff.tsx`
   - 验证：切换历史版本后显示彩色差异

### P2：体验增强或长期优化

6. **实现 iptables/ebpf/clash-for-android 配置 UI**
   - 原因：减少导入 Linux 配置时的数据丢失
   - 修改文件：`src/schema/model.ts` 补充接口，新建编辑器组件

7. **Proxy 类型 discriminated union 重构**
   - 原因：提升类型安全
   - 修改文件：`src/schema/model.ts`

8. **添加组件渲染测试**
   - 原因：确保 UI 回归可检测
   - 修改文件：`src/__tests__/` 下新建

9. **修复 4 个 ESLint react-hooks/exhaustive-deps warning**
   - 原因：useMemo 依赖可能不完整
   - 修改文件：`ChainBuilderEditor.tsx`、`ProxyGroupTopology.tsx`

10. **添加注释保留能力**
    - 原因：导入→编辑→导出应尽量保留原始注释
    - 修改文件：研究 `yaml` vs `yaml-ast-parser` 等方案

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
3. **导入配置**: 从文件/URL/剪贴板导入 YAML
4. **编辑配置**: 通过左侧导航进入各配置模块
5. **预览 YAML**: 右侧面板实时显示生成的 YAML
6. **查看问题**: 点击右侧"问题"标签查看校验结果
7. **导出**: Header 导出按钮 → 选择 mihomo 完整导出或 Stash 兼容导出
8. **下载**: 在弹出的导出对话框中下载 .yaml 或复制到剪贴板
9. **检查兼容性**: Stash 模式下查看兼容性报告（移除/转换/警告）

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
3. `src/schema/model.ts` — 数据模型（652 行，最核心）
4. `src/schema/yaml.ts` — YAML 引擎
5. `src/schema/unknown-fields.ts` — unknownFields 机制
6. `src/engine/integrity.ts` — 完整验证入口
7. `src/compatibility/stash.ts` — Stash 导出逻辑
8. `src/store/config-store.ts` — 状态管理（含 undo/redo）
9. `src/App.tsx` — 路由和编辑器分发
10. `docs/DEVELOPMENT_HANDOFF.md` — 本文档

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
4. 全部通过后合并到 `main`
5. 在 `main` 再次运行上述 4 个验证
6. `git push origin main`

### 优先修复

首先检查 P0 是否仍存在。如果本文档的 P0 项已完成，按 P1→P2 优先顺序推进。

### 修改后必须跑的测试

- 修改 `src/schema/` 下文件 → 必须跑 `yaml.test.ts` 和 `unknown-fields.test.ts`
- 修改 `src/engine/` 下文件 → 必须跑对应测试文件
- 修改 `src/components/` 下文件 → 必须跑 `npm run build` 验证构建
- 修改 `src/store/` 下文件 → 必须跑 `config-store.test.ts`

---

> **文档生成时间**: 2026-06-12
> **文档作者**: AI Agent（基于仓库实际状态生成）
> **仓库状态**: `main` 分支 `312ae38`，working tree clean，所有测试通过
