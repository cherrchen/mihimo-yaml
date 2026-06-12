import type { MihomoConfig } from '@/schema/model'

export interface CycleReport {
  hasCycle: boolean
  cycles: string[][]
  path: string
}

/**
 * Detects cycles in proxy-group dependency graph.
 * A cycle exists when group A references group B, which references group A.
 * Self-references are also cycles.
 */
export function detectProxyGroupCycles(config: MihomoConfig): CycleReport {
  const cycles: string[][] = []

  if (!config['proxy-groups'] || config['proxy-groups'].length === 0) {
    return { hasCycle: false, cycles: [], path: '' }
  }

  // Build all group names first
  const allGroups = new Set<string>()
  for (const g of config['proxy-groups']) {
    allGroups.add(g.name)
  }

  // Build adjacency: group name -> groups it references
  const adjacency = new Map<string, Set<string>>()
  for (const g of config['proxy-groups']) {
    adjacency.set(g.name, new Set())
    if (g.proxies) {
      for (const ref of g.proxies) {
        if (allGroups.has(ref)) {
          adjacency.get(g.name)!.add(ref)
        }
      }
    }
  }

  // DFS for cycle detection
  const visited = new Set<string>()
  const stack = new Set<string>()

  function dfs(node: string, path: string[]): boolean {
    visited.add(node)
    stack.add(node)
    path.push(node)

    const neighbors = adjacency.get(node)
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (stack.has(neighbor)) {
          // Found cycle
          const cycleStart = path.indexOf(neighbor)
          cycles.push([...path.slice(cycleStart), neighbor])
        } else if (!visited.has(neighbor)) {
          dfs(neighbor, [...path])
        }
      }
    }

    stack.delete(node)
    return false
  }

  for (const group of allGroups) {
    if (!visited.has(group)) {
      dfs(group, [])
    }
  }

  return {
    hasCycle: cycles.length > 0,
    cycles,
    path: 'proxy-groups',
  }
}

/**
 * Checks for self-referencing proxy groups.
 */
export function detectSelfReferences(config: MihomoConfig): string[] {
  const selfRefs: string[] = []

  if (config['proxy-groups']) {
    for (const g of config['proxy-groups']) {
      if (g.proxies && g.proxies.includes(g.name)) {
        selfRefs.push(`代理组 '${g.name}' 引用了自身`)
      }
    }
  }

  return selfRefs
}
