# hooks-auto-save

## 职责
React hook that watches config changes and auto-saves to localStorage and IndexedDB after a debounce delay.

## 文件
`src/hooks/useAutoSave.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `useAutoSave` | `function` | React hook; initiates auto-save on config change |

```typescript
function useAutoSave(): void
```

## 依赖
- `react` — `useEffect`, `useRef`, `useCallback`
- `@/store/config-store` — reads snapshot/name/trigger and applies matching derived/save state
- `@/lib/config-derivation` — shares the Worker-backed YAML/integrity result with the preview pipeline
- `@/lib/db` — `db` (Dexie instance), `Draft` type

## 关键数据流
The hook waits one second after config/name changes, then requests the shared derived result instead of serialising during render. A save captures immutable config/name snapshots and aborts if either is obsolete before persistence. Immediate save consumes each `saveTrigger` value exactly once. localStorage and Dexie receive the same YAML/config snapshot; `hasUnsavedChanges` is cleared only if that snapshot is still current after the async writes.

## 关联测试
- `src/__tests__/auto-save.test.tsx` — matching YAML/config persistence, immediate save, and stale in-flight save rejection
- `src/__tests__/config-derivation.test.ts` — synchronous derivation, Worker-unavailable fallback, and current-snapshot cache
