# store-config

## 职责
Zustand store managing the active mihomo config, undo/redo history, save state, and live validation/compatibility reports.

## 文件
`src/store/config-store.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `useConfigStore` | `Zustand hook` | React hook providing config state and actions |

### State

| 字段 | 类型 | 说明 |
|------|------|------|
| `config` | `MihomoConfig` | The active configuration object |
| `configYaml` | `string` | Cached YAML string representation |
| `configName` | `string` | Human-readable name for the current config |
| `history` | `HistoryEntry[]` | Snapshots for undo/redo traversal |
| `historyIndex` | `number` | Current position in the history array |
| `maxHistory` | `number` | Maximum history entries (default 50) |
| `hasUnsavedChanges` | `boolean` | Dirty flag for unsaved modifications |
| `saveTrigger` | `number` | Incrementing counter to force an immediate save |
| `currentDraftId` | `number \| null` | ID of the currently loaded Draft in IndexedDB |
| `integrityReport` | `IntegrityReport \| null` | Result of the last integrity check |
| `compatibilityReport` | `CompatibilityReport \| null` | Result of the last mihomo-mode compatibility check |

### Actions

| 方法 | 签名 | 说明 |
|------|------|------|
| `setConfig` | `(config: MihomoConfig) => void` | Replaces config, resets history, runs validation |
| `updateConfig` | `(updater: (config: MihomoConfig) => void) => void` | Mutates config in place, pushes history, runs validation |
| `setConfigYaml` | `(yaml: string) => void` | Stores the YAML string representation |
| `setConfigName` | `(name: string) => void` | Sets the config display name |
| `resetConfig` | `() => void` | Resets to `MINIMAL_CONFIG`, clears all state |
| `undo` | `() => void` | Moves historyIndex back one and restores that snapshot |
| `redo` | `() => void` | Moves historyIndex forward one and restores that snapshot |
| `canUndo` | `() => boolean` | Returns true when historyIndex > 0 |
| `canRedo` | `() => boolean` | Returns true when not at end of history |
| `saveToHistory` | `(snapshot?: MihomoConfig) => void` | Pushes a snapshot onto the history stack (truncates redo) |
| `runValidation` | `() => void` | Re-runs integrity check on the current config |
| `runCompatibility` | `() => void` | Re-runs mihomo compatibility report |
| `setHasUnsavedChanges` | `(v: boolean) => void` | Sets the unsaved changes flag |
| `triggerSave` | `() => void` | Increments `saveTrigger` to force an immediate save |
| `setCurrentDraftId` | `(id: number \| null) => void` | Records which IndexedDB draft this config belongs to |

## 依赖
- `zustand` — state management (`create`)
- `@/schema/model` — `MihomoConfig` type
- `@/schema/yaml` — `cloneConfig` for deep-copying config snapshots
- `@/schema/defaults` — `MINIMAL_CONFIG` default object
- `@/engine/integrity` — `runIntegrityCheck`, `IntegrityReport`
- `@/compatibility/stash` — `generateMihomoReport`, `CompatibilityReport`

## 关键数据流
`setConfig` loads a complete config, clones it, resets history to a single entry, clears dirty state, and immediately runs integrity and compatibility checks. `updateConfig` is the workhorse: it clones the current config, applies the updater callback, marks dirty, re-runs validation, and pushes the modified config onto the undo/redo history stack (truncating any redo entries). Undo/redo restore a cloned snapshot from history and re-run validation. `triggerSave` uses an incrementing counter pattern so external hooks can watch for save requests without coupling.

## 关联测试
- `src/__tests__/config-store.test.ts`
