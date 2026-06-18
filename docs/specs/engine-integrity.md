# engine-integrity

## 职责
Orchestrates all config integrity checks and produces a unified validation report.

## 文件
`src/engine/integrity.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `IntegrityIssue` | `interface` | A single validation issue |
| `IntegrityReport` | `interface` | Complete validation report aggregating all sub-checks |
| `runIntegrityCheck` | `function` | Runs all integrity checks and returns a unified report |

```typescript
interface IntegrityIssue {
  type: string
  message: string
  severity: 'error' | 'warning'
  path?: string
}

interface IntegrityReport {
  valid: boolean
  issues: IntegrityIssue[]
  references: ReturnType<typeof collectReferences>
  cycles: ReturnType<typeof detectProxyGroupCycles>
  chains: ReturnType<typeof validateChains>
  rules: ReturnType<typeof analyzeRules>
}

function runIntegrityCheck(config: MihomoConfig): IntegrityReport
```

## 依赖
- `import type { MihomoConfig } from '@/schema/model'` — config schema type
- `import { collectReferences } from './references'` — reference collection and dangling checks
- `import { detectProxyGroupCycles, detectSelfReferences } from './cycle-detector'` — cycle and self-reference detection
- `import { validateChains } from './chain-validator'` — relay and dialer-proxy chain validation
- `import { analyzeRules } from './rule-validator'` — rule ordering and format analysis

## 关键数据流

`runIntegrityCheck` is the top-level orchestrator. It first converts any Zod schema validation errors (stored on `config._validationErrors` during import) into `IntegrityIssue` entries. It then delegates to sub-modules in sequence: `collectReferences` for dangling references, `detectProxyGroupCycles` and `detectSelfReferences` for cycles, `validateChains` for chain issues, and `analyzeRules` for rule problems. Each sub-result is mapped to `IntegrityIssue` objects with appropriate severity and path. Additionally, it performs inline duplicate-name detection for proxies and proxy groups. The report is considered `valid` when there are zero `error`-severity issues.

## 关联测试
- `src/__tests__/integrity.test.ts`
