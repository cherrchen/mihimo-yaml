import type { MihomoConfig } from '@/schema/model'

export interface RuleIssue {
  type: 'conflict' | 'unreachable' | 'duplicate' | 'invalid-format' | 'missing-match'
  message: string
  severity: 'error' | 'warning'
  index?: number
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

    // Check rule format
    const parts = rule.split(',').map((p) => p.trim())
    if (parts.length < 2 && parts[0] !== 'MATCH') {
      issues.push({
        type: 'invalid-format',
        severity: 'error',
        message: `第 ${i + 1} 条规则格式无效: ${rule}`,
        index: i,
      })
      continue
    }

    // Check MATCH positioning
    if (parts[0] === 'MATCH') {
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
