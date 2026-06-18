# export

## 职责
提供 mihomo 和 Stash 兼容格式的 YAML 配置导出，包含兼容性分析报告和 DNS 策略处理。

## 文件
- `src/components/export/ExportDialog.tsx`
- `src/components/export/DnsStrategyDialog.tsx`
- `src/components/export/CompatibilityReport.tsx`

## 导出组件
| 组件 | 说明 |
|------|------|
| `ExportDialog` | 导出弹窗：展示兼容性报告、YAML 预览，支持下载和复制，根据 mode 切换 mihomo / Stash 导出逻辑 |
| `DnsStrategyDialog` | DNS 策略处理弹窗：当 Stash 导出遇到多 DNS 服务器的 nameserver-policy 条目时，让用户逐个选择目标服务器或批量处理 |
| `CompatibilityReport` | 兼容性报告组件：以统计卡片和列表形式展示兼容性问题的错误、警告、已转换、已移除数量及详情 |

## UI 结构
`ExportDialog` 为模态对话框，标题按 `mode` 显示"Mihomo 完整导出"或"Stash 兼容导出"，副标题显示当前配置名。内容区域自上而下依次为：
1. **兼容性报告**（`CompatibilityReport`）：四格统计卡片（错误/警告/已转换/已移除）+ 可滚动的问题条目列表，每条显示字段名、操作类型和说明消息，按严重程度着色。
2. **YAML 预览**：截断展示前 3000 字符。
3. **操作栏**："复制到剪贴板"和"下载 .yaml"两个按钮。Stash 模式下若存在多 DNS 服务器条目，会先弹出 `DnsStrategyDialog` 让用户选择处理策略。

`DnsStrategyDialog` 为模态弹窗，列出每个有多 DNS 服务器的域名条目，每项提供下拉选择框。底部提供三个全局操作按钮：全部选第一个、阻止这些策略、确认选择。

`CompatibilityReport` 纯展示组件，按 severity 分别使用红/黄/蓝色图标和背景。

## 依赖
- **状态管理**: `useConfigStore` (config, configName)
- **工具函数**: `stringifyYamlOrdered` from `@/schema/yaml`, `generateMihomoReport` / `generateStashReport` from `@/compatibility/stash`, `getMultiServerEntries` / `resolveSingleServerDns` / `applyManualDnsChoices` from `@/compatibility/dns-strategy`
- **UI 组件**: `Button` from `@/components/ui/button`
- **图标**: `lucide-react` (Download, Copy, CheckCircle2, AlertTriangle, AlertCircle, Info)
- **工具**: `cn` from `@/lib/utils`

## 关联测试
- `src/__tests__/components/ExportDialog.test.tsx` — 测试 mihomo / Stash 导出弹窗渲染、兼容性报告区域、下载/复制按钮、关闭状态
- `src/__tests__/stash-export.test.ts` — 测试 Stash 兼容转换逻辑
- `src/__tests__/stash-full-export.test.ts` — 测试 Stash 完整导出流程
- `src/__tests__/dns-strategy.test.ts` — 测试 DNS 策略处理逻辑
