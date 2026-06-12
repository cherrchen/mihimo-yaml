import Dexie, { type EntityTable } from 'dexie'

export interface Draft {
  id?: number
  name: string
  yaml: string
  config: unknown
  updatedAt: number
  createdAt: number
}

export interface Template {
  id?: number
  name: string
  description: string
  yaml: string
  category: string
  createdAt: number
}

export interface HistoryEntry {
  id?: number
  draftId: number
  yaml: string
  timestamp: number
  label: string
}

export interface UserPreference {
  key: string
  value: unknown
}

const db = new Dexie('mihomo-yaml') as Dexie & {
  drafts: EntityTable<Draft, 'id'>
  templates: EntityTable<Template, 'id'>
  history: EntityTable<HistoryEntry, 'id'>
  preferences: EntityTable<UserPreference, 'key'>
}

db.version(1).stores({
  drafts: '++id, name, updatedAt',
  templates: '++id, name, category',
  history: '++id, draftId, timestamp',
  preferences: '&key',
})

export { db }
