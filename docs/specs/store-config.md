# store-config

## 职责
Zustand store managing the active mihomo config, structurally shared undo/redo history, save state, and eventually consistent derived YAML/integrity data.

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
| `derivationPending` | `boolean` | Whether YAML/integrity derivation for the current snapshot is pending |

### Actions

| 方法 | 签名 | 说明 |
|------|------|------|
| `setConfig` | `(config: MihomoConfig) => void` | Replaces config, resets history, and marks derived data pending |
| `updateConfig` | `(updater: (config: MihomoConfig) => void) => void` | Applies an Immer mutation, pushes a structurally shared snapshot, and marks derived data pending |
| `setConfigYaml` | `(yaml: string) => void` | Stores the YAML string representation |
| `setConfigName` | `(name: string) => void` | Sets the config display name |
| `resetConfig` | `() => void` | Resets to `MINIMAL_CONFIG`, clears all state |
| `undo` | `() => void` | Moves historyIndex back one and restores that snapshot |
| `redo` | `() => void` | Moves historyIndex forward one and restores that snapshot |
| `canUndo` | `() => boolean` | Returns true when historyIndex > 0 |
| `canRedo` | `() => boolean` | Returns true when not at end of history |
| `saveToHistory` | `(snapshot?: MihomoConfig) => void` | Pushes a snapshot onto the history stack (truncates redo) |
| `runValidation` | `() => void` | Re-runs integrity check on the effective config, excluding disabled DNS |
| `runCompatibility` | `() => void` | Re-runs mihomo compatibility report |
| `applyDerivedResult` | `(snapshot, yaml, report) => void` | Applies worker output only when `snapshot` is still current |
| `failDerivedResult` | `(snapshot) => void` | Clears pending state only for the current snapshot |
| `setHasUnsavedChanges` | `(v: boolean) => void` | Sets the unsaved changes flag |
| `triggerSave` | `() => void` | Increments `saveTrigger` to force an immediate save |
| `setCurrentDraftId` | `(id: number \| null) => void` | Records which IndexedDB draft this config belongs to |

## 依赖
- `zustand` — state management (`create`)
- `immer` — immutable structural sharing for config updates and history
- `@/schema/model` — `MihomoConfig` type
- `@/schema/yaml` — `cloneConfig` for deep-copying config snapshots
- `@/schema/defaults` — `MINIMAL_CONFIG` default object
- `@/engine/integrity` — `runIntegrityCheck`, `IntegrityReport`
- `@/compatibility/stash` — `generateMihomoReport`, `CompatibilityReport`

## 关键数据流
`setConfig` clones an external config once and stores that immutable snapshot as the first history entry. `updateConfig` uses Immer; unchanged branches retain their references, no-op updaters do not create history, and new snapshots are appended without another full deep clone. Undo/redo restore immutable snapshot references directly. Config changes clear stale reports and set `derivationPending`; the background derivation hook applies YAML/integrity output only if the originating config identity is still current. `runValidation` remains an explicit synchronous escape hatch, while compatibility generation is on demand.

## 关联测试
- `src/__tests__/config-store.test.ts`
