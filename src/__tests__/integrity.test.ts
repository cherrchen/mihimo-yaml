import { describe, it, expect } from 'vitest'
import { runIntegrityCheck } from '@/engine/integrity'
import { parseYaml } from '@/schema/yaml'

describe('Integrity check - full config', () => {
  it('should pass for a clean config', () => {
    const input = `mode: rule
proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - node1
rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - MATCH,PROXY
`
    const config = parseYaml(input)
    const report = runIntegrityCheck(config)

    expect(report.valid).toBe(true)
    expect(report.issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('should detect multiple issues in one config', () => {
    const input = `mode: rule
proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: p
    dialer-proxy: ghost
proxy-groups:
  - name: group-a
    type: select
    proxies:
      - non-existent
  - name: group-b
    type: relay
    proxies:
      - node1
rules:
  - MATCH,DIRECT
  - DOMAIN-SUFFIX,example.com,PROXY
`
    const config = parseYaml(input)
    const report = runIntegrityCheck(config)

    expect(report.valid).toBe(false)
    expect(report.issues.length).toBeGreaterThan(0)
    // Should have: dangling proxy refs, relay UDP warning, unreachable rule
    expect(report.issues.some((i) => i.type === 'dangling-ref')).toBe(true)
    expect(report.issues.some((i) => i.type === 'udp-incompat')).toBe(true)
    expect(report.issues.some((i) => i.type === 'unreachable')).toBe(true)
  })

  it('should detect duplicate proxy names', () => {
    const input = `proxies:
  - name: dup
    type: ss
    server: s1.com
    port: 8388
    cipher: aes-256-gcm
    password: p
  - name: dup
    type: ss
    server: s2.com
    port: 8388
    cipher: aes-256-gcm
    password: p
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const report = runIntegrityCheck(config)

    expect(report.issues.some((i) => i.type === 'duplicate-name')).toBe(true)
  })

  it('should detect duplicate group names', () => {
    const input = `proxies: []
proxy-groups:
  - name: dup
    type: select
    proxies:
      - DIRECT
  - name: dup
    type: select
    proxies:
      - DIRECT
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const report = runIntegrityCheck(config)

    expect(report.issues.some((i) => i.type === 'duplicate-name')).toBe(true)
  })
})
