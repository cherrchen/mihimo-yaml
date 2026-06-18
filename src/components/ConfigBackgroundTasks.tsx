import { useAutoSave } from '@/hooks/useAutoSave'
import { useConfigDerivation } from '@/hooks/useConfigDerivation'

export function ConfigBackgroundTasks() {
  useConfigDerivation()
  useAutoSave()
  return null
}
