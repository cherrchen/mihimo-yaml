import { describe, it, expect } from 'vitest'
import { validateChains } from '@/engine/chain-validator'
import { parseYaml } from '@/schema/yaml'

describe('Chain validator', () => {
  it('should warn about UDP in relay groups', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
  - name: node2
    type: ss
    server: s2.com
    port: 8388
    cipher: aes-256-gcm
    password: p
proxy-groups:
  - name: RELAY
    type: relay
    proxies:
      - node1
      - node2
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.some((i) => i.type === 'udp-incompat')).toBe(true)
  })

  it('should detect missing relay proxies', () => {
    const input = `proxies: []
proxy-groups:
  - name: RELAY
    type: relay
    proxies:
      - missing-node
      - also-missing
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.some((i) => i.type === 'missing-relay')).toBe(true)
  })

  it('should detect empty relay (less than 2 proxies)', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
proxy-groups:
  - name: RELAY
    type: relay
    proxies:
      - node1
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.some((i) => i.type === 'empty-relay')).toBe(true)
  })

  it('should pass for valid relay with UDP disabled', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
  - name: node2
    type: ss
    server: s2.com
    port: 8388
    cipher: aes-256-gcm
    password: p
proxy-groups:
  - name: RELAY
    type: relay
    disable-udp: true
    proxies:
      - node1
      - node2
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.filter((i) => i.type !== 'udp-incompat')).toHaveLength(0)
  })

  it('should detect broken dialer-proxy chain', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: non-existent
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.some((i) => i.type === 'broken-chain')).toBe(true)
  })

  it('should detect A -> B -> A dialer-proxy cycle', () => {
    const input = `proxies:
  - name: A
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: B
  - name: B
    type: ss
    server: s2.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: A
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.some((i) => i.type === 'circular-chain')).toBe(true)
  })

  it('should detect A -> B -> C -> A dialer-proxy cycle', () => {
    const input = `proxies:
  - name: A
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: B
  - name: B
    type: ss
    server: s2.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: C
  - name: C
    type: ss
    server: s3.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: A
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = validateChains(config)

    expect(issues.some((i) => i.type === 'circular-chain')).toBe(true)
  })
})
