import { useEffect, useRef } from 'react'
import { useConfigStore } from '@/store/config-store'
import { stringifyYamlOrdered } from '@/schema/yaml'

const SAVE_DELAY = 1000

export function useAutoSave() {
  const config = useConfigStore((s) => s.config)
  const setConfigYaml = useConfigStore((s) => s.setConfigYaml)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const yaml = stringifyYamlOrdered(config)
      setConfigYaml(yaml)
      try {
        localStorage.setItem('mihomo-yaml-autosave', yaml)
      } catch {
        // Ignore storage errors
      }
    }, SAVE_DELAY)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [config, setConfigYaml])
}
