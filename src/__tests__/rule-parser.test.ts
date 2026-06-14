import { describe, it, expect } from 'vitest'
import {
  getRulePolicyTarget,
  getRuleProviderName,
  getSubRuleName,
  parseRule,
  splitRuleParts,
} from '@/lib/rule-parser'

describe('Rule parser', () => {
  it('should parse MATCH target', () => {
    const parsed = parseRule('MATCH,DIRECT')

    expect(parsed).toEqual({
      type: 'MATCH',
      payload: '',
      target: 'DIRECT',
      extra: '',
    })
    expect(getRulePolicyTarget('MATCH,DIRECT')).toBe('DIRECT')
  })

  it('should parse RULE-SET provider and policy target', () => {
    const parsed = parseRule('RULE-SET,cn,DIRECT')

    expect(parsed.payload).toBe('cn')
    expect(parsed.target).toBe('DIRECT')
    expect(getRuleProviderName('RULE-SET,cn,DIRECT')).toBe('cn')
    expect(getRulePolicyTarget('RULE-SET,cn,DIRECT')).toBe('DIRECT')
  })

  it('should keep SUB-RULE condition intact and expose sub-rule name', () => {
    const parsed = parseRule('SUB-RULE,(NETWORK,tcp),sub-rule')

    expect(parsed.payload).toBe('(NETWORK,tcp)')
    expect(parsed.target).toBe('sub-rule')
    expect(getSubRuleName('SUB-RULE,(NETWORK,tcp),sub-rule')).toBe('sub-rule')
    expect(getRulePolicyTarget('SUB-RULE,(NETWORK,tcp),sub-rule')).toBeNull()
  })

  it('should keep no-resolve as an extra parameter', () => {
    const parsed = parseRule('IP-CIDR,10.0.0.0/8,DIRECT,no-resolve')

    expect(parsed.payload).toBe('10.0.0.0/8')
    expect(parsed.target).toBe('DIRECT')
    expect(parsed.extra).toBe('no-resolve')
  })

  it('should split only on top-level commas', () => {
    expect(splitRuleParts('AND,((DOMAIN,baidu.com),(NETWORK,UDP)),DIRECT')).toEqual([
      'AND',
      '((DOMAIN,baidu.com),(NETWORK,UDP))',
      'DIRECT',
    ])
  })
})
