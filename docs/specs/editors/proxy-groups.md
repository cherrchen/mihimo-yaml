# proxy-groups

## 职责
Manages proxy groups — routing policies that select or chain proxies (select, url-test, fallback, load-balance, relay).

## 文件
- `src/components/editors/proxy-groups/ProxyGroupsEditor.tsx`
- `src/components/editors/proxy-groups/ProxyGroupTopology.tsx`
- `src/components/editors/proxy-groups/topology.ts`

## UI 结构
Two views toggled via toolbar buttons:
- **List view**: Left sidebar with search, "Add", "Topology" buttons, and scrollable group list. Right pane shows the selected group's detail form with a drag-and-drop proxy member list (powered by `@dnd-kit`), type-specific fields (health check for url-test/fallback/load-balance, strategy for load-balance, relay warnings), and advanced fields (use/providers, disable-udp, empty-fallback, icon, hidden, filter, exclude-filter).
- **Topology view**: Interactive `@xyflow/react` graph showing proxy groups, proxies, providers, and built-in strategies as nodes with directed edges. Color-coded for normal (green), self-referencing (amber), and cyclic (red). Bottom panel lists detected issues: cycles, self-references, dangling references.

## 配置字段
- `proxy-groups[]` (top-level array)
  - `name`, `type` (select/url-test/fallback/load-balance/relay)
  - `proxies` — array of member references (proxies, groups, or built-ins like DIRECT/REJECT)
  - `url` — health check URL
  - `interval` — check interval (seconds)
  - `timeout` — check timeout (ms)
  - `max-failed-times` — max failures before marking unhealthy
  - `strategy` — load-balance strategy (`consistent-hashing`, `round-robin`)
  - `use` — array of proxy-provider names
  - `disable-udp` — disable UDP for this group
  - `empty-fallback` — fallback when group is empty
  - `icon` — group icon URL/base64
  - `hidden` — hide from API
  - `filter` / `exclude-filter` — node name filter regex

## 使用组件
- `FieldWrapper`
- `TextField`, `NumberField`, `BoolField`, `SelectField`
- `@dnd-kit/core`, `@dnd-kit/sortable` — drag-and-drop member ordering
- `@xyflow/react` — topology graph rendering

## 关联引擎
- `src/engine/cycle-detector.ts` — detects cyclic and self-references in proxy group dependency graph
- `src/engine/references.ts` — validates proxy/group/provider references, collects group names
- `src/engine/chain-validator.ts` — validates relay groups (UDP incompatibility, member count, chain validity)
- `src/engine/integrity.ts` — aggregates all checks, detects duplicate group names

## 关联测试
- `src/__tests__/components/ProxyGroupTopology.test.tsx` — topology graph and cycle detection tests
- `src/__tests__/cycle-detector.test.ts` — cycle detector unit tests
