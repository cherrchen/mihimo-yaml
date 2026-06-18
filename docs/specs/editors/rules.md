# rules

## 职责
Configures routing rules as a comma-separated string array — each rule defines match type, payload, target, and optional extra params.

## 文件
- `src/components/editors/rules/RulesEditor.tsx`
- `src/lib/rule-parser.ts` (parse/build/split utilities)
- `src/lib/constants.ts` (RULE_TYPES)

## UI 结构
Sortable list with search bar. In collapsed view, each row shows index, rule type, payload, → arrow, and target. MATCH rules are mutually exclusive and subsequent rules after MATCH are warned with a yellow highlight. Click a row to expand it into an inline edit form: 4-column grid (type dropdown, payload text/select, target dropdown, extra params text). Drag-and-drop reordering via `@dnd-kit`. Buttons for insert-after and delete per row.

## 配置字段
- `rules` (`string[]`) — each string is comma-delimited: `TYPE,payload,target[,extra...]`

## 使用组件
- `TextField`
- `@dnd-kit/core` (DndContext, DragEndEvent)
- `@dnd-kit/sortable` (SortableContext, useSortable, arrayMove, verticalListSortingStrategy)
- `@dnd-kit/utilities` (CSS)
- `lucide-react` (Plus, Trash2, AlertTriangle, GripVertical, Search)
- `parseRule` / `buildRuleString` from `@/lib/rule-parser`
- `RULE_TYPES` from `@/lib/constants`

## 关联引擎
- `src/engine/rule-validator.ts` — validates unreachable rules (after MATCH), duplicate rules, empty rules, missing MATCH
- `src/engine/references.ts` — checks RULE-SET provider references and SUB-RULE name references

## 关联测试
None specific to this component.
