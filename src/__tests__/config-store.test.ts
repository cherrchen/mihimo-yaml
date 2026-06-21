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
    derivationPending: false,
  })
}

describe('Config store', () => {
  beforeEach(() => {
    resetStore()
  })

  it('should update config and defer validation', () => {
    useConfigStore.getState().updateConfig((draft) => {
      draft.mode = 'global'
    })
    const updated = useConfigStore.getState()
    expect(updated.config.mode).toBe('global')
    expect(updated.integrityReport).toBeNull()
    expect(updated.derivationPending).toBe(true)
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

  it('should allow undo and redo through real updateConfig path', () => {
    const store = useConfigStore.getState()

    store.updateConfig((draft) => { draft.mode = 'global' })
    store.updateConfig((draft) => { draft['log-level'] = 'debug' })

    const afterEdits = useConfigStore.getState()
    expect(afterEdits.config.mode).toBe('global')
    expect(afterEdits.config['log-level']).toBe('debug')

    afterEdits.undo()
    const afterUndo = useConfigStore.getState()
    expect(afterUndo.config.mode).toBe('global')
    expect(afterUndo.config['log-level']).toBeUndefined()

    afterUndo.undo()
    const afterUndo2 = useConfigStore.getState()
    expect(afterUndo2.config.mode).toBe('rule')
    expect(afterUndo2.config['log-level']).toBeUndefined()

    afterUndo2.redo()
    const afterRedo = useConfigStore.getState()
    expect(afterRedo.config.mode).toBe('global')
    expect(afterRedo.config['log-level']).toBeUndefined()

    afterRedo.redo()
    const afterRedo2 = useConfigStore.getState()
    expect(afterRedo2.config.mode).toBe('global')
    expect(afterRedo2.config['log-level']).toBe('debug')
  })

  it('should reset undo history when replacing the current config', () => {
    const store = useConfigStore.getState()

    store.updateConfig((draft) => {
      draft.mode = 'global'
      draft.proxies = [{ name: 'node-a', type: 'direct' }]
    })
    expect(useConfigStore.getState().canUndo()).toBe(true)

    useConfigStore.getState().setConfig({
      mode: 'direct',
      proxies: [{ name: 'node-b', type: 'direct' }],
      rules: ['MATCH,DIRECT'],
    })

    const afterReplace = useConfigStore.getState()
    expect(afterReplace.canUndo()).toBe(false)
    afterReplace.undo()
    expect(useConfigStore.getState().config.mode).toBe('direct')
    expect(useConfigStore.getState().config.proxies?.[0].name).toBe('node-b')
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

  it('should allow an explicit integrity check while background derivation is pending', () => {
    const store = useConfigStore.getState()
    store.updateConfig((draft) => {
      draft['proxy-groups'] = [
        { name: 'a', type: 'select', proxies: ['non-existent'] },
      ]
    })

    useConfigStore.getState().runValidation()
    const state = useConfigStore.getState()
    expect(state.integrityReport).not.toBeNull()
    expect(state.integrityReport!.issues.some((i) => i.type === 'dangling-ref')).toBe(true)
  })

  it('should exclude disabled DNS and its imported validation errors from explicit checks', () => {
    useConfigStore.setState({
      config: {
        mode: 'rule',
        dns: { enable: false, nameserver: ['https://disabled.example/dns-query'] },
        _validationErrors: [
          { path: 'dns.nameserver', message: 'invalid DNS server' },
          { path: 'mode', message: 'invalid mode' },
        ],
      },
    })

    useConfigStore.getState().runValidation()

    const state = useConfigStore.getState()
    expect(state.integrityReport?.issues.some((issue) => issue.path === 'dns.nameserver')).toBe(false)
    expect(state.integrityReport?.issues.some((issue) => issue.path === 'mode')).toBe(true)
    expect(state.config.dns?.nameserver).toEqual(['https://disabled.example/dns-query'])
  })

  it('should structurally share untouched config sections and history snapshots', () => {
    useConfigStore.getState().setConfig({
      mode: 'rule',
      proxies: [{ name: 'node-a', type: 'direct' }],
      rules: ['MATCH,DIRECT'],
    })
    const before = useConfigStore.getState().config

    useConfigStore.getState().updateConfig((draft) => {
      draft.mode = 'global'
    })

    const state = useConfigStore.getState()
    expect(state.config).not.toBe(before)
    expect(state.config.proxies).toBe(before.proxies)
    expect(state.config.rules).toBe(before.rules)
    expect(state.history[0].config).toBe(before)
    expect(state.history[1].config).toBe(state.config)
  })

  it('should not add history for an updater that makes no changes', () => {
    const before = useConfigStore.getState()
    before.updateConfig(() => {})

    const after = useConfigStore.getState()
    expect(after.config).toBe(before.config)
    expect(after.history).toBe(before.history)
  })

  it('should ignore a derived result from an obsolete config snapshot', () => {
    const obsolete = useConfigStore.getState().config
    useConfigStore.getState().updateConfig((draft) => {
      draft.mode = 'global'
    })

    useConfigStore.getState().applyDerivedResult(obsolete, 'stale yaml', {
      valid: true,
      issues: [],
      references: {
        allProxyNames: new Set(),
        allGroupNames: new Set(),
        allProviderNames: new Set(),
        allRuleProviderNames: new Set(),
        allListenerNames: new Set(),
        danglingProxyRefs: [],
        danglingGroupRefs: [],
        danglingProviderRefs: [],
        danglingRuleProviderRefs: [],
        danglingRuleRefs: [],
      },
      cycles: { hasCycle: false, cycles: [], path: '' },
      chains: [],
      rules: [],
    })

    expect(useConfigStore.getState().configYaml).toBe('')
    expect(useConfigStore.getState().derivationPending).toBe(true)
  })
})
