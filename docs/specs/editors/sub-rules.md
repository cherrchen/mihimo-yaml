# sub-rules

## 职责
Configures named sub-rule groups — collections of match rules referenced by `SUB-RULE` type entries in the main `rules` array.

## 文件
- `src/components/editors/sub-rules/SubRulesEditor.tsx`

## UI 结构
Shared sidebar + detail layout. The left pane uses 30% width with a 14rem minimum and lists all sub-rule names with rule counts; clicking one selects it. The remaining centered detail pane shows the selected sub-rule's rule rows. Bottom button appends a new default rule, and the header delete button removes the entire group.

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
