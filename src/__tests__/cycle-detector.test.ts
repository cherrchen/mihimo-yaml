import { describe, it, expect } from 'vitest'
import { detectProxyGroupCycles, detectSelfReferences } from '@/engine/cycle-detector'
import { parseYaml } from '@/schema/yaml'

describe('Proxy group cycle detection', () => {
  it('should detect simple cycle between two groups', () => {
    const input = `proxies: []
proxy-groups:
  - name: group-a
    type: select
    proxies:
      - group-b
  - name: group-b
    type: select
    proxies:
      - group-a
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const result = detectProxyGroupCycles(config)

    expect(result.hasCycle).toBe(true)
    expect(result.cycles.length).toBeGreaterThan(0)
  })

  it('should not flag non-cyclic references', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
proxy-groups:
  - name: group-a
    type: select
    proxies:
      - node1
      - DIRECT
  - name: group-b
    type: select
    proxies:
      - group-a
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const result = detectProxyGroupCycles(config)

    expect(result.hasCycle).toBe(false)
  })

  it('should detect self-referencing group', () => {
    const input = `proxies: []
proxy-groups:
  - name: group-a
    type: select
    proxies:
      - group-a
      - DIRECT
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const selfRefs = detectSelfReferences(config)

    expect(selfRefs.length).toBeGreaterThan(0)
    expect(selfRefs[0]).toContain('group-a')
  })

  it('should handle empty proxy groups', () => {
    const input = `proxies: []
proxy-groups: []
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const result = detectProxyGroupCycles(config)

    expect(result.hasCycle).toBe(false)
    expect(result.cycles).toEqual([])
  })
})
