# schema-unknown-fields

## 职责
Provides utility functions to split raw YAML key-value pairs into known and unknown fields, and to re-merge them back, enabling lossless YAML round-trips for unrecognized configuration keys.

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
Called from `parseYaml` in `yaml.ts`, `extractUnknownFields` takes the raw parsed YAML object and a `KNOWN_TOP_KEYS` set, iterates all entries, and bins them into `known` (whitelisted) and `unknown` (everything else). The known portion is cast to `MihomoConfig`, while unknown keys are stored in `_unknownFields`. On serialization, `injectUnknownFields` copies all unknown entries back into the output object—they appear after all known fields due to JS object insertion order. `extractNestedUnknown` is a variant with a `nil` guard for optional nested sections.

## 关联测试
- (no dedicated test file found)
