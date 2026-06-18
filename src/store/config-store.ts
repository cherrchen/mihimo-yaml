import { create } from 'zustand'
import { produce, setAutoFreeze } from 'immer'
import type { MihomoConfig } from '@/schema/model'
import { cloneConfig } from '@/schema/yaml'
import { MINIMAL_CONFIG } from '@/schema/defaults'
import type { IntegrityReport } from '@/engine/integrity'
import { runIntegrityCheck } from '@/engine/integrity'
import type { CompatibilityReport } from '@/compatibility/stash'
import { generateMihomoReport } from '@/compatibility/stash'

setAutoFreeze(false)

interface HistoryEntry {
  config: MihomoConfig
}

interface ConfigState {
  config: MihomoConfig
  configYaml: string
  configName: string

  // undo/redo
  history: HistoryEntry[]
  historyIndex: number
  maxHistory: number

  // save state
  hasUnsavedChanges: boolean
  saveTrigger: number
  currentDraftId: number | null

  // validation
  integrityReport: IntegrityReport | null
  compatibilityReport: CompatibilityReport | null
  derivationPending: boolean

  // actions
  setConfig: (config: MihomoConfig) => void
  updateConfig: (updater: (config: MihomoConfig) => void) => void
  setConfigYaml: (yaml: string) => void
  setConfigName: (name: string) => void
  resetConfig: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveToHistory: (snapshot?: MihomoConfig) => void
  runValidation: () => void
  runCompatibility: () => void
  applyDerivedResult: (snapshot: MihomoConfig, yaml: string, report: IntegrityReport) => void
  failDerivedResult: (snapshot: MihomoConfig) => void
  setHasUnsavedChanges: (v: boolean) => void
  triggerSave: () => void
  setCurrentDraftId: (id: number | null) => void
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: { ...MINIMAL_CONFIG },
  configYaml: '',
  configName: '未命名配置',
  history: [{ config: { ...MINIMAL_CONFIG } }],
  historyIndex: 0,
  maxHistory: 50,
  hasUnsavedChanges: false,
  saveTrigger: 0,
  currentDraftId: null,
  integrityReport: null,
  compatibilityReport: null,
  derivationPending: true,

  setConfig: (config) => {
    const snapshot = cloneConfig(config)
    set(() => ({
      config: snapshot,
      history: [{ config: snapshot }],
      historyIndex: 0,
      hasUnsavedChanges: false,
      currentDraftId: null,
      integrityReport: null,
      compatibilityReport: null,
      derivationPending: true,
    }))
  },

  updateConfig: (updater) => {
    const current = get().config
    const next = produce(current, updater)
    if (next === current) return

    const { history, historyIndex, maxHistory } = get()
    const nextHistory = history.slice(0, historyIndex + 1)
    nextHistory.push({ config: next })
    if (nextHistory.length > maxHistory) nextHistory.shift()

    set(() => ({
      config: next,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
      hasUnsavedChanges: true,
      integrityReport: null,
      compatibilityReport: null,
      derivationPending: true,
    }))
  },

  setConfigYaml: (yaml) => {
    set({ configYaml: yaml })
  },

  setConfigName: (name) => {
    set({ configName: name })
  },

  resetConfig: () => {
    const defaults = cloneConfig(MINIMAL_CONFIG)
    set({
      config: defaults,
      configYaml: '',
      configName: '未命名配置',
      history: [{ config: defaults }],
      historyIndex: 0,
      hasUnsavedChanges: false,
      currentDraftId: null,
      integrityReport: null,
      compatibilityReport: null,
      derivationPending: true,
    })
  },

  saveToHistory: (snapshot?: MihomoConfig) => {
    const { history, historyIndex, maxHistory } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ config: snapshot ?? get().config })
    if (newHistory.length > maxHistory) {
      newHistory.shift()
    }
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const config = history[newIndex].config
      set({
        historyIndex: newIndex,
        config,
        hasUnsavedChanges: true,
        integrityReport: null,
        compatibilityReport: null,
        derivationPending: true,
      })
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const config = history[newIndex].config
      set({
        historyIndex: newIndex,
        config,
        hasUnsavedChanges: true,
        integrityReport: null,
        compatibilityReport: null,
        derivationPending: true,
      })
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  runValidation: () => {
    const config = get().config
    set({ integrityReport: runIntegrityCheck(config) })
  },

  runCompatibility: () => {
    const config = get().config
    set({ compatibilityReport: generateMihomoReport(config) })
  },

  applyDerivedResult: (snapshot, yaml, report) => {
    if (get().config !== snapshot) return
    set({ configYaml: yaml, integrityReport: report, derivationPending: false })
  },

  failDerivedResult: (snapshot) => {
    if (get().config !== snapshot) return
    set({ derivationPending: false })
  },

  setHasUnsavedChanges: (v) => {
    set({ hasUnsavedChanges: v })
  },

  triggerSave: () => {
    set((s) => ({ saveTrigger: s.saveTrigger + 1 }))
  },

  setCurrentDraftId: (id) => {
    set({ currentDraftId: id })
  },
}))
