# engine-rule-validator

## 职责
Validates rule syntax, detects unreachable and duplicate rules, and checks for a terminating MATCH rule.

## 文件
`src/engine/rule-validator.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `RuleIssue` | `interface` | Describes a rule validation issue |
| `analyzeRules` | `function` | Analyzes the rules array for common problems |

```typescript
interface RuleIssue {
  type: 'conflict' | 'unreachable' | 'duplicate' | 'invalid-format' | 'missing-match'
  message: string
  severity: 'error' | 'warning'
  index?: number          // 0-based index of the offending rule
}

function analyzeRules(config: MihomoConfig): RuleIssue[]
```

## 依赖
- `import type { MihomoConfig } from '@/schema/model'` — config schema type
- `import { parseRule } from '@/lib/rule-parser'` — rule text parser returning type, target, payload

## 关键数据流

`analyzeRules` iterates through `config.rules` in order. For each rule it trims whitespace, parses it via `parseRule`, and delegates format checking to the internal `getFormatError` helper — which validates MATCH rules (target required), SUB-RULE rules (payload and target required), and generic rules (payload and target required). After the MATCH rule is encountered, all subsequent rules are flagged as unreachable. Duplicate detection compares each rule against all other rules in the array. If the rules list is non-empty and no MATCH rule is found, a `missing-match` warning is emitted.

## 关联测试
- `src/__tests__/rule-validator.test.ts`
