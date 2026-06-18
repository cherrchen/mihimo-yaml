# compat-dns-strategy

## 职责
Resolves multi-server DNS nameserver-policy entries to single-server selections for Stash export.

## 文件
`src/compatibility/dns-strategy.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `DnsStrategyAction` | `type` | Union of `'auto-first' \| 'manual-choose' \| 'block-export'` |
| `DnsServerChoice` | `interface` | A domain with its server list and currently selected server |
| `resolveSingleServerDns` | `function` | Reduces multi-server DNS policies to single-server per strategy |
| `applyManualDnsChoices` | `function` | Applies user-chosen overrides to DNS nameserver-policy entries |
| `needsDnsResolution` | `function` | Returns `true` if any DNS policy entry has multiple servers |
| `getMultiServerEntries` | `function` | Extracts all multi-server DNS policy entries as `DnsServerChoice[]` |

```typescript
type DnsStrategyAction = 'auto-first' | 'manual-choose' | 'block-export'

interface DnsServerChoice {
  domain: string
  servers: string[]
  selected: string
}

function resolveSingleServerDns(
  policy: Record<string, string | string[]>,
  strategy: DnsStrategyAction,
): {
  resolved: Record<string, string>
  choices: DnsServerChoice[]
  blocked: string[]
}

function applyManualDnsChoices(
  policy: Record<string, string | string[]>,
  manualChoices: Record<string, string>,
): Record<string, string>

function needsDnsResolution(dns?: DnsConfig): boolean
function getMultiServerEntries(dns?: DnsConfig): DnsServerChoice[]
```

## 依赖
- `@/schema/model` — type import (`DnsConfig`)

## 关键数据流
`resolveSingleServerDns` iterates the `nameserver-policy` record. Single-server entries pass through unchanged. Multi-server entries are handled per strategy: `block-export` marks them as blocked; `auto-first` resolves to the first server and records a choice; `manual-choose` does the same but signals that user interaction is expected. `applyManualDnsChoices` then overlays user decisions from a `manualChoices` map onto the original policy. `needsDnsResolution` is a guard that cheaply checks whether any policy entry has an array value longer than 1.

## 关联测试
- `src/__tests__/dns-strategy.test.ts`
