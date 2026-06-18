# schema-unknown-fields

## 职责
Provides utilities to split object keys into known and unknown buckets and merge unknown keys back. The current YAML parser uses this mechanism for top-level keys only.

## 文件
`src/schema/unknown-fields.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `extractUnknownFields` | `function` | Splits a flat object into `known` and `unknown` based on a whitelist `Set` of keys |

```typescript
export function extractUnknownFields(
  raw: Record<string, unknown>,
  knownKeys: Set<string>,
): { known: Record<string, unknown>; unknown: Record<string, unknown> }
```

| `injectUnknownFields` | `function` | Appends unknown keys into a target output object |

```typescript
export function injectUnknownFields(
  output: Record<string, unknown>,
  unknown: Record<string, unknown>,
): void
```

| `extractNestedUnknown` | `function` | Same as `extractUnknownFields` but with a nil-guard for potentially undefined raw input (for nested config sections) |

```typescript
export function extractNestedUnknown(
  raw: Record<string, unknown> | undefined,
  knownKeys: Set<string>,
): { known: Record<string, unknown>; unknown: Record<string, unknown> }
```

## 依赖
- (none — pure utility, no imports)

## 关键数据流
Called from `parseYaml`, `extractUnknownFields` bins top-level entries into `known` and `unknown`; unknown keys are stored in `MihomoConfig._unknownFields`. `injectUnknownFields` appends them during serialization. `extractNestedUnknown` is exported but currently has no runtime caller. Nested unknown properties generally remain because parsed nested objects are retained and Zod uses passthrough; there is no separate nested `_unknownFields` extraction flow.

## 关联测试
- `src/__tests__/unknown-fields.test.ts`
