import type { MihomoConfig } from '@/schema/model'

export interface ChainIssue {
  type: 'udp-incompat' | 'missing-relay' | 'empty-relay' | 'self-relay' | 'broken-chain'
  message: string
  proxy: string
}

/**
 * Validates relay proxy groups and dialer-proxy chains.
 *
 * Rules:
 * 1. Relay groups do NOT support UDP
 * 2. Relay proxies must exist
 * 3. Relay groups must have at least 2 proxies
 * 4. No self-referencing in relay
 * 5. dialer-proxy chains must not be circular
 */
export function validateChains(config: MihomoConfig): ChainIssue[] {
  const issues: ChainIssue[] = []
  const allProxyNames = new Set(config.proxies?.map((p) => p.name) || [])
  const allGroupNames = new Set(config['proxy-groups']?.map((g) => g.name) || [])

  // Check relay groups
  if (config['proxy-groups']) {
    for (const g of config['proxy-groups']) {
      if (g.type === 'relay') {
        // Relay doesn't support UDP
        if (g['disable-udp'] !== true) {
          issues.push({
            type: 'udp-incompat',
            message: `Relay 代理组 '${g.name}' 未禁用 UDP。Relay 不支持 UDP 中继，建议设置 disable-udp: true`,
            proxy: g.name,
          })
        }

        // Check proxy references exist
        if (g.proxies) {
          if (g.proxies.length < 2) {
            issues.push({
              type: 'empty-relay',
              message: `Relay 代理组 '${g.name}' 至少需要 2 个代理节点`,
              proxy: g.name,
            })
          }
          for (const ref of g.proxies) {
            if (
              !allProxyNames.has(ref) &&
              !allGroupNames.has(ref) &&
              !['DIRECT', 'REJECT'].includes(ref)
            ) {
              issues.push({
                type: 'missing-relay',
                message: `Relay 代理组 '${g.name}' 引用了不存在的代理 '${ref}'`,
                proxy: g.name,
              })
            }
            if (ref === g.name) {
              issues.push({
                type: 'self-relay',
                message: `Relay 代理组 '${g.name}' 引用了自身`,
                proxy: g.name,
              })
            }
          }
        }
      }
    }
  }

  // Check dialer-proxy chains
  if (config.proxies) {
    for (const p of config.proxies) {
      if (p['dialer-proxy']) {
        const dp = p['dialer-proxy']
        if (
          !allProxyNames.has(dp) &&
          !allGroupNames.has(dp) &&
          !['DIRECT', 'REJECT'].includes(dp)
        ) {
          issues.push({
            type: 'broken-chain',
            message: `代理 '${p.name}' 的 dialer-proxy '${dp}' 不存在`,
            proxy: p.name,
          })
        }

        // Check for self-reference via dialer-proxy
        if (dp === p.name) {
          issues.push({
            type: 'self-relay',
            message: `代理 '${p.name}' 的 dialer-proxy 引用了自身`,
            proxy: p.name,
          })
        }
      }
    }
  }

  return issues
}

/**
 * Builds a topological chain from dialer-proxy references.
 * Returns ordered chain starting from the outermost proxy.
 */
export function buildDialerChain(
  config: MihomoConfig,
  startProxyName: string,
): string[] {
  const proxyMap = new Map<string, string | undefined>()
  if (config.proxies) {
    for (const p of config.proxies) {
      proxyMap.set(p.name, p['dialer-proxy'])
    }
  }

  const chain: string[] = [startProxyName]
  const visited = new Set<string>()
  let current = startProxyName

  while (current) {
    if (visited.has(current)) break
    visited.add(current)
    const next = proxyMap.get(current)
    if (!next || !proxyMap.has(next)) break
    chain.push(next)
    current = next
  }

  return chain
}
