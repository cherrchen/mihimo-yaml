# hooks-config-derivation

## 职责
Schedules eventually consistent YAML/integrity updates for the active config while keeping rapid editing and navigation responsive.

## 文件
`src/hooks/useConfigDerivation.ts`

## 导出 API
| 导出 | 说明 |
|------|------|
| `useConfigDerivation()` | React hook mounted by `ConfigBackgroundTasks` |

## 关键数据流
Every config identity change restarts a 200ms timer. The timer requests `deriveConfig(snapshot)` and applies the result inside `startTransition`; store identity guards discard obsolete results. A derivation failure clears pending state only when the failed snapshot is still current. Auto-save calls the same service and therefore reuses an already completed or in-flight result.

## 关联测试
- `src/__tests__/config-derivation.test.ts`
- `src/__tests__/config-store.test.ts`
- `src/__tests__/auto-save.test.tsx`

