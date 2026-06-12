import { describe, it, expect } from 'vitest'
import { resolveSingleServerDns, needsDnsResolution, getMultiServerEntries } from '@/compatibility/dns-strategy'

describe('DNS single-server strategy', () => {
  const samplePolicy = {
    'geosite:cn': ['223.5.5.5', '119.29.29.29'],
    'geosite:google': '8.8.8.8',
    'domain:example.com': ['1.1.1.1', '8.8.4.4', '9.9.9.9'],
  }

  it('should auto-select first server', () => {
    const result = resolveSingleServerDns(samplePolicy, 'auto-first')

    expect(result.resolved['geosite:cn']).toBe('223.5.5.5')
    expect(result.resolved['geosite:google']).toBe('8.8.8.8')
    expect(result.resolved['domain:example.com']).toBe('1.1.1.1')
    expect(result.choices).toHaveLength(2)
    expect(result.blocked).toHaveLength(0)
  })

  it('should block multi-server policies with block-export strategy', () => {
    const result = resolveSingleServerDns(samplePolicy, 'block-export')

    expect(result.blocked).toHaveLength(2)
    expect(result.blocked).toContain('geosite:cn')
    expect(result.blocked).toContain('domain:example.com')
    expect(result.resolved['geosite:google']).toBe('8.8.8.8')
  })

  it('should detect need for resolution', () => {
    const dnsWithMulti = {
      'nameserver-policy': {
        'geosite:cn': ['223.5.5.5', '119.29.29.29'],
      },
    }
    const dnsWithout = {
      'nameserver-policy': {
        'geosite:cn': '223.5.5.5',
      },
    }

    expect(needsDnsResolution(dnsWithMulti as never)).toBe(true)
    expect(needsDnsResolution(dnsWithout as never)).toBe(false)
  })

  it('should list multi-server entries', () => {
    const dns = {
      'nameserver-policy': samplePolicy,
    }
    const entries = getMultiServerEntries(dns as never)

    expect(entries).toHaveLength(2)
    expect(entries[0].domain).toBe('geosite:cn')
    expect(entries[0].servers).toEqual(['223.5.5.5', '119.29.29.29'])
  })
})
