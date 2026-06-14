import { MarkerType, type Edge, type Node } from '@xyflow/react'
import { BUILTIN_STRATEGIES } from '@/lib/constants'
import type { MihomoConfig } from '@/schema/model'

function groupStatus(groupName: string, cycles: string[][], selfRefs: string[]) {
  const hasCycle = cycles.some((cycle) => cycle.includes(groupName))
  const hasSelf = selfRefs.some((r) => r.includes(groupName))
  return { hasCycle, hasSelf }
}

function createNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  style: Node['style'],
): Node {
  return {
    id,
    type: 'default',
    data: { label },
    position,
    style,
  }
}

export function buildProxyGroupTopology(
  config: MihomoConfig,
  cycles: string[][] = [],
  selfRefs: string[] = [],
): { initialNodes: Node[]; initialEdges: Edge[] } {
  const groups = config['proxy-groups'] || []
  if (groups.length === 0) return { initialNodes: [], initialEdges: [] }

  const proxies = config.proxies || []
  const providers = Object.keys(config['proxy-providers'] || {})
  const builtinRefs = new Set<string>()

  groups.forEach((g) => {
    g.proxies?.forEach((ref) => {
      if ((BUILTIN_STRATEGIES as readonly string[]).includes(ref)) builtinRefs.add(ref)
    })
  })

  const nodes: Node[] = []
  const edges: Edge[] = []

  groups.forEach((g, i) => {
    const { hasCycle, hasSelf } = groupStatus(g.name, cycles, selfRefs)
    nodes.push(createNode(
      g.name,
      `[${g.type}] ${g.name}`,
      { x: 80 + (i % 5) * 220, y: 60 + Math.floor(i / 5) * 130 },
      {
        background: hasCycle ? '#fef2f2' : hasSelf ? '#fef3c7' : '#f0fdf4',
        border: `2px solid ${hasCycle ? '#ef4444' : hasSelf ? '#f59e0b' : '#22c55e'}`,
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '11px',
        fontWeight: 600,
        width: 200,
      },
    ))
  })

  const groupRows = Math.ceil(groups.length / 5)
  const proxyStartY = 60 + Math.max(groupRows, 1) * 150

  proxies.forEach((p, i) => {
    nodes.push(createNode(
      p.name,
      `[proxy:${p.type}] ${p.name}`,
      { x: 80 + (i % 5) * 220, y: proxyStartY + Math.floor(i / 5) * 110 },
      {
        background: '#eff6ff',
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '11px',
        fontWeight: 500,
        width: 200,
      },
    ))
  })

  const proxyRows = Math.ceil(proxies.length / 5)
  const providerStartY = proxyStartY + Math.max(proxyRows, 1) * 130

  providers.forEach((name, i) => {
    nodes.push(createNode(
      name,
      `[provider] ${name}`,
      { x: 80 + (i % 5) * 220, y: providerStartY + Math.floor(i / 5) * 110 },
      {
        background: '#f5f3ff',
        border: '1px solid #8b5cf6',
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '11px',
        fontWeight: 500,
        width: 200,
      },
    ))
  })

  const builtinStartY = providerStartY + Math.max(Math.ceil(providers.length / 5), 1) * 120
  Array.from(builtinRefs).forEach((name, i) => {
    nodes.push(createNode(
      name,
      `[built-in] ${name}`,
      { x: 80 + (i % 5) * 220, y: builtinStartY + Math.floor(i / 5) * 100 },
      {
        background: '#f8fafc',
        border: '1px solid #94a3b8',
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '11px',
        fontWeight: 500,
        width: 200,
      },
    ))
  })

  const nodeIds = new Set(nodes.map((node) => node.id))

  groups.forEach((g) => {
    g.proxies?.forEach((ref, j) => {
      if (!nodeIds.has(ref)) return
      edges.push({
        id: `${g.name}-${ref}-${j}`,
        source: g.name,
        target: ref,
        label: j === 0 ? 'proxies' : '',
        style: { stroke: '#6366f1', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    })

    g.use?.forEach((ref, j) => {
      if (!nodeIds.has(ref)) return
      edges.push({
        id: `${g.name}-use-${ref}-${j}`,
        source: g.name,
        target: ref,
        label: 'use',
        style: { stroke: '#8b5cf6', strokeWidth: 1.5, strokeDasharray: '4,4' },
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    })
  })

  return { initialNodes: nodes, initialEdges: edges }
}
