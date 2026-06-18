import type { Edge, Node } from '@xyflow/react'
import { BUILTIN_STRATEGIES } from '@/lib/constants'
import type { MihomoConfig } from '@/schema/model'

const NODE_STYLE = {
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '11px',
  fontWeight: 500,
  width: 180,
}

export function buildChainTopology(config: MihomoConfig): { initialNodes: Node[]; initialEdges: Edge[] } {
  const proxies = config.proxies || []
  const groups = config['proxy-groups'] || []
  const providers = Object.entries(config['proxy-providers'] || {})
  const proxyMap = new Map(proxies.map((proxy) => [proxy.name, proxy]))
  const groupMap = new Map(groups.map((group) => [group.name, group]))
  const builtins = new Set<string>(BUILTIN_STRATEGIES)
  const relayMembers = new Set(
    groups
      .filter((group) => group.type === 'relay')
      .flatMap((group) => group.proxies || []),
  )
  const includedProxies = new Set<string>()
  const includedGroups = new Set<string>()
  const includedProviders = new Set<string>()
  const includedBuiltins = new Set<string>()

  const includeReferenceChain = (startName: string) => {
    const visited = new Set<string>()
    let currentName: string | undefined = startName

    while (currentName && !visited.has(currentName)) {
      visited.add(currentName)

      const proxy = proxyMap.get(currentName)
      if (proxy) {
        includedProxies.add(currentName)
        currentName = proxy['dialer-proxy']
        continue
      }

      if (groupMap.has(currentName)) {
        includedGroups.add(currentName)
      } else if (builtins.has(currentName)) {
        includedBuiltins.add(currentName)
      }
      break
    }
  }

  proxies.forEach((proxy) => {
    if (proxy['dialer-proxy']) includeReferenceChain(proxy.name)
  })
  providers.forEach(([name, provider]) => {
    const dialerProxy = provider.override?.['dialer-proxy']
    if (!dialerProxy) return
    includedProviders.add(name)
    includeReferenceChain(dialerProxy)
  })
  relayMembers.forEach(includeReferenceChain)

  const nodeDefinitions = [
    ...proxies
      .filter((proxy) => includedProxies.has(proxy.name))
      .map((proxy) => ({
        id: proxy.name,
        label: `[proxy:${proxy.type}] ${proxy.name}`,
        style: {
          ...NODE_STYLE,
          background: relayMembers.has(proxy.name) ? '#fef3c7' : '#f0f9ff',
          border: '1px solid #94a3b8',
        },
      })),
    ...providers
      .filter(([name]) => includedProviders.has(name))
      .map(([name]) => ({
        id: name,
        label: `[provider] ${name}`,
        style: {
          ...NODE_STYLE,
          background: '#f5f3ff',
          border: '1px solid #8b5cf6',
        },
      })),
    ...groups
      .filter((group) => includedGroups.has(group.name))
      .map((group) => ({
        id: group.name,
        label: `[group:${group.type}] ${group.name}`,
        style: {
          ...NODE_STYLE,
          background: '#f0fdf4',
          border: '1px solid #22c55e',
          fontWeight: 600,
        },
      })),
    ...Array.from(includedBuiltins).map((name) => ({
      id: name,
      label: `[built-in] ${name}`,
      style: {
        ...NODE_STYLE,
        background: '#f8fafc',
        border: '1px solid #94a3b8',
      },
    })),
  ]

  const initialNodes: Node[] = nodeDefinitions.map((node, index) => ({
    id: node.id,
    type: 'default',
    data: { label: node.label },
    position: { x: 50 + (index % 6) * 220, y: 50 + Math.floor(index / 6) * 100 },
    style: node.style,
  }))
  const nodeIds = new Set(initialNodes.map((node) => node.id))
  const initialEdges: Edge[] = []

  proxies.forEach((proxy) => {
    const dialerProxy = proxy['dialer-proxy']
    if (!dialerProxy || !nodeIds.has(proxy.name) || !nodeIds.has(dialerProxy)) return
    initialEdges.push({
      id: `dialer-${proxy.name}-${dialerProxy}`,
      source: proxy.name,
      target: dialerProxy,
      animated: true,
      label: 'dialer',
      style: { stroke: '#6366f1', strokeWidth: 2 },
    })
  })

  providers.forEach(([name, provider]) => {
    const dialerProxy = provider.override?.['dialer-proxy']
    if (!dialerProxy || !nodeIds.has(name) || !nodeIds.has(dialerProxy)) return
    initialEdges.push({
      id: `provider-dialer-${name}-${dialerProxy}`,
      source: name,
      target: dialerProxy,
      animated: true,
      label: 'dialer override',
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    })
  })

  groups.forEach((group) => {
    if (group.type !== 'relay' || !group.proxies) return
    for (let index = 0; index < group.proxies.length - 1; index++) {
      const source = group.proxies[index]
      const target = group.proxies[index + 1]
      if (!nodeIds.has(source) || !nodeIds.has(target)) continue
      initialEdges.push({
        id: `relay-${group.name}-${index}`,
        source,
        target,
        animated: true,
        label: `relay:${group.name}`,
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
      })
    }
  })

  return { initialNodes, initialEdges }
}
