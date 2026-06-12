import type { DnsConfig } from '@/schema/model'

export type DnsStrategyAction = 'auto-first' | 'manual-choose' | 'block-export'

export interface DnsServerChoice {
  domain: string
  servers: string[]
  selected: string
}

/**
 * Given nameserver-policy with possible multi-server entries,
 * resolve to single-server per policy.
 */
export function resolveSingleServerDns(
  policy: Record<string, string | string[]>,
  strategy: DnsStrategyAction,
): {
  resolved: Record<string, string>
  choices: DnsServerChoice[]
  blocked: string[]
} {
  const resolved: Record<string, string> = {}
  const choices: DnsServerChoice[] = []
  const blocked: string[] = []

  for (const [domain, servers] of Object.entries(policy)) {
    const serverList = Array.isArray(servers) ? servers : [servers]

    if (serverList.length === 0) {
      blocked.push(domain)
      continue
    }

    if (serverList.length === 1) {
      resolved[domain] = serverList[0]
      continue
    }

    // Multiple servers
    if (strategy === 'block-export') {
      blocked.push(domain)
      continue
    }

    if (strategy === 'auto-first') {
      resolved[domain] = serverList[0]
      choices.push({
        domain,
        servers: serverList,
        selected: serverList[0],
      })
    } else {
      // manual-choose: default to first but mark for manual resolution
      resolved[domain] = serverList[0]
      choices.push({
        domain,
        servers: serverList,
        selected: serverList[0],
      })
    }
  }

  return { resolved, choices, blocked }
}

/**
 * Applies user's manual choices to DNS policy.
 */
export function applyManualDnsChoices(
  policy: Record<string, string | string[]>,
  manualChoices: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [domain, servers] of Object.entries(policy)) {
    if (manualChoices[domain]) {
      result[domain] = manualChoices[domain]
      continue
    }
    const serverList = Array.isArray(servers) ? servers : [servers]
    result[domain] = serverList[0] || ''
  }

  return result
}

/**
 * Check if a DNS config needs single-server resolution.
 */
export function needsDnsResolution(dns?: DnsConfig): boolean {
  if (!dns?.['nameserver-policy']) return false
  return Object.values(dns['nameserver-policy']).some(
    (v) => Array.isArray(v) && v.length > 1,
  )
}

/**
 * Get multi-server DNS policy entries.
 */
export function getMultiServerEntries(dns?: DnsConfig): DnsServerChoice[] {
  if (!dns?.['nameserver-policy']) return []

  const entries: DnsServerChoice[] = []
  for (const [domain, servers] of Object.entries(dns['nameserver-policy'])) {
    const serverList = Array.isArray(servers) ? servers : [servers]
    if (serverList.length > 1) {
      entries.push({
        domain,
        servers: serverList,
        selected: serverList[0],
      })
    }
  }
  return entries
}
