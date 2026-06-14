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

  it('should detect ordinary rules without target', () => {
    const input = `rules:
  - DOMAIN-SUFFIX,google.com
  - MATCH,DIRECT
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues.some((i) => i.type === 'invalid-format' && i.message.includes('缺少目标'))).toBe(true)
  })

  it('should detect MATCH rules without target', () => {
    const input = `rules:
  - MATCH
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues.some((i) => i.type === 'invalid-format' && i.message.includes('MATCH'))).toBe(true)
  })

  it('should detect incomplete SUB-RULE rules', () => {
    const missingCondition = parseYaml(`rules:
  - SUB-RULE,,sub-rule
  - MATCH,DIRECT
`)
    const missingName = parseYaml(`rules:
  - SUB-RULE,(NETWORK,tcp)
  - MATCH,DIRECT
`)

    expect(analyzeRules(missingCondition).some((i) => i.message.includes('匹配条件'))).toBe(true)
    expect(analyzeRules(missingName).some((i) => i.message.includes('sub-rule 名称'))).toBe(true)
  })

  it('should handle empty rules', () => {
    const input = `rules: []
`
    const config = parseYaml(input)
    const issues = analyzeRules(config)

    expect(issues).toHaveLength(0)
  })
})
