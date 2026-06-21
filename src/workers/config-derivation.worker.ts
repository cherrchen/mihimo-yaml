import { runIntegrityCheck } from '@/engine/integrity'
import type { ConfigDerivationRequest, ConfigDerivationResponse } from '@/lib/config-derivation-types'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { getEffectiveConfig } from '@/lib/effective-config'

self.onmessage = (event: MessageEvent<ConfigDerivationRequest>) => {
  const { id, config } = event.data

  try {
    const effectiveConfig = getEffectiveConfig(config)
    const response: ConfigDerivationResponse = {
      id,
      ok: true,
      yaml: stringifyYamlOrdered(effectiveConfig),
      integrityReport: runIntegrityCheck(effectiveConfig),
    }
    self.postMessage(response)
  } catch (error) {
    const response: ConfigDerivationResponse = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
    self.postMessage(response)
  }
}

export {}
