import type { Edge, Node } from '@xyflow/react'
import type { MihomoConfig } from '@/schema/model'

export function buildChainTopology(config: MihomoConfig): { initialNodes: Node[]; initialEdges: Edge[] } {
  const proxies = config.proxies || []
  const groups = config['proxy-groups'] || []
  const nodes: Node[] = []
  const edges: Edge[] = []
  const proxyMap = new Map(proxies.map((proxy) => [proxy.name, proxy]))
  const relayMembers = new Set(
    groups
      .filter((group) => group.type === 'relay')
      .flatMap((group) => group.proxies || []),
  )
  const included = new Set<string>()

  const includeProxyAndUpstream = (startName: string) => {
    const visited = new Set<string>()
    let currentName: string | undefined = startName

    while (currentName && !visited.has(currentName)) {
      visited.add(currentName)
      const proxy = proxyMap.get(currentName)
      if (!proxy) break
      included.add(currentName)
      currentName = proxy['dialer-proxy']
    }
  }

  proxies.forEach((proxy) => {
    if (proxy['dialer-proxy']) includeProxyAndUpstream(proxy.name)
  })
  relayMembers.forEach(includeProxyAndUpstream)

  proxies.filter((proxy) => included.has(proxy.name)).forEach((p, i) => {
    const isRelay = relayMembers.has(p.name)
    nodes.push({
        id: p.name,
        type: 'default',
        data: { label: `${p.type}: ${p.name}` },
        position: { x: 50 + (i % 6) * 220, y: 50 + Math.floor(i / 6) * 100 },
        style: {
          background: isRelay ? '#fef3c7' : '#f0f9ff',
          border: '1px solid #94a3b8',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 500,
          width: 180,
      },
    })
  })

  proxies.forEach((p) => {
    const dialerProxy = p['dialer-proxy']
    if (dialerProxy && included.has(p.name) && included.has(dialerProxy)) {
      edges.push({
        id: `${p.name}-${dialerProxy}`,
        source: p.name,
        target: dialerProxy,
        animated: true,
        label: 'dialer',
        style: { stroke: '#6366f1', strokeWidth: 2 },
      })
    }
  })

  groups.forEach((g) => {
    if (g.type === 'relay' && g.proxies) {
      for (let i = 0; i < g.proxies.length - 1; i++) {
        if (!included.has(g.proxies[i]) || !included.has(g.proxies[i + 1])) continue
        edges.push({
          id: `relay-${g.name}-${i}`,
          source: g.proxies[i],
          target: g.proxies[i + 1],
          animated: true,
          label: `relay:${g.name}`,
          style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
        })
      }
    }
  })

  return { initialNodes: nodes, initialEdges: edges }
}
