import type { Edge, Node } from '@xyflow/react'
import type { MihomoConfig } from '@/schema/model'

export function buildChainTopology(config: MihomoConfig): { initialNodes: Node[]; initialEdges: Edge[] } {
  const proxies = config.proxies || []
  const groups = config['proxy-groups'] || []
  const nodes: Node[] = []
  const edges: Edge[] = []
  const added = new Set<string>()

  proxies.forEach((p, i) => {
    if (!added.has(p.name)) {
      const isRelay = groups.some((g) => g.type === 'relay' && g.proxies?.includes(p.name))
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
      added.add(p.name)
    }
  })

  proxies.forEach((p) => {
    const dialerProxy = p['dialer-proxy']
    if (dialerProxy && added.has(dialerProxy)) {
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
        if (!added.has(g.proxies[i]) || !added.has(g.proxies[i + 1])) continue
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
