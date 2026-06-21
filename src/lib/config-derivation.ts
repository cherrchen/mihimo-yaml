import { runIntegrityCheck } from '@/engine/integrity'
import type {
  ConfigDerivationRequest,
  ConfigDerivationResponse,
  DerivedConfig,
} from '@/lib/config-derivation-types'
import type { MihomoConfig } from '@/schema/model'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { getEffectiveConfig } from '@/lib/effective-config'

interface PendingRequest {
  resolve: (result: DerivedConfig) => void
  reject: (error: Error) => void
}

let worker: Worker | null = null
let workerUnavailable = false
let nextRequestId = 1
const pendingRequests = new Map<number, PendingRequest>()
let cachedConfig: MihomoConfig | null = null
let cachedResult: Promise<DerivedConfig> | null = null

export function deriveConfigSync(config: MihomoConfig): DerivedConfig {
  const effectiveConfig = getEffectiveConfig(config)
  return {
    yaml: stringifyYamlOrdered(effectiveConfig),
    integrityReport: runIntegrityCheck(effectiveConfig),
  }
}

function rejectPendingRequests(error: Error) {
  for (const pending of pendingRequests.values()) pending.reject(error)
  pendingRequests.clear()
}

function getWorker(): Worker | null {
  if (workerUnavailable || typeof Worker === 'undefined') return null
  if (worker) return worker

  try {
    worker = new Worker(new URL('../workers/config-derivation.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (event: MessageEvent<ConfigDerivationResponse>) => {
      const response = event.data
      const pending = pendingRequests.get(response.id)
      if (!pending) return
      pendingRequests.delete(response.id)

      if (response.ok) {
        pending.resolve({ yaml: response.yaml, integrityReport: response.integrityReport })
      } else {
        pending.reject(new Error(response.error))
      }
    }
    worker.onerror = () => {
      const error = new Error('Config derivation worker failed')
      worker?.terminate()
      worker = null
      workerUnavailable = true
      rejectPendingRequests(error)
    }
    return worker
  } catch {
    workerUnavailable = true
    return null
  }
}

function deriveInWorker(config: MihomoConfig): Promise<DerivedConfig> {
  const activeWorker = getWorker()
  if (!activeWorker) {
    return new Promise<DerivedConfig>((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(deriveConfigSync(config))
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      }, 0)
    })
  }

  const id = nextRequestId++
  const request: ConfigDerivationRequest = { id, config }
  return new Promise<DerivedConfig>((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject })
    activeWorker.postMessage(request)
  }).catch(() => deriveConfigSync(config))
}

export function deriveConfig(config: MihomoConfig): Promise<DerivedConfig> {
  if (cachedConfig === config && cachedResult) return cachedResult
  cachedConfig = config
  cachedResult = deriveInWorker(config)
  return cachedResult
}

export function resetConfigDerivationForTests() {
  worker?.terminate()
  worker = null
  workerUnavailable = false
  cachedConfig = null
  cachedResult = null
  rejectPendingRequests(new Error('Config derivation reset'))
}
