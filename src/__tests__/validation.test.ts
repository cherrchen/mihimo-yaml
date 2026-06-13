import { describe, it, expect } from 'vitest'
import { validateConfig } from '@/schema/validation'
import { parseYaml } from '@/schema/yaml'

describe('Zod config validation', () => {
  it('should pass a valid minimal config', () => {
    const raw = {
      mode: 'rule',
      'log-level': 'info',
      dns: { enable: true, nameserver: ['8.8.8.8'] },
      proxies: [{ name: 'node', type: 'ss', server: 's.com', port: 8388 }],
      'proxy-groups': [{ name: 'PROXY', type: 'select', proxies: ['node'] }],
      rules: ['MATCH,PROXY'],
    }
    const result = validateConfig(raw)
    expect(result.success).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should detect type errors in top-level fields', () => {
    const raw = {
      mode: 123,
      port: 'not-a-number',
      ipv6: 'not-boolean',
    }
    const result = validateConfig(raw)
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const paths = result.errors.map((e) => e.path)
    expect(paths.some((p) => p.includes('mode'))).toBe(true)
  })

  it('should detect type errors in nested DNS config', () => {
    const raw = {
      dns: {
        enable: 'not-boolean',
        'cache-max-size': 'not-a-number',
      },
    }
    const result = validateConfig(raw)
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should detect type errors in proxy array', () => {
    const raw = {
      proxies: [
        { name: 'node1', type: 'ss', port: 'not-a-number' },
      ],
    }
    const result = validateConfig(raw)
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors.some((e) => e.path.includes('port'))).toBe(true)
  })

  it('should accept config with unknown fields via passthrough', () => {
    const raw = {
      mode: 'rule',
      'some-custom-field': 'value',
      'another-custom': { nested: true },
    }
    const result = validateConfig(raw)
    expect(result.success).toBe(true)
  })

  it('should integrate with parseYaml and attach validation errors', () => {
    const yaml = 'mode: 123\nport: string-not-number\ndns:\n  enable: yes-or-no\n'
    const config = parseYaml(yaml)

    expect(config._validationErrors).toBeDefined()
    expect(config._validationErrors!.length).toBeGreaterThan(0)

    const paths = config._validationErrors!.map((e) => e.path)
    expect(paths.some((p) => p.includes('mode'))).toBe(true)
  })

  it('should not attach validation errors for valid YAML', () => {
    const yaml = `mode: rule
dns:
  enable: true
  nameserver:
    - 8.8.8.8
proxies:
  - name: node
    type: ss
    server: s.com
    port: 8388
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - node
rules:
  - MATCH,PROXY
`
    const config = parseYaml(yaml)
    expect(config._validationErrors).toBeUndefined()
  })
})
