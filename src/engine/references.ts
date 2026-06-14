import type { MihomoConfig } from '@/schema/model'
import { DIRECT, REJECT, REJECT_DROP, COMPATIBLE, PASS } from '@/lib/constants'
import { getRulePolicyTarget, getRuleProviderName, getSubRuleName } from '@/lib/rule-parser'

export const BUILTIN_STRATEGIES = [DIRECT, REJECT, REJECT_DROP, COMPATIBLE, PASS]

export interface ReferenceReport {
  allProxyNames: Set<string>
  allGroupNames: Set<string>
  allProviderNames: Set<string>
  allRuleProviderNames: Set<string>
  allListenerNames: Set<string>
  danglingProxyRefs: string[]
  danglingGroupRefs: string[]
  danglingProviderRefs: string[]
  danglingRuleProviderRefs: string[]
  danglingRuleRefs: string[]
}

export function collectReferences(config: MihomoConfig): ReferenceReport {
  const allProxyNames = new Set<string>()
  const allGroupNames = new Set<string>()
  const allProviderNames = new Set<string>()
  const allRuleProviderNames = new Set<string>()
  const allListenerNames = new Set<string>()

  // Collect proxy names
  if (config.proxies) {
    for (const p of config.proxies) {
      allProxyNames.add(p.name)
    }
  }

  // Collect proxy provider names
  if (config['proxy-providers']) {
    for (const name of Object.keys(config['proxy-providers'])) {
      allProviderNames.add(name)
    }
  }

  // Collect proxy group names
  if (config['proxy-groups']) {
    for (const g of config['proxy-groups']) {
      allGroupNames.add(g.name)
    }
  }

  // Collect rule provider names
  if (config['rule-providers']) {
    for (const name of Object.keys(config['rule-providers'])) {
      allRuleProviderNames.add(name)
    }
  }

  // Collect listener names
  if (config.listeners) {
    for (const l of config.listeners) {
      allListenerNames.add(l.name)
    }
  }

  // Check dangling references
  const danglingProxyRefs: string[] = []
  const danglingGroupRefs: string[] = []
  const danglingProviderRefs: string[] = []
  const danglingRuleProviderRefs: string[] = []
  const danglingRuleRefs: string[] = []

  // Check proxy groups referencing proxies
  if (config['proxy-groups']) {
    for (const g of config['proxy-groups']) {
      if (g.proxies) {
        for (const ref of g.proxies) {
          if (
            !BUILTIN_STRATEGIES.includes(ref) &&
            !allProxyNames.has(ref) &&
            !allGroupNames.has(ref)
          ) {
            danglingProxyRefs.push(`proxy-group '${g.name}' 引用了不存在的代理/组 '${ref}'`)
          }
        }
      }
      if (g.use) {
        for (const ref of g.use) {
          if (!allProviderNames.has(ref)) {
            danglingProviderRefs.push(`proxy-group '${g.name}' 引用了不存在的 provider '${ref}'`)
          }
        }
      }
    }
  }

  // Check dialer-proxy references in proxies
  if (config.proxies) {
    for (const p of config.proxies) {
      if (p['dialer-proxy'] && !BUILTIN_STRATEGIES.includes(p['dialer-proxy'])) {
        if (!allProxyNames.has(p['dialer-proxy']) && !allGroupNames.has(p['dialer-proxy'])) {
          danglingProxyRefs.push(`proxy '${p.name}' 的 dialer-proxy 引用了不存在的代理/组 '${p['dialer-proxy']}'`)
        }
      }
    }
  }

  // Check rules referencing providers and proxy groups
  if (config.rules) {
    for (const rule of config.rules) {
      const providerName = getRuleProviderName(rule)
      if (providerName) {
        if (providerName && !allRuleProviderNames.has(providerName)) {
          danglingRuleProviderRefs.push(`规则引用了不存在的 rule-provider '${providerName}': ${rule}`)
        }
      }

      const subRuleName = getSubRuleName(rule)
      if (subRuleName) {
        if (!config['sub-rules'] || !(subRuleName in config['sub-rules'])) {
          danglingRuleRefs.push(`规则引用了不存在的 sub-rule '${subRuleName}': ${rule}`)
        }
      }

      // Check rule targets
      const target = getRulePolicyTarget(rule)
      if (
        target &&
        !BUILTIN_STRATEGIES.includes(target) &&
        !allProxyNames.has(target) &&
        !allGroupNames.has(target)
      ) {
        danglingGroupRefs.push(`规则目标 '${target}' 不存在: ${rule}`)
      }
    }
  }

  return {
    allProxyNames,
    allGroupNames,
    allProviderNames,
    allRuleProviderNames,
    allListenerNames,
    danglingProxyRefs,
    danglingGroupRefs,
    danglingProviderRefs,
    danglingRuleProviderRefs,
    danglingRuleRefs,
  }
}
