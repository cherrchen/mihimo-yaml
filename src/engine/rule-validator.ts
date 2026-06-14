import type { MihomoConfig } from '@/schema/model'
import { parseRule } from '@/lib/rule-parser'

export interface RuleIssue {
  type: 'conflict' | 'unreachable' | 'duplicate' | 'invalid-format' | 'missing-match'
  message: string
  severity: 'error' | 'warning'
  index?: number
}

function getFormatError(rule: string, index: number): string | null {
  const parsed = parseRule(rule)
  const label = `第 ${index + 1} 条规则格式无效`

  if (!parsed.type) return `${label}: ${rule}`

  if (parsed.type === 'MATCH') {
    return parsed.target ? null : `${label}: MATCH 规则缺少目标`
  }

  if (parsed.type === 'SUB-RULE') {
    if (!parsed.payload) return `${label}: SUB-RULE 缺少匹配条件`
    if (!parsed.target) return `${label}: SUB-RULE 缺少 sub-rule 名称`
    return null
  }

  if (!parsed.payload) return `${label}: 缺少匹配值`
  if (!parsed.target) return `${label}: 缺少目标`
  return null
}

/**
 * Analyzes rules for common issues:
 * 1. Unreachable rules after MATCH
 * 2. Duplicate rules
 * 3. Invalid rule format
 * 4. Missing MATCH rule at end
 */
export function analyzeRules(config: MihomoConfig): RuleIssue[] {
  const issues: RuleIssue[] = []

  if (!config.rules || config.rules.length === 0) {
    return issues
  }

  const rules = config.rules
  let matchFound = false

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i].trim()

    // Check for empty rules
    if (!rule) {
      issues.push({
        type: 'invalid-format',
        severity: 'error',
        message: `第 ${i + 1} 条规则为空`,
        index: i,
      })
      continue
    }

    const parsed = parseRule(rule)
    const formatError = getFormatError(rule, i)
    if (formatError) {
      issues.push({
        type: 'invalid-format',
        severity: 'error',
        message: formatError,
        index: i,
      })
      continue
    }

    // Check MATCH positioning
    if (parsed.type === 'MATCH') {
      matchFound = true
    } else if (matchFound) {
      issues.push({
        type: 'unreachable',
        severity: 'warning',
        message: `第 ${i + 1} 条规则在 MATCH 之后，不可达: ${rule}`,
        index: i,
      })
    }

    // Check for duplicate rules
    const dups = rules.filter((r, j) => j !== i && r.trim() === rule)
    if (dups.length > 0) {
      issues.push({
        type: 'duplicate',
        severity: 'warning',
        message: `第 ${i + 1} 条规则重复: ${rule}`,
        index: i,
      })
    }
  }

  // Check missing MATCH
  if (!matchFound && rules.length > 0) {
    issues.push({
      type: 'missing-match',
      severity: 'warning',
      message: '规则列表末尾缺少 MATCH 规则',
    })
  }

  return issues
}
