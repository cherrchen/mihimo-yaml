# engine-references

## 职责
Collects all named entities in a config and identifies dangling references across proxy groups, proxies, rules, and providers.

## 文件
`src/engine/references.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `BUILTIN_STRATEGIES` | `string[]` | List of built-in strategy names (DIRECT, REJECT, REJECT-DROP, COMPATIBLE, PASS) |
| `ReferenceReport` | `interface` | All collected names and dangling reference lists |
| `collectReferences` | `function` | Main entry point — collects names and checks for dangling refs |

```typescript
const BUILTIN_STRATEGIES: string[]
// = [DIRECT, REJECT, REJECT_DROP, COMPATIBLE, PASS]

interface ReferenceReport {
  allProxyNames: Set<string>
  allGroupNames: Set<string>
  allProviderNames: Set<string>
  allRuleProviderNames: Set<string>
  allListenerNames: Set<string>
  danglingProxyRefs: string[]
  danglingGroupRefs: string[]
  danglingProviderRefs: string[]
  danglingRuleProviderRefs: string[]
  danglingRuleRefs: string[]
}

function collectReferences(config: MihomoConfig): ReferenceReport
```

## 依赖
- `import type { MihomoConfig } from '@/schema/model'` — config schema type
- `import { DIRECT, REJECT, REJECT_DROP, COMPATIBLE, PASS } from '@/lib/constants'` — built-in strategy string constants
- `import { getRulePolicyTarget, getRuleProviderName, getSubRuleName } from '@/lib/rule-parser'` — rule parsing utilities

## 关键数据流

`collectReferences` first aggregates all named entities from proxies, proxy-providers, proxy-groups, rule-providers, and listeners into `Set` collections. It then iterates over proxy-groups to verify their `proxies` and `use` references exist in the respective sets. Dangling checks also cover `dialer-proxy` references on individual proxies, rule targets via `getRulePolicyTarget`, rule-provider references via `getRuleProviderName`, and sub-rule references via `getSubRuleName`. Built-in strategies (DIRECT, REJECT, etc.) are exempt from dangling checks.

## 关联测试
- `src/__tests__/references.test.ts`
