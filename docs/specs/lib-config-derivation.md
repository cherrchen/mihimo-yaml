# lib-config-derivation

## 职责
Provides a Worker-backed service for deriving ordered YAML and the integrity report from an immutable config snapshot without blocking urgent React updates.

## 文件
- `src/lib/config-derivation.ts`
- `src/lib/config-derivation-types.ts`
- `src/workers/config-derivation.worker.ts`

## 导出 API
| 导出 | 说明 |
|------|------|
| `deriveConfig(config)` | Returns a Promise for YAML and integrity data; reuses the Promise for the current snapshot identity |
| `deriveConfigSync(config)` | Synchronous implementation used by the Worker and fallback path |
| `resetConfigDerivationForTests()` | Terminates/reset singleton state for isolated tests |

## 关键行为
The client lazily creates one Vite module Worker and tags requests with monotonically increasing IDs. Worker startup/runtime failure rejects pending work and switches future requests to a deferred main-thread fallback. Before YAML and integrity derivation, disabled DNS is projected out of the effective config while remaining available in editor state. Only one config identity is cached so the 50-entry undo history does not retain 50 large YAML strings. Consumers must still verify that a returned snapshot is current before applying or persisting it.

## 关联测试
- `src/__tests__/config-derivation.test.ts`

