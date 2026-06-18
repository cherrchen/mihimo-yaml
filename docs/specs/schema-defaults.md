# schema-defaults

## 职责
Provides pre-built `MihomoConfig` template objects for common use cases (minimal config, Fake-IP, Stash, China-direct routing, chain proxy), serving as starting points for new configurations.

## 文件
`src/schema/defaults.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `MINIMAL_CONFIG` | `MihomoConfig` | Bare-minimum valid config: rule mode, info logging, basic DNS (DOH), one select group (PROXY→DIRECT), one MATCH rule |

| `FAKE_IP_TEMPLATE` | `MihomoConfig` | Fake-IP enhanced config with `fake-ip-range`, `fake-ip-filter` (includes `*.lan` and QQ login domain), `default-nameserver` set to AliDNS |

| `STASH_TEMPLATE` | `MihomoConfig` | Stash-compatible config: rule mode, no `ipv6`/`enhanced-mode`, flat `dns` structure with `fake-ip-filter`, single DOH nameserver |

| `CN_DIRECT_TEMPLATE` | `MihomoConfig` | China-direct routing config: Fake-IP mode, `nameserver-policy` routing `geosite:cn` to domestic DNS, a `cn` rule provider pulling MRS from GitHub, `RULE-SET,cn,DIRECT` + `MATCH,PROXY` rules |

| `CHAIN_PROXY_TEMPLATE` | `MihomoConfig` | Multi-hop chain proxy example: three SS proxies linked via `dialer-proxy`, a select group referencing them, and a relay group (`type: 'relay'`) chaining them in order |

## 依赖
- `import type { MihomoConfig } from './model'` — config type annotation

## 关键数据流
All templates are plain `MihomoConfig` constants. Consumers copy them via `cloneConfig` (from `yaml.ts`) to avoid mutation. `MINIMAL_CONFIG` is the baseline — other templates layer additional fields (Fake-IP filters, rule providers, chain proxies) on top of the same structure. These templates are used by the frontend to populate the editor when users create a new configuration file.

## 关联测试
- (no dedicated test file found)
