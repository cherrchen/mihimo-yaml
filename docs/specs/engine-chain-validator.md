# engine-chain-validator

## 职责
Validates relay proxy group configuration and detects broken/circular dialer-proxy chains across proxies and proxy providers.

## 文件
`src/engine/chain-validator.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `ChainIssue` | `interface` | Describes a chain validation issue |
| `validateChains` | `function` | Validates relay groups and dialer-proxy chains |
| `buildDialerChain` | `function` | Builds an ordered dialer-proxy chain from a starting proxy |

```typescript
interface ChainIssue {
  type: 'udp-incompat' | 'missing-relay' | 'empty-relay' | 'self-relay' | 'broken-chain' | 'circular-chain'
  message: string
  proxy: string
}

function validateChains(config: MihomoConfig): ChainIssue[]

function buildDialerChain(config: MihomoConfig, startName: string): string[]
```

## 依赖
- `import type { MihomoConfig } from '@/schema/model'` — config schema type
- `import { BUILTIN_STRATEGIES } from '@/lib/constants'` — built-in strategy names (DIRECT, REJECT, etc.)

## 关键数据流

`validateChains` iterates over proxy groups and proxies in the config. For relay-type groups it checks UDP compatibility, minimum proxy count (≥2), dangling references, and self-references. For proxies and proxy providers it validates `dialer-proxy` references and runs a DFS cycle-detection algorithm on the dialer-proxy dependency graph to find circular chains. `buildDialerChain` constructs a linear ordered chain by walking `dialer-proxy` references from a starting proxy, stopping at cycles or invalid targets.

## 关联测试
- `src/__tests__/chain-validator.test.ts`
