# chain-builder

## 职责
Visualizes dialer-proxy relay chains as a topology graph and validates chain integrity.

## 文件
- `src/components/editors/chain-builder/ChainBuilderEditor.tsx`
- `src/components/editors/chain-builder/topology.ts`

## UI 结构
Topology view powered by ReactFlow with nodes (proxy, provider, proxy-group, built-in) and edges (dialer, relay). Below the graph: a chain validation panel showing issues, and a text list of dialer-proxy chains with reverse chain order. All nodes auto-layout in a grid.

## 配置字段
- `proxies[].dialer-proxy`
- `proxy-providers[].override.dialer-proxy`
- `proxy-groups[].type` (relay)
- `proxy-groups[].proxies`

## 使用组件
- `@xyflow/react` (ReactFlow, Background, Controls, MiniMap)
- `lucide-react` (AlertCircle, CheckCircle2, ArrowRight)

## 关联引擎
- `src/engine/chain-validator.ts` – `buildDialerChain`, `validateChains`
- `src/engine/integrity.ts` – aggregates chain issues into integrity report

## 关联测试
- `src/__tests__/components/ChainBuilderTopology.test.tsx`
- `src/__tests__/chain-validator.test.ts`
