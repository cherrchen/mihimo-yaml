# schema-model

## 职责
Defines all TypeScript interfaces for the Mihomo proxy configuration data model, covering top-level config, DNS, TUN, proxies, proxy groups, providers, tunnels, and all sub-configurations.

## 文件
`src/schema/model.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `MihomoConfig` | `interface` | Top-level mihomo configuration object |
| `ExternalControllerCors` | `interface` | CORS settings for external controller |
| `ProfileConfig` | `interface` | Profile persistence settings |
| `TlsConfig` | `interface` | Global TLS configuration |
| `GeoXUrl` | `interface` | Geo data download URLs |
| `ClashForAndroidConfig` | `interface` | Clash for Android specific settings |
| `DnsConfig` | `interface` | DNS module configuration |
| `FallbackFilter` | `interface` | DNS fallback filter rules |
| `SnifferConfig` | `interface` | Domain sniffing configuration |
| `ProtocolSniffConfig` | `interface` | Per-protocol sniff settings |
| `TunConfig` | `interface` | TUN device configuration |
| `IptablesConfig` | `interface` | iptables redirect configuration |
| `EbpfConfig` | `interface` | eBPF redirect configuration |
| `ListenerConfig` | `interface` | Inbound listener configuration |
| `VmessUser` | `interface` | VMess user credentials |
| `TuicServerConfig` | `interface` | TUIC server configuration |
| `ProxyConfig` | `interface` | Proxy node configuration (union of all proxy types) |
| `ProxyType` | `type` | Union of supported proxy type string literals; `ProxyConfig` itself remains a flat interface |
| `isProxyType` | `function` | Type guard to check if a string is a known proxy type |

```typescript
export function isProxyType(type: string): type is ProxyType
```

| `getProxyTypeFields` | `function` | Returns the list of relevant field names for a given proxy type |

```typescript
export function getProxyTypeFields(type: string): string[]
```

| `SmuxConfig` | `interface` | SMUX multiplexing configuration |
| `BrutalOpts` | `interface` | Brutal congestion control options |
| `RealityOpts` | `interface` | Reality (REALITY) TLS options |
| `EchOpts` | `interface` | ECH (Encrypted Client Hello) options |
| `HttpOpts` | `interface` | HTTP transport options |
| `H2Opts` | `interface` | H2 transport options |
| `GrpcOpts` | `interface` | gRPC transport options |
| `WsOpts` | `interface` | WebSocket transport options |
| `XHttpOpts` | `interface` | XHTTP (Xray HTTP) transport options |
| `ReuseSettings` | `interface` | Connection reuse settings for XHTTP |
| `SsOpts` | `interface` | Shadowsocks inner options (for Trojan) |
| `PluginOpts` | `interface` | SS plugin options |
| `WireGuardPeer` | `interface` | WireGuard peer configuration |
| `ProxyProviderConfig` | `interface` | Proxy provider (subscription) configuration |
| `HealthCheckConfig` | `interface` | Health check settings for proxy providers |
| `ProxyProviderOverride` | `interface` | Field overrides for proxy providers |
| `ProxyNameOverride` | `interface` | Name mapping rule for proxy providers |
| `ProxyGroupConfig` | `interface` | Proxy group configuration |
| `RuleProviderConfig` | `interface` | Rule provider configuration |
| `TunnelConfig` | `interface` | Tunnel (inbound-to-proxy) configuration |
| `NtpConfig` | `interface` | NTP time sync configuration |
| `ExperimentalConfig` | `interface` | Experimental feature flags |

## 依赖
- (none — pure type definitions, no imports)

## 关键数据流
`MihomoConfig` is the root interface that composes all sub-config interfaces. `_unknownFields`, `_validationErrors`, and `_comments` are internal metadata carriers. `ProxyConfig` is a monolithic interface with all proxy-type fields merged; `ProxyType` and `getProxyTypeFields` provide optional type/field lookup helpers, but the current proxy editor does not consume `getProxyTypeFields`. Listener and proxy interfaces also declare `_unknownFields`, although `parseYaml` currently extracts unknown fields only at the top level.

## 关联测试
- (no dedicated test file found)
