# lib-rule-parser

## 职责
Parses and builds mihomo rule strings (comma-separated format), extracting type, payload, target, and extra parameters.

## 文件
`src/lib/rule-parser.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `RuleParts` | `interface` | Decomposed rule: `type`, `payload`, `target`, `extra` |
| `splitRuleParts` | `function` | Splits a rule string into comma-separated parts, respecting parentheses and quotes |
| `parseRule` | `function` | Parses a rule string into `RuleParts` |
| `buildRuleString` | `function` | Reconstructs a rule string from its parts |
| `getRuleProviderName` | `function` | Returns the provider name if the rule is a `RULE-SET` |
| `getSubRuleName` | `function` | Returns the sub-rule name if the rule is a `SUB-RULE` |
| `getRulePolicyTarget` | `function` | Returns the policy target of a rule (null for SUB-RULE) |
| `getRuleTarget` | `function` | Alias for `getRulePolicyTarget` |

```typescript
interface RuleParts {
  type: string
  payload: string
  target: string
  extra: string
}

function splitRuleParts(rule: string): string[]
function parseRule(rule: string): RuleParts
function buildRuleString(type: string, payload: string, target: string, extra: string): string
function getRuleProviderName(rule: string): string | null
function getSubRuleName(rule: string): string | null
function getRulePolicyTarget(rule: string): string | null
const getRuleTarget: (rule: string) => string | null
```

## 依赖
None (zero imports).

## 关键数据流
`splitRuleParts` tokenises a rule string by commas while skipping commas inside parentheses and quoted strings. `parseRule` calls `splitRuleParts`, then determines the target index: `MATCH` has its target at position 1, `RULE-SET` / `SUB-RULE` at position 2, and all other types at position 2 (default). It filters out recognised extra parameter names (`no-resolve`, `src`, `dst`, etc.) from the target field. `buildRuleString` inverts the process. `getRuleProviderName` and `getSubRuleName` are convenience wrappers around `parseRule` for extracting specific fields from RULE-SET and SUB-RULE rules.

## 关联测试
- `src/__tests__/rule-parser.test.ts`
