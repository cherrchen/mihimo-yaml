# schema-metadata

## 职责
Defines the `FieldMeta` type and a comprehensive catalog of all mihomo configuration fields with their metadata (path, type, default values, descriptions, categories, platform support, etc.). Provides lookup utilities for the metadata catalog.

## 文件
- `src/schema/metadata-types.ts` — type definitions
- `src/schema/metadata.ts` — field catalog and lookup functions

## 导出 API (metadata-types.ts)

| 导出 | 类型 | 说明 |
|------|------|------|
| `FieldType` | `type` | Union of primitive type representations for field metadata |

```typescript
export type FieldType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]'
  | 'object' | 'object[]' | 'map' | 'enum' | 'enum[]'
```

| `FieldMeta` | `interface` | Metadata descriptor for a single configuration field |

```typescript
export interface FieldMeta {
  key: string
  path: string
  type: FieldType
  defaultValue?: unknown
  required: boolean
  mihomo: boolean
  stash: boolean
  enumValues?: readonly string[]
  description: string
  example?: unknown
  category: string
  advanced: boolean
  deprecated: boolean
  sensitive: boolean
  stashAction?: 'remove' | 'warn' | 'transform' | 'block'
  stashTransform?: string
}
```

| `FieldMetaCategory` | `type` | Union of valid category identifiers |

```typescript
export type FieldMetaCategory =
  | 'general' | 'dns' | 'hosts' | 'inbounds' | 'tun' | 'sniffer'
  | 'proxies' | 'proxy-providers' | 'proxy-groups' | 'rule-providers'
  | 'rules' | 'sub-rules' | 'tunnels' | 'ntp' | 'experimental'
```

## 导出 API (metadata.ts)

| 导出 | 类型 | 说明 |
|------|------|------|
| `ALL_FIELD_META` | `FieldMeta[]` | Merged array of the 157 currently registered field metadata entries |

| `getFieldMeta` | `function` | Looks up a single `FieldMeta` by dot-path |

```typescript
export function getFieldMeta(path: string): FieldMeta | undefined
```

| `getFieldsByCategory` | `function` | Returns all `FieldMeta` entries matching a given category |

```typescript
export function getFieldsByCategory(category: string): FieldMeta[]
```

| `getStashUnsupportedFields` | `function` | Returns fields that Stash does not support or that should be removed on Stash export |

```typescript
export function getStashUnsupportedFields(): FieldMeta[]
```

Internal builders (not exported):

| 导出 | 类型 | 说明 |
|------|------|------|
| `f` | `function` | Factory that applies defaults (`required: false`, `mihomo: true`, `stash: true`, `advanced: false`, `deprecated: false`, `sensitive: false`) and merges with a partial `FieldMeta` |

Internal field arrays (grouped by category):

| Array | Category |
|------|------|
| `generalFields` | general |
| `legacyInboundFields` | inbounds (deprecated ports) |
| `profileFields` | general (profile sub-fields) |
| `geoxUrlFields` | general (geo URL sub-fields) |
| `dnsFields` | dns (mihomo fields) |
| `dnsStashFields` | dns (Stash-only fields) |
| `hostsFields` | hosts |
| `snifferFields` | sniffer |
| `tunFields` | tun |
| `proxyCommonFields` | proxies |
| `proxyGroupCommonFields` | proxy-groups |
| `ruleProviderFields` | rule-providers |
| `ruleFields` | rules |
| `subRuleFields` | sub-rules |
| `tunnelFields` | tunnels |
| `ntpFields` | ntp |
| `experimentalFields` | experimental |

## 依赖
- `import type { FieldMeta } from './metadata-types'` — type for the factory function

## 关键数据流
`metadata-types.ts` defines `FieldMeta` as a descriptor interface with semantic and platform-compatibility fields. `metadata.ts` uses the private `f()` factory to apply defaults and combines the category arrays into `ALL_FIELD_META`. The three lookup functions query this static registry. No editor or compatibility module currently imports these APIs, so the registry does not drive the present form rendering or Stash transformation and can drift unless updated deliberately.

## 关联测试
- (no dedicated test file found)
