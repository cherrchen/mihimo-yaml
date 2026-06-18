import { useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { buildDialerChain, validateChains } from '@/engine/chain-validator'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { buildChainTopology } from './topology'

export function ChainBuilderEditor() {
  const config = useConfigStore((s) => s.config)
  const proxies = useMemo(() => config.proxies || [], [config.proxies])
  const proxyProviders = config['proxy-providers']
  const dialerSources = useMemo(() => [
    ...proxies
      .filter((proxy) => proxy['dialer-proxy'])
      .map((proxy) => ({ key: `proxy:${proxy.name}`, name: proxy.name })),
    ...Object.entries(proxyProviders || {})
      .filter(([, provider]) => provider.override?.['dialer-proxy'])
      .map(([name]) => ({ key: `provider:${name}`, name })),
  ], [proxies, proxyProviders])

  const chainIssues = useMemo(() => validateChains(config), [config])

  // Build nodes and edges for all dialer-proxy chains
  const { initialNodes, initialEdges } = useMemo(() => buildChainTopology(config), [config])

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
          <span className="flex items-center gap-1">
            <span className="size-3 rounded bg-green-500 inline-block" /> 代理组
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded bg-violet-500 inline-block" /> Provider
          </span>
        </div>
      </div>

      {/* Topology */}
      <div className="flex-1 rounded-md border border-border overflow-hidden" style={{ minHeight: 300 }}>
        {initialNodes.length > 0 ? (
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
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
            暂无 dialer-proxy 或 relay 链路
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
        {dialerSources.length === 0 ? (
          <p className="text-xs text-muted-foreground">暂无 dialer-proxy 链路</p>
        ) : (
          <div className="space-y-1">
            {dialerSources.map((source) => {
              const chain = buildDialerChain(config, source.name)
              return (
                <div key={source.key} className="flex items-center gap-1 text-xs">
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
