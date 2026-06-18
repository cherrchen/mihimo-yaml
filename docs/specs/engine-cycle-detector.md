# engine-cycle-detector

## 职责
Detects circular references and self-references within the proxy group dependency graph.

## 文件
`src/engine/cycle-detector.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `CycleReport` | `interface` | Summary of cycle detection results |
| `detectProxyGroupCycles` | `function` | DFS-based cycle detection for proxy-group references |
| `detectSelfReferences` | `function` | Finds proxy groups that reference themselves |

```typescript
interface CycleReport {
  hasCycle: boolean
  cycles: string[][]   // Each inner array is a cycle path (e.g. ["A", "B", "A"])
  path: string          // Always "proxy-groups"
}

function detectProxyGroupCycles(config: MihomoConfig): CycleReport

function detectSelfReferences(config: MihomoConfig): string[]
```

## 依赖
- `import type { MihomoConfig } from '@/schema/model'` — config schema type

## 关键数据流

`detectProxyGroupCycles` builds a dependency adjacency map from proxy groups → groups they reference via their `proxies` list (filtering out non-group entries). It then runs a recursive DFS that tracks visited nodes and the current recursion stack. When a node already in the stack is revisited, a cycle is recorded. `detectSelfReferences` is a straightforward linear scan checking if any group's `proxies` array includes its own name.

## 关联测试
- `src/__tests__/cycle-detector.test.ts`
