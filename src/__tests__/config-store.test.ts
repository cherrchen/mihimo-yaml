import { describe, it, expect, beforeEach } from 'vitest'
import { useConfigStore } from '@/store/config-store'

function resetStore() {
  useConfigStore.setState({
    config: { mode: 'rule', proxies: [], rules: [] },
    configYaml: '',
    configName: '未命名配置',
    history: [{ config: { mode: 'rule', proxies: [], rules: [] } }],
    historyIndex: 0,
    integrityReport: null,
    compatibilityReport: null,
  })
}

describe('Config store', () => {
  beforeEach(() => {
    resetStore()
  })

  it('should update config and trigger validation', () => {
    useConfigStore.getState().updateConfig((draft) => {
      draft.mode = 'global'
    })
    const updated = useConfigStore.getState()
    expect(updated.config.mode).toBe('global')
    expect(updated.integrityReport).not.toBeNull()
  })

  it('should limit history to maxHistory', () => {
    const max = useConfigStore.getState().maxHistory

    for (let i = 0; i < max + 5; i++) {
      useConfigStore.getState().updateConfig((draft) => {
        draft['log-level'] = `debug-${i}`
      })
    }

    const state = useConfigStore.getState()
    expect(state.history.length).toBeLessThanOrEqual(max)
  })

  it('should allow undo and redo', () => {
    // Setup: start with 2 entries in history
    useConfigStore.setState({
      history: [
        { config: { mode: 'rule', proxies: [], rules: [] } },
        { config: { mode: 'global', proxies: [], rules: [] } },
      ],
      historyIndex: 1,
      config: { mode: 'global', proxies: [], rules: [] },
    })

    // Undo
    useConfigStore.getState().undo()
    expect(useConfigStore.getState().config.mode).toBe('rule')

    // Redo
    useConfigStore.getState().redo()
    expect(useConfigStore.getState().config.mode).toBe('global')
  })

  it('should limit history to maxHistory', () => {
    const max = useConfigStore.getState().maxHistory

    for (let i = 0; i < max + 5; i++) {
      useConfigStore.getState().updateConfig((draft) => {
        draft['log-level'] = `debug-${i}`
      })
    }

    const state = useConfigStore.getState()
    expect(state.history.length).toBeLessThanOrEqual(max)
  })

  it('should reset config', () => {
    const store = useConfigStore.getState()
    store.updateConfig((draft) => {
      draft.mode = 'direct'
    })

    store.resetConfig()
    const state = useConfigStore.getState()
    expect(state.configName).toBe('未命名配置')
    expect(state.historyIndex).toBe(0)
  })

  it('should set config name', () => {
    const store = useConfigStore.getState()
    store.setConfigName('我的配置')
    expect(useConfigStore.getState().configName).toBe('我的配置')
  })

  it('should run integrity check on updateConfig', () => {
    const store = useConfigStore.getState()
    store.updateConfig((draft) => {
      draft['proxy-groups'] = [
        { name: 'a', type: 'select', proxies: ['non-existent'] },
      ]
    })

    const state = useConfigStore.getState()
    expect(state.integrityReport).not.toBeNull()
    expect(state.integrityReport!.issues.some((i) => i.type === 'dangling-ref')).toBe(true)
  })
})
