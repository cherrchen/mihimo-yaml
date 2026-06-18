import type { IntegrityReport } from '@/engine/integrity'
import type { MihomoConfig } from '@/schema/model'

export interface ConfigDerivationRequest {
  id: number
  config: MihomoConfig
}

export interface DerivedConfig {
  yaml: string
  integrityReport: IntegrityReport
}

export type ConfigDerivationResponse =
  | ({ id: number; ok: true } & DerivedConfig)
  | { id: number; ok: false; error: string }
