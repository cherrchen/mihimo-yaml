import { useCallback, useEffect, useRef } from 'react'
import { deriveConfig } from '@/lib/config-derivation'
import { db } from '@/lib/db'
import type { Draft } from '@/lib/db'
import { useConfigStore } from '@/store/config-store'

const SAVE_DELAY = 1000

export function useAutoSave() {
  const config = useConfigStore((state) => state.config)
  const configName = useConfigStore((state) => state.configName)
  const saveTrigger = useConfigStore((state) => state.saveTrigger)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handledSaveTriggerRef = useRef(saveTrigger)
  const lastSavedConfigRef = useRef(config)
  const lastSavedNameRef = useRef(configName)

  const doSave = useCallback(async () => {
    const snapshot = config
    const nameSnapshot = configName

    if (snapshot === lastSavedConfigRef.current && nameSnapshot === lastSavedNameRef.current) return

    let derived
    try {
      derived = await deriveConfig(snapshot)
    } catch {
      return
    }
    const { yaml, integrityReport } = derived
    const stateBeforePersist = useConfigStore.getState()
    if (stateBeforePersist.config !== snapshot || stateBeforePersist.configName !== nameSnapshot) return

    stateBeforePersist.applyDerivedResult(snapshot, yaml, integrityReport)

    try {
      localStorage.setItem('mihomo-yaml-autosave', yaml)
      localStorage.setItem('mihomo-yaml-autosave-name', nameSnapshot)
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }

    try {
      const currentDraftId = useConfigStore.getState().currentDraftId
      if (currentDraftId) {
        await db.drafts.update(currentDraftId, {
          yaml,
          config: snapshot,
          name: nameSnapshot,
          updatedAt: Date.now(),
        })
      } else {
        const existing = await db.drafts.where('name').equals(nameSnapshot).first()
        if (existing) {
          await db.drafts.update(existing.id!, {
            yaml,
            config: snapshot,
            name: nameSnapshot,
            updatedAt: Date.now(),
          })
          const current = useConfigStore.getState()
          if (current.config === snapshot && current.configName === nameSnapshot) {
            current.setCurrentDraftId(existing.id!)
          }
        } else {
          const id = await db.drafts.put({
            name: nameSnapshot,
            yaml,
            config: snapshot,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          } as Draft)
          const current = useConfigStore.getState()
          if (current.config === snapshot && current.configName === nameSnapshot) {
            current.setCurrentDraftId(id as number)
          }
        }
      }
    } catch {
      // Keep local editing usable when IndexedDB is unavailable.
    }

    const current = useConfigStore.getState()
    if (current.config === snapshot && current.configName === nameSnapshot) {
      lastSavedConfigRef.current = snapshot
      lastSavedNameRef.current = nameSnapshot
      current.setHasUnsavedChanges(false)
    }
  }, [config, configName])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => void doSave(), SAVE_DELAY)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [config, configName, doSave])

  useEffect(() => {
    if (saveTrigger <= handledSaveTriggerRef.current) return
    handledSaveTriggerRef.current = saveTrigger
    if (timerRef.current) clearTimeout(timerRef.current)
    void doSave()
  }, [doSave, saveTrigger])
}
