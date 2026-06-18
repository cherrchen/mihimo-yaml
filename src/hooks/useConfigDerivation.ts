import { startTransition, useEffect } from 'react'
import { deriveConfig } from '@/lib/config-derivation'
import { useConfigStore } from '@/store/config-store'

const DERIVATION_DELAY = 200

export function useConfigDerivation() {
  const config = useConfigStore((state) => state.config)
  const applyDerivedResult = useConfigStore((state) => state.applyDerivedResult)
  const failDerivedResult = useConfigStore((state) => state.failDerivedResult)

  useEffect(() => {
    const snapshot = config
    const timer = setTimeout(() => {
      void deriveConfig(snapshot).then(
        ({ yaml, integrityReport }) => {
          startTransition(() => applyDerivedResult(snapshot, yaml, integrityReport))
        },
        () => failDerivedResult(snapshot),
      )
    }, DERIVATION_DELAY)

    return () => clearTimeout(timer)
  }, [applyDerivedResult, config, failDerivedResult])
}
