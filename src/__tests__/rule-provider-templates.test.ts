import { describe, expect, it } from 'vitest'
import {
  getTemplatePath,
  METACUBEX_TEMPLATES,
} from '@/components/editors/rule-providers/templates'
import { RULE_PROVIDER_FORMATS } from '@/lib/constants'
import { CN_DIRECT_TEMPLATE } from '@/schema/defaults'

describe('Rule provider templates', () => {
  it('should only use supported provider formats', () => {
    const supportedFormats = new Set<string>(RULE_PROVIDER_FORMATS)

    expect(METACUBEX_TEMPLATES.every((tpl) => supportedFormats.has(tpl.format))).toBe(true)
  })

  it('should use text format for ASN .list templates and preserve .list paths', () => {
    const asnTemplates = METACUBEX_TEMPLATES.filter((tpl) => tpl.category === 'asn')

    expect(asnTemplates.length).toBeGreaterThan(0)
    expect(asnTemplates.every((tpl) => tpl.format === 'text')).toBe(true)
    expect(asnTemplates.every((tpl) => tpl.url.endsWith('.list'))).toBe(true)
    expect(asnTemplates.every((tpl) => getTemplatePath(tpl).endsWith('.list'))).toBe(true)
  })

  it('should use mrs for domain and ipcidr templates', () => {
    const mrsTemplates = METACUBEX_TEMPLATES.filter((tpl) => tpl.behavior !== 'classical' && tpl.category !== 'asn')

    expect(mrsTemplates.length).toBeGreaterThan(0)
    expect(mrsTemplates.every((tpl) => tpl.format === 'mrs')).toBe(true)
    expect(mrsTemplates.every((tpl) => tpl.url.endsWith('.mrs'))).toBe(true)
    expect(mrsTemplates.every((tpl) => getTemplatePath(tpl).endsWith('.mrs'))).toBe(true)
  })

  it('should retain yaml for classical templates', () => {
    const classicalTemplates = METACUBEX_TEMPLATES.filter((tpl) => tpl.behavior === 'classical')

    expect(classicalTemplates.length).toBeGreaterThan(0)
    expect(classicalTemplates.every((tpl) => tpl.format === 'yaml')).toBe(true)
    expect(classicalTemplates.every((tpl) => tpl.url.endsWith('.yaml'))).toBe(true)
  })

  it('should use mrs in the built-in China direct template', () => {
    const provider = CN_DIRECT_TEMPLATE['rule-providers']?.cn

    expect(provider?.format).toBe('mrs')
    expect(provider?.url).toMatch(/\.mrs$/)
    expect(provider?.path).toMatch(/\.mrs$/)
  })
})
