import { useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import {
  ReactFlow,
  Background,
  Controls,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { detectProxyGroupCycles, detectSelfReferences } from '@/engine/cycle-detector'
import { collectReferences } from '@/engine/references'
import { AlertTriangle } from 'lucide-react'
import { buildProxyGroupTopology } from './topology'

export function ProxyGroupTopology() {
  const config = useConfigStore((s) => s.config)

  const { cycles, selfRefs, danglingRefs } = useMemo(() => {
    const c = detectProxyGroupCycles(config)
    const s = detectSelfReferences(config)
    const r = collectReferences(config)
    return {
      cycles: c.cycles,
      selfRefs: s,
      danglingRefs: [
        ...r.danglingProxyRefs,
        ...r.danglingGroupRefs,
        ...r.danglingProviderRefs,
      ],
    }
  }, [config])

  const { initialNodes, initialEdges } = useMemo(
    () => buildProxyGroupTopology(config, cycles, selfRefs),
    [config, cycles, selfRefs],
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <span className="text-[10px] flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-green-500 inline-block" /> 正常
        </span>
        <span className="text-[10px] flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-amber-500 inline-block" /> 自引用
        </span>
        <span className="text-[10px] flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-red-500 inline-block" /> 循环
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {initialNodes.length} 节点 · {initialEdges.length} 边
        </span>
      </div>

      {/* Graph */}
      <div className="flex-1 min-h-[300px]">
        {initialNodes.length > 0 ? (
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
          </ReactFlow>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            暂无代理组数据
          </div>
        )}
      </div>

      {/* Issues */}
      {(cycles.length > 0 || selfRefs.length > 0 || danglingRefs.length > 0) && (
        <div className="border-t border-border p-2 max-h-32 overflow-y-auto">
          {cycles.map((cycle, i) => (
            <div key={`c-${i}`} className="flex items-start gap-1.5 text-xs text-red-600 bg-red-500/10 rounded px-2 py-1 mb-1">
              <AlertTriangle className="size-3 shrink-0 mt-0.5" />
              <span>循环引用: {cycle.join(' → ')}</span>
            </div>
          ))}
          {selfRefs.map((ref, i) => (
            <div key={`s-${i}`} className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-500/10 rounded px-2 py-1 mb-1">
              <AlertTriangle className="size-3 shrink-0 mt-0.5" />
              <span>{ref}</span>
            </div>
          ))}
          {danglingRefs.map((ref, i) => (
            <div key={`d-${i}`} className="flex items-start gap-1.5 text-xs text-red-600 bg-red-500/10 rounded px-2 py-1 mb-1">
              <AlertTriangle className="size-3 shrink-0 mt-0.5" />
              <span>{ref}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
