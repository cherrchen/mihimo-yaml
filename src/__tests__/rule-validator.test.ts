import { describe, it, expect } from 'vitest'
import { analyzeRules } from '@/engine/rule-validator'
import { parseYaml } from '@/schema/yaml'

describe('Rule validator', () => {
  it('should detect unreachable rules after MATCH', () => {
    const input = `rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - MATCH,DIRECT
  - DOMAIN-SUFFIX,example.com,PROXY
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues.some((i) => i.type === 'unreachable')).toBe(true)
  })

  it('should warn about missing MATCH rule', () => {
    const input = `rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,example.com,DIRECT
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues.some((i) => i.type === 'missing-match')).toBe(true)
  })

  it('should detect duplicate rules', () => {
    const input = `rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,example.com,DIRECT
  - DOMAIN-SUFFIX,google.com,PROXY
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues.some((i) => i.type === 'duplicate')).toBe(true)
  })

  it('should pass for valid rule sets', () => {
    const input = `rules:
  - DOMAIN-SUFFIX,google.com,PROXY
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - RULE-SET,cn,DIRECT
  - MATCH,PROXY
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('should handle empty rules', () => {
    const input = `rules: []
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues).toHaveLength(0)
  })
})
