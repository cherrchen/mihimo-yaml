# proxies

## 职责
Manages outbound proxy nodes — the individual proxy servers that groups and rules reference.

## 文件
- `src/components/editors/proxies/ProxiesEditor.tsx`

## UI 结构
List/detail split layout with search. Left sidebar has a search input, an "Add" button, and a scrollable proxy list showing index, name, and type. Right pane shows a detail form with collapsible sections (Advanced, TLS, SMUX, Network/Transport). Type-specific fields are rendered dynamically via `TypeSpecificFields` switch. Supports duplicate and delete actions.

## 配置字段
- `proxies[]` (top-level array)
  - **Common**: `name`, `type` (26 types), `server`, `port`, `udp`, `ip-version`
  - **Advanced**: `tfo`, `mptcp`, `interface-name`, `routing-mark`, `dialer-proxy`
  - **TLS**: `tls`, `sni`, `skip-cert-verify`, `client-fingerprint`, `alpn`
  - **SMUX**: `smux.enabled`, `smux.protocol`, `smux.max-connections`, `smux.padding`
  - **Network**: `network` (tcp/http/h2/grpc/ws/xhttp); dedicated option controls currently cover `ws-opts.path`, `grpc-opts.grpc-service-name`, and `h2-opts.path`
  - **Type-specific**: `cipher`, `password`, `uuid`, `alterId`, `security`, `flow`, `up`, `down`, `auth`/`auth-str`, `obfs`, `private-key`, `public-key`, `ip`, `ipv6`, `mtu`, `allowed-ips`, `username`, `psk`, `congestion-controller`, `disable-sni`, `plugin`, `udp-over-tcp`

## 使用组件
- `FieldWrapper`
- `TextField`, `NumberField`, `BoolField`, `SelectField`
- `SensitiveField`

## 关联引擎
- `src/engine/references.ts` — collects proxy names, validates dialer-proxy references
- `src/engine/chain-validator.ts` — validates dialer-proxy chains for circular dependencies
- `src/engine/integrity.ts` — checks duplicate proxy names

`ProxyType`/`getProxyTypeFields` exist in the schema model, but this editor still uses a local switch and does not expose every modeled advanced option.

## 关联测试
(No component-specific tests)
