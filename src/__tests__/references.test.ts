import { describe, it, expect } from 'vitest'
import { collectReferences } from '@/engine/references'
import { parseYaml } from '@/schema/yaml'

describe('Reference integrity checks', () => {
  it('should detect dangling proxy references in groups', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: server1.com
    port: 8388
    cipher: aes-256-gcm
    password: pass
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - non-existent-proxy
      - DIRECT
      - also-fake
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const refs = collectReferences(config)

    expect(refs.danglingProxyRefs.length).toBeGreaterThan(0)
    expect(refs.danglingProxyRefs.some(
      (r) => r.includes('non-existent-proxy')
    )).toBe(true)
  })

  it('should detect dangling provider references', () => {
    const input = `proxy-groups:
  - name: PROXY
    type: select
    use:
      - non-existent-provider
    proxies:
      - DIRECT
proxies: []
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const refs = collectReferences(config)

    expect(refs.danglingProviderRefs.length).toBeGreaterThan(0)
  })

  it('should pass for valid references', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: server1.com
    port: 8388
    cipher: aes-256-gcm
    password: pass
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - node1
      - DIRECT
rules:
  - MATCH,PROXY
`
    const config = parseYaml(input)
    const refs = collectReferences(config)

    expect(refs.danglingProxyRefs).toHaveLength(0)
    expect(refs.danglingGroupRefs).toHaveLength(0)
    expect(refs.danglingProviderRefs).toHaveLength(0)
  })

  it('should detect RULE-SET references to missing providers', () => {
    const input = `rules:
  - RULE-SET,non-existent-ruleset,DIRECT
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const refs = collectReferences(config)

    expect(refs.danglingRuleProviderRefs.length).toBeGreaterThan(0)
  })

  it('should detect dialer-proxy dangling references', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: server1.com
    port: 8388
    cipher: aes-256-gcm
    password: pass
  - name: node2
    type: ss
    server: server2.com
    port: 8388
    cipher: aes-256-gcm
    password: pass
    dialer-proxy: missing-node
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - node2
rules:
  - MATCH,PROXY
`
    const config = parseYaml(input)
    const refs = collectReferences(config)

    expect(refs.danglingProxyRefs.some(
      (r) => r.includes('dialer-proxy')
    )).toBe(true)
  })
})
