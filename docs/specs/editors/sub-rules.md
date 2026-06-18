# sub-rules

## 职责
Configures named sub-rule groups — collections of match rules referenced by `SUB-RULE` type entries in the main `rules` array.

## 文件
- `src/components/editors/sub-rules/SubRulesEditor.tsx`

## UI 结构
Sidebar + detail layout. Left sidebar lists all sub-rule names with rule counts; clicking one selects it. Right detail panel shows the selected sub-rule's rule list — each rule is a row with: index, type dropdown, payload text input, target text input, and delete button. Bottom button appends a new default rule. A delete button removes the entire sub-rule group.

## 配置字段
- `sub-rules` (`Record<string, string[]>`) — keyed by sub-rule name, each value is an array of comma-delimited rule strings (`TYPE,payload,target`)

## 使用组件
- `TextField`
- `lucide-react` (Plus, Trash2)
- `RULE_TYPES` from `@/lib/constants`

## 关联引擎
- `src/engine/references.ts` — validates that SUB-RULE references in main rules point to existing sub-rule names

## 关联测试
- `src/__tests__/components/EditorLayouts.test.tsx` (layout/control-width coverage)
