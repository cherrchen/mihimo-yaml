import { describe, it, expect } from 'vitest'
import { generateStashReport } from '@/compatibility/stash'
import { parseYaml } from '@/schema/yaml'

describe('Stash compatibility export', () => {
  it('should ignore the complete DNS section when its master switch is off', () => {
    const report = generateStashReport({
      mode: 'rule',
      dns: {
        enable: false,
        fallback: ['1.1.1.1'],
        nameserver: ['https://disabled.example/dns-query'],
      },
    })

    expect(report.transformedConfig.dns).toBeUndefined()
    expect(report.issues.some((issue) => issue.path.startsWith('dns.'))).toBe(false)
  })

  it('should remove mihomo-only top-level fields', () => {
    const input = `mode: rule
ipv6: true
external-controller: '127.0.0.1:9090'
secret: mysecret
profile:
  store-selected: true
unified-delay: true
tcp-concurrent: true
dns:
  enable: true
  nameserver:
    - https://doh.pub/dns-query
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

    expect(report.summary.removed).toBeGreaterThan(0)
    expect(report.issues.some((i) => i.field === 'external-controller')).toBe(true)
    expect(report.issues.some((i) => i.field === 'secret')).toBe(true)
    expect(report.issues.some((i) => i.field === 'ipv6')).toBe(true)
    expect(report.issues.some((i) => i.field === 'profile')).toBe(true)

    const tc = report.transformedConfig
    expect(tc['external-controller']).toBeUndefined()
    expect(tc.secret).toBeUndefined()
    expect(tc.ipv6).toBeUndefined()
  })

  it('should remove unsupported DNS fields', () => {
    const input = `dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  ipv6: true
  use-hosts: true
  proxy-server-nameserver:
    - 8.8.8.8
  direct-nameserver:
    - 223.5.5.5
  fallback:
    - 1.1.1.1
  fallback-filter:
    geoip: true
  nameserver:
    - https://doh.pub/dns-query
`
    const config = parseYaml(input)
    const report = generateStashReport(config)

    const tc = report.transformedConfig
    expect(tc.dns?.['enhanced-mode']).toBeUndefined()
    expect(tc.dns?.['fake-ip-range']).toBeUndefined()
    expect(tc.dns?.fallback).toBeUndefined()
    expect(tc.dns?.['fallback-filter']).toBeUndefined()
    expect(tc.dns?.['proxy-server-nameserver']).toBeUndefined()
    expect(tc.dns?.['direct-nameserver']).toBeUndefined()
    expect(tc.dns?.nameserver).toBeDefined()
  })

  it('should warn about multi-server DNS policy', () => {
    const input = `dns:
  enable: true
  nameserver:
    - https://doh.pub/dns-query
  nameserver-policy:
    'geosite:cn':
      - 223.5.5.5
      - 119.29.29.29
      - 114.114.114.114
`
    const config = parseYaml(input)
    const report = generateStashReport(config)

    const dnsWarnings = report.issues.filter((i) => i.path === 'dns.nameserver-policy')
    expect(dnsWarnings.length).toBeGreaterThan(0)
  })

  it('should not report issues for mihomo full export', () => {
    const input = `mode: rule
proxies: []
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - DIRECT
`
    const config = parseYaml(input)
    const report = generateStashReport(config)

    expect(report.summary.errors).toBe(0)
  })
})
