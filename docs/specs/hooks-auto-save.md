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
- `@/store/config-store` — reads `config`, `configName`, `saveTrigger`, `currentDraftId`; calls `setConfigYaml`, `setHasUnsavedChanges`, `setCurrentDraftId`
- `@/schema/yaml` — `stringifyYamlOrdered` to produce YAML from config
- `@/lib/db` — `db` (Dexie instance), `Draft` type

## 关键数据流
The hook serialises the config to YAML via `stringifyYamlOrdered` on every change. A `useEffect` debounces saves with a 1-second `setTimeout` — the timer is cleared and restarted on each config or name change. When the timer fires, `doSave` checks if the YAML or name actually changed since the last persisted state (to avoid no-op writes). It writes to `localStorage` (`mihomo-yaml-autosave` and `mihomo-yaml-autosave-name`) and then to IndexedDB via Dexie: if a `currentDraftId` exists it updates that row; otherwise it looks up by name and updates or inserts. A second `useEffect` watches the `saveTrigger` counter and performs an immediate save (without debounce) when triggered. After a successful save, `hasUnsavedChanges` is set to `false`.

## 关联测试
- No dedicated automated test; localStorage/Dexie writes and debounce/immediate-save behavior are not directly covered
