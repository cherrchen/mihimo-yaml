import { describe, it, expect } from 'vitest'
import { generateStashReport } from '@/compatibility/stash'
import { parseYaml, stringifyYamlOrdered } from '@/schema/yaml'

describe('Full Stash export round-trip', () => {
  it('should export mihomo config to Stash compatible format', () => {
    const input = `mode: rule
log-level: info
ipv6: true
external-controller: '127.0.0.1:9090'
secret: test-secret
profile:
  store-selected: true
unified-delay: true
dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  use-hosts: true
  proxy-server-nameserver:
    - 8.8.8.8
  direct-nameserver:
    - 223.5.5.5
  fallback:
    - 1.1.1.1
  fallback-filter:
    geoip: true
    geoip-code: CN
  nameserver:
    - https://doh.pub/dns-query
  respect-rules: true
proxies:
  - name: node1
    type: ss
    server: s.com
    port: 8388
    cipher: aes-256-gcm
    password: pass
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - node1
      - DIRECT
rule-providers:
  cn:
    type: http
    behavior: domain
    format: yaml
    url: https://cn.yaml
    path: ./ruleset/cn.yaml
rules:
  - RULE-SET,cn,DIRECT
  - MATCH,PROXY
`
    const config = parseYaml(input)
    const report = generateStashReport(config)

    // After Stash transform, top-level fields should be removed
    const tc = report.transformedConfig
    expect(tc['external-controller']).toBeUndefined()
    expect(tc.secret).toBeUndefined()
    expect(tc.ipv6).toBeUndefined()
    expect(tc.profile).toBeUndefined()

    // DNS should have unsupported fields removed
    expect(tc.dns?.['enhanced-mode']).toBeUndefined()
    expect(tc.dns?.['fake-ip-range']).toBeUndefined()
    expect(tc.dns?.['use-hosts']).toBeUndefined()
    expect(tc.dns?.nameserver).toBeDefined()

    // Stringify should produce valid YAML
    const yaml = stringifyYamlOrdered(tc)
    expect(yaml).toBeTypeOf('string')
    expect(yaml).toContain('mode: rule')
    expect(yaml).toContain('nameserver:')
    expect(yaml).not.toContain('external-controller')
    expect(yaml).not.toContain('test-secret')

    // Re-parse should work
    const reparsed = parseYaml(yaml)
    expect(reparsed.mode).toBe('rule')
  })

  it('should handle config without unsupported fields cleanly', () => {
    const input = `mode: rule
dns:
  enable: true
  nameserver:
    - https://doh.pub/dns-query
  fake-ip-filter:
    - '*.lan'
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
    const report = generateStashReport(config)

    expect(report.summary.errors).toBe(0)
  })
})
