# rule-providers

## 职责
Manages rule providers — remote or local rule sets (domain, IPCIDR, classical) used by routing rules. Includes MetaCubeX community template picker.

## 文件
- `src/components/editors/rule-providers/RuleProvidersEditor.tsx`
- `src/components/editors/rule-providers/templates.ts`

## UI 结构
页面标题与 NavTree 统一为 **规则 Provider**。标题下方保留原有常驻的 MetaCubeX 规则集模板边框卡片和三列模板网格；其后是 **Provider 列表**，包含新增入口、响应式 Provider 卡片和空状态。卡片常显类型、规则行为、文件格式和 HTTP URL，更新间隔、本地路径及下载代理统一收进默认关闭的 **存储与更新** 区域。

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
- `EditorSection`
- `TextField`, `NumberField`, `SelectField`

## 关联引擎
- `src/engine/references.ts` — validates rule provider references in rules
- `src/engine/rule-validator.ts` — analyzes rule/provider relationships
- `src/engine/integrity.ts` — aggregates dangling rule provider references

## 关联测试
- `src/__tests__/components/RuleProvidersEditor.test.tsx` — component integration tests
- `src/__tests__/rule-provider-templates.test.ts` — template data tests
- `src/__tests__/components/FormEditorUx.test.tsx` — 模板卡片位置、模板应用、空状态和响应式布局
