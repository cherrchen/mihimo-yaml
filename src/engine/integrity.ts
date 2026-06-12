import type { MihomoConfig } from '@/schema/model'
import { collectReferences } from './references'
import { detectProxyGroupCycles, detectSelfReferences } from './cycle-detector'
import { validateChains } from './chain-validator'
import { analyzeRules } from './rule-validator'

export interface IntegrityIssue {
  type: string
  message: string
  severity: 'error' | 'warning'
  path?: string
}

export interface IntegrityReport {
  valid: boolean
  issues: IntegrityIssue[]
  references: ReturnType<typeof collectReferences>
  cycles: ReturnType<typeof detectProxyGroupCycles>
  chains: ReturnType<typeof validateChains>
  rules: ReturnType<typeof analyzeRules>
}

/**
 * Runs all integrity checks on a mihomo config.
 * Returns a unified report.
 */
export function runIntegrityCheck(config: MihomoConfig): IntegrityReport {
  const issues: IntegrityIssue[] = []

  // Reference checks
  const refs = collectReferences(config)
  for (const msg of refs.danglingProxyRefs) {
    issues.push({ type: 'dangling-ref', message: msg, severity: 'error', path: 'proxies' })
  }
  for (const msg of refs.danglingGroupRefs) {
    issues.push({ type: 'dangling-ref', message: msg, severity: 'error', path: 'proxy-groups' })
  }
  for (const msg of refs.danglingProviderRefs) {
    issues.push({ type: 'dangling-ref', message: msg, severity: 'error', path: 'proxy-providers' })
  }
  for (const msg of refs.danglingRuleProviderRefs) {
    issues.push({ type: 'dangling-ref', message: msg, severity: 'error', path: 'rule-providers' })
  }
  for (const msg of refs.danglingRuleRefs) {
    issues.push({ type: 'dangling-ref', message: msg, severity: 'error', path: 'rules' })
  }

  // Cycle checks
  const cycles = detectProxyGroupCycles(config)
  if (cycles.hasCycle) {
    for (const cycle of cycles.cycles) {
      issues.push({
        type: 'cycle',
        message: `代理组循环引用: ${cycle.join(' -> ')}`,
        severity: 'error',
        path: 'proxy-groups',
      })
    }
  }
  const selfRefs = detectSelfReferences(config)
  for (const msg of selfRefs) {
    issues.push({ type: 'self-ref', message: msg, severity: 'error', path: 'proxy-groups' })
  }

  // Chain checks
  const chains = validateChains(config)
  for (const ci of chains) {
    issues.push({
      type: ci.type,
      message: ci.message,
      severity: ci.type === 'udp-incompat' ? 'warning' : 'error',
      path: ci.proxy,
    })
  }

  // Rule checks
  const ruleIssues = analyzeRules(config)
  for (const ri of ruleIssues) {
    issues.push({
      type: ri.type,
      message: ri.message,
      severity: ri.type === 'missing-match' ? 'warning' : 'error',
      path: 'rules',
    })
  }

  // Proxy name uniqueness
  if (config.proxies) {
    const names = new Set<string>()
    for (const p of config.proxies) {
      if (names.has(p.name)) {
        issues.push({
          type: 'duplicate-name',
          message: `代理名称重复: '${p.name}'`,
          severity: 'error',
          path: 'proxies',
        })
      }
      names.add(p.name)
    }
  }

  // Proxy group name uniqueness
  if (config['proxy-groups']) {
    const names = new Set<string>()
    for (const g of config['proxy-groups']) {
      if (names.has(g.name)) {
        issues.push({
          type: 'duplicate-name',
          message: `代理组名称重复: '${g.name}'`,
          severity: 'error',
          path: 'proxy-groups',
        })
      }
      names.add(g.name)
    }
  }

  const errors = issues.filter((i) => i.severity === 'error')

  return {
    valid: errors.length === 0,
    issues,
    references: refs,
    cycles,
    chains,
    rules: ruleIssues,
  }
}
