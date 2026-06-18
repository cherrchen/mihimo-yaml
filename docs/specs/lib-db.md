# lib-db

## 职责
Initialises and exports the Dexie.js IndexedDB database for persisting drafts, templates, history, and user preferences.

## 文件
`src/lib/db.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `Draft` | `interface` | A saved config draft with yaml, config object, name, and timestamps |
| `Template` | `interface` | A reusable config template with description and category |
| `HistoryEntry` | `interface` | A timestamped YAML snapshot tied to a draft |
| `UserPreference` | `interface` | A key-value preference pair |
| `db` | `Dexie` instance | The typed database instance with four tables |

```typescript
interface Draft {
  id?: number
  name: string
  yaml: string
  config: unknown
  updatedAt: number
  createdAt: number
}

interface Template {
  id?: number
  name: string
  description: string
  yaml: string
  category: string
  createdAt: number
}

interface HistoryEntry {
  id?: number
  draftId: number
  yaml: string
  timestamp: number
  label: string
}

interface UserPreference {
  key: string
  value: unknown
}

const db: Dexie & {
  drafts: EntityTable<Draft, 'id'>
  templates: EntityTable<Template, 'id'>
  history: EntityTable<HistoryEntry, 'id'>
  preferences: EntityTable<UserPreference, 'key'>
}
```

## 依赖
- `dexie` — IndexedDB wrapper (`Dexie`, `EntityTable`)

## 关键数据流
The module creates a singleton `Dexie` instance named `'mihomo-yaml'` with a single version (v1) schema defining four object stores: `drafts` (auto-incrementing `id`, indexed by `name` and `updatedAt`), `templates` (auto-incrementing `id`, indexed by `name` and `category`), `history` (auto-incrementing `id`, indexed by `draftId` and `timestamp`), and `preferences` (unique `key`). The `db` export is consumed by `useAutoSave` for draft persistence and elsewhere for template and preference management.

## 关联测试
- No dedicated test file
