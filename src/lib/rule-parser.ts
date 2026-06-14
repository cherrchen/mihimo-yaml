const EXTRA_PARAMS = new Set([
  'no-resolve',
  'src',
  'dst',
  'uid',
  'uid-range',
  'process',
])

const RULE_TARGET_INDEX: Record<string, number> = {
  'MATCH': 1,
  'RULE-SET': 2,
  'SUB-RULE': 2,
}

export interface RuleParts {
  type: string
  payload: string
  target: string
  extra: string
}

export function splitRuleParts(rule: string): string[] {
  const parts: string[] = []
  let current = ''
  let depth = 0
  let quote: '"' | "'" | null = null

  for (let i = 0; i < rule.length; i++) {
    const char = rule[i]
    const prev = rule[i - 1]

    if ((char === '"' || char === "'") && prev !== '\\') {
      quote = quote === char ? null : (quote ?? char)
      current += char
      continue
    }

    if (!quote) {
      if (char === '(') {
        depth++
      } else if (char === ')' && depth > 0) {
        depth--
      } else if (char === ',' && depth === 0) {
        parts.push(current.trim())
        current = ''
        continue
      }
    }

    current += char
  }

  parts.push(current.trim())
  return parts
}

export function parseRule(rule: string): RuleParts {
  const parts = splitRuleParts(rule)
  const type = parts[0] || ''

  if (type === 'MATCH') {
    return { type, payload: '', target: parts[1] || '', extra: '' }
  }

  const targetIdx = RULE_TARGET_INDEX[type] ?? 2
  const rawTarget = parts[targetIdx] || ''
  const target = EXTRA_PARAMS.has(rawTarget) ? '' : rawTarget

  const payload = parts[1] || ''
  const extraParts: string[] = []
  for (let i = target ? targetIdx + 1 : targetIdx; i < parts.length; i++) {
    if (parts[i]) extraParts.push(parts[i])
  }

  return {
    type,
    payload,
    target,
    extra: extraParts.join(','),
  }
}

export function buildRuleString(type: string, payload: string, target: string, extra: string): string {
  if (type === 'MATCH') return `MATCH,${target}`
  const parts = [type, payload, target]
  if (extra) parts.push(extra)
  return parts.join(',')
}

export function getRuleProviderName(rule: string): string | null {
  const parsed = parseRule(rule)
  return parsed.type === 'RULE-SET' && parsed.payload ? parsed.payload : null
}

export function getSubRuleName(rule: string): string | null {
  const parsed = parseRule(rule)
  return parsed.type === 'SUB-RULE' && parsed.target ? parsed.target : null
}

export function getRulePolicyTarget(rule: string): string | null {
  const parsed = parseRule(rule)
  if (parsed.type === 'SUB-RULE') return null
  return parsed.target || null
}

export const getRuleTarget = getRulePolicyTarget
