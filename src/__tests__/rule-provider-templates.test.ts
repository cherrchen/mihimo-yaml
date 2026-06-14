import { describe, expect, it } from 'vitest'
import {
  getTemplatePath,
  METACUBEX_TEMPLATES,
} from '@/components/editors/rule-providers/templates'
import { RULE_PROVIDER_FORMATS } from '@/lib/constants'

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
})
