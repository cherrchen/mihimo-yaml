import { describe, it, expect } from 'vitest'
import { parseYaml, stringifyYaml, stringifyYamlOrdered } from '@/schema/yaml'

describe('YAML parse/stringify round-trip', () => {
  it('should parse and stringify minimal config', () => {
    const input = `mode: rule
log-level: info
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
    expect(config.mode).toBe('rule')
    expect(config['log-level']).toBe('info')
    expect(config.proxies).toEqual([])
    expect(config['proxy-groups']).toHaveLength(1)
    expect(config['proxy-groups']![0].name).toBe('PROXY')
    expect(config.rules).toHaveLength(1)

    const output = stringifyYaml(config)
    expect(output).toContain('mode: rule')
    expect(output).toContain('log-level: info')
    expect(output).toContain('MATCH,PROXY')
  })

  it('should preserve complete DNS configuration', () => {
    const input = `dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fallback:
    - https://cloudflare-dns.com/dns-query
  fallback-filter:
    geoip: true
    geoip-code: CN
    geosite:
      - gfw
`
    const config = parseYaml(input)
    expect(config.dns?.enable).toBe(true)
    expect(config.dns?.['enhanced-mode']).toBe('fake-ip')
    expect(config.dns?.nameserver).toHaveLength(2)
    expect(config.dns?.fallback).toHaveLength(1)
    expect(config.dns?.['fallback-filter']?.geoip).toBe(true)
    expect(config.dns?.['fallback-filter']?.['geoip-code']).toBe('CN')

    const output = stringifyYaml(config)
    expect(output).toContain('https://doh.pub/dns-query')
    expect(output).toContain('gfw')
  })

  it('should omit disabled or implicitly disabled DNS without deleting editor values', () => {
    const disabledConfig = {
      mode: 'rule' as const,
      dns: { enable: false, nameserver: ['https://disabled.example/dns-query'] },
    }
    const implicitConfig = {
      mode: 'rule' as const,
      dns: { nameserver: ['https://implicit.example/dns-query'] },
    }

    expect(stringifyYaml(disabledConfig)).not.toContain('dns:')
    expect(stringifyYamlOrdered(disabledConfig)).not.toContain('disabled.example')
    expect(stringifyYamlOrdered(implicitConfig)).not.toContain('dns:')
    expect(disabledConfig.dns.nameserver).toEqual(['https://disabled.example/dns-query'])

    disabledConfig.dns.enable = true
    expect(stringifyYamlOrdered(disabledConfig)).toContain('https://disabled.example/dns-query')
  })

  it('should preserve proxy with all common fields', () => {
    const input = `proxies:
  - name: node1
    type: ss
    server: server.example.com
    port: 8388
    cipher: aes-256-gcm
    password: test123
    udp: true
    tfo: true
    dialer-proxy: entry-node
`
    const config = parseYaml(input)
    const proxy = config.proxies![0]
    expect(proxy.name).toBe('node1')
    expect(proxy.type).toBe('ss')
    expect(proxy.server).toBe('server.example.com')
    expect(proxy.port).toBe(8388)
    expect(proxy.cipher).toBe('aes-256-gcm')
    expect(proxy.password).toBe('test123')
    expect(proxy.udp).toBe(true)
    expect(proxy.tfo).toBe(true)
    expect(proxy['dialer-proxy']).toBe('entry-node')

    const output = stringifyYaml(config)
    expect(output).toContain('server.example.com')
    expect(output).toContain('aes-256-gcm')
    expect(output).toContain('entry-node')
  })

  it('should parse and preserve VMess proxy', () => {
    const input = `proxies:
  - name: vmess-node
    type: vmess
    server: vmess.example.com
    port: 443
    uuid: b831381d-6324-4d53-ad4f-8cda48b30811
    alterId: 0
    cipher: auto
    tls: true
    servername: vmess.example.com
    network: ws
    ws-opts:
      path: /ws
`
    const config = parseYaml(input)
    const proxy = config.proxies![0]
    expect(proxy.uuid).toBe('b831381d-6324-4d53-ad4f-8cda48b30811')
    expect(proxy.servername).toBe('vmess.example.com')
    expect(proxy.network).toBe('ws')
    expect(proxy['ws-opts']?.path).toBe('/ws')

    const output = stringifyYaml(config)
    expect(output).toContain('b831381d')
    expect(output).toContain('/ws')
  })

  it('should parse proxy groups correctly', () => {
    const input = `proxy-groups:
  - name: AUTO
    type: url-test
    url: 'https://www.gstatic.com/generate_204'
    interval: 300
    tolerance: 100
    proxies:
      - node1
      - node2
    use:
      - provider1
  - name: RELAY-CHAIN
    type: relay
    proxies:
      - node1
      - node2
      - node3
`
    const config = parseYaml(input)
    expect(config['proxy-groups']).toHaveLength(2)
    expect(config['proxy-groups']![0].type).toBe('url-test')
    expect(config['proxy-groups']![0].url).toBe('https://www.gstatic.com/generate_204')
    expect(config['proxy-groups']![0].use).toEqual(['provider1'])
    expect(config['proxy-groups']![1].type).toBe('relay')
    expect(config['proxy-groups']![1].proxies).toHaveLength(3)
  })

  it('should parse rules correctly', () => {
    const input = `rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - GEOSITE,gfw,PROXY
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - RULE-SET,cn,DIRECT
  - MATCH,PROXY
`
    const config = parseYaml(input)
    expect(config.rules).toHaveLength(5)
    expect(config.rules![0]).toBe('DOMAIN-SUFFIX,google.com,PROXY')
    expect(config.rules![3]).toBe('RULE-SET,cn,DIRECT')
    expect(config.rules![4]).toBe('MATCH,PROXY')
  })

  it('should parse wireguard proxy', () => {
    const input = `proxies:
  - name: wg-node
    type: wireguard
    server: wg.example.com
    port: 51820
    ip: 10.0.0.2
    private-key: ABC123
    public-key: XYZ789
    allowed-ips:
      - 0.0.0.0/0
    mtu: 1420
`
    const config = parseYaml(input)
    const proxy = config.proxies![0]
    expect(proxy.type).toBe('wireguard')
    expect(proxy.ip).toBe('10.0.0.2')
    expect(proxy['private-key']).toBe('ABC123')
    expect(proxy['allowed-ips']).toEqual(['0.0.0.0/0'])
    expect(proxy.mtu).toBe(1420)
  })

  it('should parse Hysteria2 proxy', () => {
    const input = `proxies:
  - name: h2-node
    type: hysteria2
    server: h2.example.com
    port: 443
    password: mypass
    up: 50 Mbps
    down: 100 Mbps
    sni: h2.example.com
`
    const config = parseYaml(input)
    const proxy = config.proxies![0]
    expect(proxy.type).toBe('hysteria2')
    expect(proxy.password).toBe('mypass')
    expect(proxy.up).toBe('50 Mbps')
    expect(proxy.down).toBe('100 Mbps')
  })

  it('should not leak internal _comments field in stringifyYaml output', () => {
    const input = `# Top-level comment
mode: rule
# Another comment
proxies: []
rules:
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const yaml = stringifyYaml(config)
    expect(yaml).not.toContain('_comments')
    expect(yaml).not.toContain('_unknownFields')
    expect(yaml).not.toContain('_validationErrors')
  })
})
