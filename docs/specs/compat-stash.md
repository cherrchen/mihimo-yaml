# compat-stash

## 职责
Generates compatibility reports and transforms mihomo configs for Stash export.

## 文件
`src/compatibility/stash.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `CompatibilityIssue` | `interface` | Single compatibility problem with field, path, severity, message, and action |
| `CompatibilityReport` | `interface` | Full compatibility report with mode, issues, transformed config, and summary counts |
| `generateStashReport` | `function` | Analyse a MihomoConfig and produce a Stash-mode compatibility report |
| `generateMihomoReport` | `function` | Validate a MihomoConfig for deprecated fields in mihomo mode |

```typescript
interface CompatibilityIssue {
  field: string
  path: string
  severity: 'error' | 'warning' | 'info'
  message: string
  action: 'remove' | 'warn' | 'transform' | 'block' | 'manual'
}

interface CompatibilityReport {
  mode: 'mihomo' | 'stash'
  issues: CompatibilityIssue[]
  transformedConfig: MihomoConfig
  summary: {
    removed: number
    warnings: number
    errors: number
    transformed: number
  }
}

function generateStashReport(config: MihomoConfig): CompatibilityReport
function generateMihomoReport(config: MihomoConfig): CompatibilityReport
```

## 依赖
- `@/schema/model` — type imports (`MihomoConfig`, `DnsConfig`)
- (internal) `STASH_REMOVE_FIELDS` Set — 41 top-level fields unsupported by Stash
- (internal) `STASH_DNS_REMOVE_FIELDS` Set — 16 DNS fields to strip or transform

## 关键数据流
`generateStashReport` deep-clones the config, then walks top-level keys against `STASH_REMOVE_FIELDS` (special-casing `sub-rules` as a blocking error). It delegates DNS transformation to the private `transformDnsForStash`, which removes unsupported DNS fields, converts `respect-rules` to `follow-rule`, and warns on multi-server `nameserver-policy` entries. After DNS, it checks every proxy for unsupported types (`sudoku`/`mieru`/`openvpn`/`masque`) and every rule for unsupported prefixes (PROCESS-NAME-REGEX, SRC-IP-CIDR, etc.). `generateMihomoReport` is a lighter pass that only flags deprecated top-level fields like `global-client-fingerprint`.

## 关联测试
- `src/__tests__/stash-export.test.ts`
- `src/__tests__/stash-full-export.test.ts`
