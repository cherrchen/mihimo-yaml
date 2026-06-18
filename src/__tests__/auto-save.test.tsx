import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useConfigStore } from '@/store/config-store'

const mocks = vi.hoisted(() => ({
  deriveConfig: vi.fn(),
  draftPut: vi.fn(),
  draftUpdate: vi.fn(),
  draftFirst: vi.fn(),
}))

vi.mock('@/lib/config-derivation', () => ({
  deriveConfig: mocks.deriveConfig,
}))

vi.mock('@/lib/db', () => ({
  db: {
    drafts: {
      put: mocks.draftPut,
      update: mocks.draftUpdate,
      where: () => ({ equals: () => ({ first: mocks.draftFirst }) }),
    },
  },
}))

describe('useAutoSave', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.deriveConfig.mockReset()
    mocks.draftPut.mockReset().mockResolvedValue(1)
    mocks.draftUpdate.mockReset().mockResolvedValue(1)
    mocks.draftFirst.mockReset().mockResolvedValue(undefined)
    useConfigStore.setState({
      config: { mode: 'rule', rules: ['MATCH,DIRECT'] },
      configYaml: '',
      configName: '测试配置',
      history: [],
      historyIndex: -1,
      hasUnsavedChanges: false,
      saveTrigger: 0,
      currentDraftId: null,
      integrityReport: null,
      compatibilityReport: null,
      derivationPending: false,
    })
  })

  it('should persist YAML and the matching immutable config snapshot', async () => {
    mocks.deriveConfig.mockResolvedValue({
      yaml: 'mode: global\nrules:\n  - MATCH,DIRECT\n',
      integrityReport: { valid: true, issues: [] },
    })
    renderHook(() => useAutoSave())

    act(() => {
      useConfigStore.getState().updateConfig((draft) => {
        draft.mode = 'global'
      })
      useConfigStore.getState().triggerSave()
    })

    await waitFor(() => expect(mocks.draftPut).toHaveBeenCalledTimes(1))
    expect(mocks.draftPut.mock.calls[0][0]).toMatchObject({
      yaml: 'mode: global\nrules:\n  - MATCH,DIRECT\n',
      config: { mode: 'global' },
    })
    expect(useConfigStore.getState().hasUnsavedChanges).toBe(false)
  })

  it('should discard an in-flight save when a newer config replaces its snapshot', async () => {
    let resolveDerivation!: (value: unknown) => void
    mocks.deriveConfig.mockReturnValue(new Promise((resolve) => {
      resolveDerivation = resolve
    }))
    renderHook(() => useAutoSave())

    act(() => {
      useConfigStore.getState().updateConfig((draft) => {
        draft.mode = 'global'
      })
      useConfigStore.getState().triggerSave()
    })
    act(() => {
      useConfigStore.getState().updateConfig((draft) => {
        draft.mode = 'direct'
      })
      resolveDerivation({
        yaml: 'mode: global\n',
        integrityReport: { valid: true, issues: [] },
      })
    })

    await waitFor(() => expect(mocks.deriveConfig).toHaveBeenCalled())
    expect(mocks.draftPut).not.toHaveBeenCalled()
    expect(useConfigStore.getState().hasUnsavedChanges).toBe(true)
  })
})
