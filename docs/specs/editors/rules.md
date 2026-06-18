# rules

## 职责
Configures routing rules as a comma-separated string array — each rule defines match type, payload, target, and optional extra params.

## 文件
- `src/components/editors/rules/RulesEditor.tsx`
- `src/lib/rule-parser.ts` (parse/build/split utilities)
- `src/lib/constants.ts` (RULE_TYPES)

## UI 结构
Sortable list with search bar. Lists over 200 matches use `@tanstack/react-virtual` with dynamic row measurement and overscan; the editing and active drag rows remain mounted. Search scans the complete rule set through a deferred query and preserves original indexes for edit/delete. Collapsed rows show index/type/payload/target; clicking expands the inline edit form. Drag-and-drop, insert-after, and delete remain available.

## 配置字段
- `rules` (`string[]`) — each string is comma-delimited: `TYPE,payload,target[,extra...]`

## 使用组件
- `TextField`
- `@dnd-kit/core` (DndContext, DragEndEvent)
- `@dnd-kit/sortable` (SortableContext, useSortable, arrayMove, verticalListSortingStrategy)
- `@dnd-kit/utilities` (CSS)
- `@tanstack/react-virtual` (bounded rendering for large rule sets)
- `lucide-react` (Plus, Trash2, AlertTriangle, GripVertical, Search)
- `parseRule` / `buildRuleString` from `@/lib/rule-parser`
- `RULE_TYPES` from `@/lib/constants`

## 关联引擎
- `src/engine/rule-validator.ts` — O(n) duplicate detection plus unreachable/format/MATCH checks
- `src/engine/references.ts` — parses each rule once for provider/sub-rule/policy references

## 关联测试
- `src/__tests__/components/RulesEditor.test.tsx`
- `src/__tests__/rule-parser.test.ts`
- `src/__tests__/rule-validator.test.ts`

The component and validator suites include a 50,000-rule regression case.
