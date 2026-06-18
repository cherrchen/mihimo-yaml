# schema-yaml

## 职责
Parses YAML strings into `MihomoConfig` objects and serializes them back to YAML, preserving unknown fields, validation state, and YAML comments across round-trips. Provides deterministic field ordering on export.

## 文件
`src/schema/yaml.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `parseYaml` | `function` | Parses a YAML string and returns a `MihomoConfig` with unknown fields, comments, and validation errors attached |

```typescript
export function parseYaml(yamlString: string): MihomoConfig
```

| `stringifyYaml` | `function` | Serializes a `MihomoConfig` back to a YAML string, re-injecting unknown fields |

```typescript
export function stringifyYaml(config: MihomoConfig): string
```

| `stringifyYamlOrdered` | `function` | Serializes config to YAML with fields in a recommended/semantic order (general fields first, then DNS, TUN, proxies, providers, groups, rules, tunnels, etc.) |

```typescript
export function stringifyYamlOrdered(config: MihomoConfig): string
```

| `cloneConfig` | `function` | Deep clones a `MihomoConfig` via JSON serialization |

```typescript
export function cloneConfig(config: MihomoConfig): MihomoConfig
```

| `SECTION_ORDER` | `const` | Priority-ordered list of top-level keys for deterministic YAML output |
| `KNOWN_TOP_KEYS` | `const` | `Set<string>` of all recognized top-level YAML keys |

## 依赖
- `import YAML from 'yaml'` — YAML parsing and stringifying
- `import type { MihomoConfig } from './model'` — config type
- `import { extractUnknownFields, injectUnknownFields } from './unknown-fields'` — preserve unmapped keys
- `import { validateConfig } from './validation'` — Zod validation on parse

## 关键数据流
`parseYaml` first parses the raw YAML string into a plain object, then splits it into known and unknown keys via `extractUnknownFields`. Known keys are cast to `MihomoConfig`. YAML comments are extracted from the parse document and stored in `_comments`. Zod validation runs against the raw object and errors are attached as `_validationErrors`. On stringify, `_unknownFields` are stripped from the known object, then `injectUnknownFields` appends them back to preserve the original shape. `stringifyYamlOrdered` uses `SECTION_ORDER` priority map to group fields logically before serializing.

## 关联测试
- (no dedicated test file found)
