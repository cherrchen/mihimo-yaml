# rule-providers

## 职责
Manages rule providers — remote or local rule sets (domain, IPCIDR, classical) used by routing rules. Includes MetaCubeX community template picker.

## 文件
- `src/components/editors/rule-providers/RuleProvidersEditor.tsx`
- `src/components/editors/rule-providers/templates.ts`

## UI 结构
Single-page flat list layout. Top section shows a MetaCubeX rule set template picker (3-column grid, scrollable) with 32 pre-configured templates spanning geo/geosite, geo/geoip, geo-lite, and ASN categories. An "Add" button creates a blank provider. Each provider renders as a card with: type/behavior/format selects, interval, URL (for HTTP type), and advanced fields (local path, download proxy). Each card has its own delete button.

## 配置字段
- `rule-providers` (top-level map, keyed by provider name)
  - `type` — (`http` | `file` | `inline`); inline `payload` is modeled but has no editor control
  - `behavior` — (`domain` | `ipcidr` | `classical`)
  - `format` — (`mrs` | `yaml` | `text`)
  - `interval` — update interval in seconds (default `86400`)
  - `url` — remote URL (HTTP type)
  - `path` — local file path
  - `proxy` — download proxy

## 使用组件
- `FieldWrapper`
- `TextField`, `NumberField`, `SelectField`

## 关联引擎
- `src/engine/references.ts` — validates rule provider references in rules
- `src/engine/rule-validator.ts` — analyzes rule/provider relationships
- `src/engine/integrity.ts` — aggregates dangling rule provider references

## 关联测试
- `src/__tests__/components/RuleProvidersEditor.test.tsx` — component integration tests
- `src/__tests__/rule-provider-templates.test.ts` — template data tests
