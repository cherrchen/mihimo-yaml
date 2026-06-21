import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  deriveConfig,
  deriveConfigSync,
  resetConfigDerivationForTests,
} from '@/lib/config-derivation'

describe('config derivation', () => {
  afterEach(() => {
    resetConfigDerivationForTests()
    vi.unstubAllGlobals()
  })

  it('should derive matching YAML and integrity data', () => {
    const config = { mode: 'rule', rules: ['MATCH,DIRECT'] }
    const result = deriveConfigSync(config)

    expect(result.yaml).toContain('MATCH,DIRECT')
    expect(result.integrityReport.valid).toBe(true)
  })

  it('should derive YAML from the effective config when DNS is disabled', () => {
    const result = deriveConfigSync({
      mode: 'rule',
      dns: { enable: false, nameserver: ['https://disabled.example/dns-query'] },
      rules: ['MATCH,DIRECT'],
    })

    expect(result.yaml).not.toContain('dns:')
    expect(result.yaml).not.toContain('disabled.example')
  })

  it('should fall back when Worker is unavailable and cache the current snapshot', async () => {
    vi.stubGlobal('Worker', undefined)
    const config = { mode: 'rule', rules: ['MATCH,DIRECT'] }

    const first = deriveConfig(config)
    const second = deriveConfig(config)

    expect(second).toBe(first)
    await expect(first).resolves.toMatchObject({
      integrityReport: { valid: true },
    })
  })
})
