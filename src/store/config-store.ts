import { create } from 'zustand'
import type { MihomoConfig } from '@/schema/model'
import { cloneConfig } from '@/schema/yaml'
import { MINIMAL_CONFIG } from '@/schema/defaults'
import type { IntegrityReport } from '@/engine/integrity'
import { runIntegrityCheck } from '@/engine/integrity'
import type { CompatibilityReport } from '@/compatibility/stash'
import { generateMihomoReport } from '@/compatibility/stash'

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

  // validation
  integrityReport: IntegrityReport | null
  compatibilityReport: CompatibilityReport | null

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
  saveToHistory: () => void
  runValidation: () => void
  runCompatibility: () => void
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: { ...MINIMAL_CONFIG },
  configYaml: '',
  configName: '未命名配置',
  history: [{ config: { ...MINIMAL_CONFIG } }],
  historyIndex: 0,
  maxHistory: 50,
  integrityReport: null,
  compatibilityReport: null,

  setConfig: (config) => {
    set(() => ({
      config,
      integrityReport: runIntegrityCheck(config),
      compatibilityReport: generateMihomoReport(config),
    }))
  },

  updateConfig: (updater) => {
    const current = get().config
    const cloned = cloneConfig(current)
    updater(cloned)
    get().saveToHistory()
    set(() => ({
      config: cloned,
      integrityReport: runIntegrityCheck(cloned),
      compatibilityReport: generateMihomoReport(cloned),
    }))
  },

  setConfigYaml: (yaml) => {
    set({ configYaml: yaml })
  },

  setConfigName: (name) => {
    set({ configName: name })
  },

  resetConfig: () => {
    const defaults = { ...MINIMAL_CONFIG }
    set({
      config: defaults,
      configYaml: '',
      configName: '未命名配置',
      history: [{ config: defaults }],
      historyIndex: 0,
      integrityReport: null,
      compatibilityReport: null,
    })
  },

  saveToHistory: () => {
    const { history, historyIndex, config, maxHistory } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ config: cloneConfig(config) })
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
      const config = cloneConfig(history[newIndex].config)
      set({
        historyIndex: newIndex,
        config,
        integrityReport: runIntegrityCheck(config),
        compatibilityReport: generateMihomoReport(config),
      })
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const config = cloneConfig(history[newIndex].config)
      set({
        historyIndex: newIndex,
        config,
        integrityReport: runIntegrityCheck(config),
        compatibilityReport: generateMihomoReport(config),
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
}))
