# schema-validation

## 职责
Provides Zod schemas for validating MihomoConfig objects and a validation function that returns structured error results.

## 文件
`src/schema/validation.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `MihomoConfigSchema` | `ZodObject` | Zod schema for the full mihomo config |

```typescript
export const MihomoConfigSchema: z.ZodObject<...>
```

| `ValidationError` | `interface` | Single validation error with dot-path and message |
| `ValidationResult` | `interface` | Result wrapper with `success` boolean and `errors` array |

```typescript
export interface ValidationError {
  path: string
  message: string
}

export interface ValidationResult {
  success: boolean
  errors: ValidationError[]
}
```

| `validateConfig` | `function` | Runs Zod `safeParse` on a raw config object and returns structured result |

```typescript
export function validateConfig(raw: Record<string, unknown>): ValidationResult
```

| `flattenZodErrors` | `function` | Converts Zod `ZodError` issues into `ValidationError[]` with dot-separated paths (internal) |

```typescript
function flattenZodErrors(zodError: z.ZodError, basePath?: string): ValidationError[]
```

Internal Zod schemas (not exported):

| Schema | 说明 |
|------|------|
| `ExternalControllerCorsSchema` | Validates `external-controller-cors` sub-object |
| `ProfileConfigSchema` | Validates `profile` sub-object |
| `TlsConfigSchema` | Validates `tls` sub-object |
| `GeoXUrlSchema` | Validates `geox-url` sub-object |
| `ClashForAndroidSchema` | Validates `clash-for-android` sub-object |
| `FallbackFilterSchema` | Validates `fallback-filter` sub-object |
| `ProtocolSniffConfigSchema` | Validates per-protocol sniffer config |
| `SnifferConfigSchema` | Validates `sniffer` sub-object |
| `TunConfigSchema` | Validates `tun` sub-object (partial, only key fields) |
| `IptablesConfigSchema` | Validates `iptables` sub-object |
| `VmessUserSchema` | Validates VMess user entries |
| `ListenerConfigSchema` | Validates listener entries |
| `SmuxConfigSchema` | Validates SMUX config |
| `ProxyConfigSchema` | Validates proxy entries |
| `ProxyProviderConfigSchema` | Validates proxy provider entries |
| `ProxyGroupConfigSchema` | Validates proxy group entries |
| `RuleProviderConfigSchema` | Validates rule provider entries |
| `TunnelConfigSchema` | Validates tunnel entries |
| `NtpConfigSchema` | Validates NTP config |
| `ExperimentalConfigSchema` | Validates experimental config |
| `DnsConfigSchema` | Validates DNS config |

## 依赖
- `import { z } from 'zod'` — schema definition and validation
- `import type { MihomoConfig } from './model'` — type re-export
- `import { RULE_PROVIDER_FORMATS } from '@/lib/constants'` — enum values for rule provider format validation

## 关键数据流
All Zod schemas use `.passthrough()` to allow fields beyond those explicitly defined, supporting the unknown-fields preservation pattern. `validateConfig` receives a raw parsed object, runs `safeParse` via `MihomoConfigSchema`, and returns a `ValidationResult`. On failure, `flattenZodErrors` recursively walks Zod issues and joins path segments with `.` to produce human-readable error paths (e.g. `dns.nameserver-policy.geosite:cn`). The validation is run inside `parseYaml` in `yaml.ts`.

## 关联测试
- (no dedicated test file found)
