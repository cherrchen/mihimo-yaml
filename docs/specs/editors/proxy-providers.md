# proxy-providers

## 职责
Manages proxy providers — remote or local sources that supply proxy node lists, with health check and node override capabilities.

## 文件
- `src/components/editors/proxy-providers/ProxyProvidersEditor.tsx`

## UI 结构
Shared list/detail split layout. The left pane uses 30% width with a 14rem minimum and lists all providers by name and type. The centered right pane shows a detail form with type/interval, URL fetch-and-preview, advanced fields, health checks, and node overrides.

## 配置字段
- `proxy-providers` (top-level map, keyed by provider name)
  - `type` — (`http` | `file`)
  - `interval` — update interval in seconds
  - `url` — remote URL (HTTP type)
  - `path` — local file path (file type or cache path)
  - `proxy` — download proxy
  - `size-limit` — max response size in bytes
  - `filter` / `exclude-filter` — node name regex filters
  - `exclude-type` — exclude node types (e.g. `ss|ssr`)
  - `health-check.enable` — enable health check
  - `health-check.url` — health check URL
  - `health-check.interval` — check interval (seconds)
  - `health-check.lazy` — lazy check (default `true`)
  - `override.additional-prefix` / `override.additional-suffix` — name decoration
  - `override.udp` / `override.tfo` / `override.skip-cert-verify` — node overrides
  - `override.dialer-proxy` — dialer proxy override
  - `override.ip-version` — IP version override

## 使用组件
- `FieldWrapper`
- `TextField`, `NumberField`, `BoolField`, `SelectField`
- `Button` (Shadcn UI) — fetch trigger

## 关联引擎
- `src/engine/references.ts` — validates provider usage in proxy groups
- `src/engine/chain-validator.ts` — validates dialer-proxy in provider overrides
- `src/engine/integrity.ts` — aggregates dangling provider reference checks

## 关联测试
(No component-specific tests)
