import { useEffect, useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { buildDialerChain, validateChains } from '@/engine/chain-validator'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

export function ChainBuilderEditor() {
  const config = useConfigStore((s) => s.config)
  const proxies = useMemo(() => config.proxies || [], [config.proxies])
  const proxyGroups = config['proxy-groups']
  const groups = useMemo(() => proxyGroups || [], [proxyGroups])

  const chainIssues = useMemo(() => validateChains(config), [config])

  // Build nodes and edges for all dialer-proxy chains
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const added = new Set<string>()

    // Add all proxies as nodes
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

      if (p['dialer-proxy'] && added.has(p['dialer-proxy'])) {
        edges.push({
          id: `${p['dialer-proxy']}-${p.name}`,
          source: p.name,
          target: p['dialer-proxy'],
          animated: true,
          label: 'dialer',
          style: { stroke: '#6366f1', strokeWidth: 2 },
        })
      }
    })

    // Add relay chains
    groups.forEach((g) => {
      if (g.type === 'relay' && g.proxies) {
        for (let i = 0; i < g.proxies.length - 1; i++) {
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
  }, [proxies, groups])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">链路构建器</h2>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-3 rounded bg-indigo-500 inline-block" /> dialer-proxy
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded bg-amber-500 inline-block border border-dashed" /> relay
          </span>
        </div>
      </div>

      {/* Topology */}
      <div className="flex-1 rounded-md border border-border overflow-hidden" style={{ minHeight: 300 }}>
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              pannable
              zoomable
              style={{ height: 100 }}
            />
          </ReactFlow>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            暂无代理节点，请在"代理节点"页面添加节点并配置 dialer-proxy
          </div>
        )}
      </div>

      {/* Chain Validation */}
      <div className="mt-3 border border-border rounded-md p-3">
        <h3 className="text-xs font-medium mb-2">链路验证</h3>
        {chainIssues.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 className="size-3.5" />
            所有链路正常
          </div>
        ) : (
          <div className="space-y-1">
            {chainIssues.map((issue, i) => (
              <div key={i} className={`flex items-start gap-2 text-xs rounded p-1.5 ${
                issue.type === 'udp-incompat' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
              }`}>
                <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{issue.proxy}</span>: {issue.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialer-proxy chains list */}
      <div className="mt-3 border border-border rounded-md p-3">
        <h3 className="text-xs font-medium mb-2">Dialer-Proxy 链路</h3>
        {proxies.filter((p) => p['dialer-proxy']).length === 0 ? (
          <p className="text-xs text-muted-foreground">暂无 dialer-proxy 链路</p>
        ) : (
          <div className="space-y-1">
            {proxies
              .filter((p) => p['dialer-proxy'])
              .map((p) => {
                const chain = buildDialerChain(config, p.name)
                return (
                  <div key={p.name} className="flex items-center gap-1 text-xs">
                    {chain.map((node, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <code className="bg-muted px-1 rounded text-[10px]">{node}</code>
                        {i < chain.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
