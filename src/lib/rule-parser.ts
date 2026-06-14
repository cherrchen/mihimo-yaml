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
  'RULE-SET': 3,
  'SUB-RULE': 3,
}

export interface RuleParts {
  type: string
  payload: string
  target: string
  extra: string
}

export function parseRule(rule: string): RuleParts {
  const parts = rule.split(',').map((s) => s.trim())
  const type = parts[0] || ''

  if (type === 'MATCH') {
    return { type, payload: '', target: parts[1] || '', extra: '' }
  }

  const targetIdx = RULE_TARGET_INDEX[type] ?? 2
  let target = parts[targetIdx] || ''

  if (EXTRA_PARAMS.has(target)) {
    target = parts[targetIdx - 1] || ''
  }

  const payload = parts[1] || ''
  const extraParts: string[] = []
  for (let i = (targetIdx + 1); i < parts.length; i++) {
    if (parts[i]) extraParts.push(parts[i])
  }

  return {
    type,
    payload,
    target: EXTRA_PARAMS.has(target) ? '' : target,
    extra: extraParts.join(','),
  }
}

export function buildRuleString(type: string, payload: string, target: string, extra: string): string {
  if (type === 'MATCH') return `MATCH,${target}`
  const parts = [type, payload, target]
  if (extra) parts.push(extra)
  return parts.join(',')
}

export function getRuleTarget(rule: string): string | null {
  return parseRule(rule).target || null
}
