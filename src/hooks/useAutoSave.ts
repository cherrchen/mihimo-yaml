import { useEffect, useRef } from 'react'
import { useConfigStore } from '@/store/config-store'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { db } from '@/lib/db'
import type { Draft } from '@/lib/db'

const SAVE_DELAY = 1000

export function useAutoSave() {
  const config = useConfigStore((s) => s.config)
  const configName = useConfigStore((s) => s.configName)
  const setConfigYaml = useConfigStore((s) => s.setConfigYaml)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const yaml = stringifyYamlOrdered(config)
      setConfigYaml(yaml)

      // Skip if unchanged
      if (yaml === lastSavedRef.current) return
      lastSavedRef.current = yaml

      // Save to localStorage
      try {
        localStorage.setItem('mihomo-yaml-autosave', yaml)
        localStorage.setItem('mihomo-yaml-autosave-name', configName)
      } catch {
        // Ignore storage errors
      }

      // Save to Dexie
      try {
        const existing = await db.drafts.where('name').equals(configName).first()
        if (existing) {
          await db.drafts.update(existing.id!, {
            yaml,
            config: config,
            name: configName,
            updatedAt: Date.now(),
          })
        } else {
          const draft: Draft = {
            name: configName,
            yaml,
            config,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          }
          await db.drafts.put(draft)
        }
      } catch {
        // Ignore Dexie errors
      }
    }, SAVE_DELAY)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [config, configName, setConfigYaml])
}
