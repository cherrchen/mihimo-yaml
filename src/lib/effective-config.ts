import type { MihomoConfig } from '@/schema/model'

const isDnsValidationError = (path: string) => path === 'dns' || path.startsWith('dns.')

/**
 * Returns the configuration that participates in validation and YAML output.
 * Disabled DNS values stay in editor state so they can be restored later.
 */
export function getEffectiveConfig(config: MihomoConfig): MihomoConfig {
  if (!config.dns || config.dns.enable === true) return config

  const effective = { ...config }
  delete effective.dns
  if (!effective._validationErrors) return effective

  const validationErrors = effective._validationErrors.filter(
    (error) => !isDnsValidationError(error.path),
  )

  return validationErrors.length === effective._validationErrors.length
    ? effective
    : { ...effective, _validationErrors: validationErrors.length > 0 ? validationErrors : undefined }
}
