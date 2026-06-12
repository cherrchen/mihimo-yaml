import { describe, it, expect } from 'vitest'
import { parseYaml, stringifyYaml } from '@/schema/yaml'

describe('Unknown fields round-trip', () => {
  it('should preserve unknown top-level fields', () => {
    const input = `mode: rule
unknown-custom-field: some-value
another-custom:
  nested: true
proxies: []
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - DIRECT
rules:
  - MATCH,PROXY
`
    const config = parseYaml(input)
    expect(config._unknownFields).toBeDefined()
    expect(config._unknownFields!['unknown-custom-field']).toBe('some-value')
    expect(config._unknownFields!['another-custom']).toBeDefined()

    const output = stringifyYaml(config)
    expect(output).toContain('unknown-custom-field')
    expect(output).toContain('some-value')
  })

  it('should preserve multiple unknown fields', () => {
    const input = `mode: rule
custom-setting-1: value1
custom-setting-2:
  - item1
  - item2
proxies: []
`
    const config = parseYaml(input)
    expect(config._unknownFields).toBeDefined()

    const keys = Object.keys(config._unknownFields!)
    expect(keys).toContain('custom-setting-1')
    expect(keys).toContain('custom-setting-2')

    const output = stringifyYaml(config)
    expect(output).toContain('custom-setting-1')
    expect(output).toContain('item1')
    expect(output).toContain('item2')
  })

  it('should handle configs without unknown fields', () => {
    const input = `mode: rule
proxies: []
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - DIRECT
`
    const config = parseYaml(input)
    expect(config._unknownFields).toBeUndefined()

    const output = stringifyYaml(config)
    expect(output).toContain('mode: rule')
  })

  it('should round-trip config with unknown fields intact', () => {
    const input = `mode: rule
custom: preserved
dns:
  enable: true
  nameserver:
    - 8.8.8.8
proxy-providers:
  my-provider:
    type: http
    url: https://example.com/sub
    interval: 3600
    unknown-provider-field: hello
`
    const first = parseYaml(input)
    const firstOutput = stringifyYaml(first)
    const second = parseYaml(firstOutput)

    // After round-trip, unknown fields should still be there
    expect(second._unknownFields).toBeDefined()
    expect(second._unknownFields!.custom).toBe('preserved')
  })
})
