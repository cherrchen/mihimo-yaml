# app

## 职责
Root React component that wires up layout, navigation, keyboard shortcuts, and lazy-loaded editor pages.

## 文件
`src/App.tsx`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `App` (default) | `React.FC` | The top-level application component |

```typescript
export default function App(): JSX.Element
```

## 依赖
- `react` — `Suspense`, `lazy`, `useEffect`, `useCallback`
- `@/components/layout/AppShell` — layout shell with header, sidebar, preview, and content slots
- `@/components/layout/Header` — top header bar
- `@/components/layout/NavTree` — left navigation tree
- `@/store/ui-store` — `useUiStore` (reads `activeSection`, `sidebarWidth`, `sidebarOpen`)
- `@/store/config-store` — `useConfigStore` (for undo/redo keyboard shortcuts)
- `@/components/ConfigBackgroundTasks` — isolates config derivation and auto-save subscriptions from the application shell
- `@/pages/Dashboard` — default landing page
- 21 lazy-loaded editor/page components (19 editor routes plus About and Settings), plus a lazy-loaded YAML preview; Dashboard is imported eagerly

### Lazy-loaded sections

| activeSection key | Component |
|---|---|
| `dashboard` | `DashboardPage` |
| `general` | `GeneralEditor` |
| `dns` | `DnsEditor` |
| `hosts` | `HostsEditor` |
| `inbounds` | `InboundsEditor` |
| `tun` | `TunEditor` |
| `sniffer` | `SnifferEditor` |
| `proxies` | `ProxiesEditor` |
| `proxy-providers` | `ProxyProvidersEditor` |
| `proxy-groups` | `ProxyGroupsEditor` |
| `chain-builder` | `ChainBuilderEditor` |
| `rule-providers` | `RuleProvidersEditor` |
| `rules` | `RulesEditor` |
| `sub-rules` | `SubRulesEditor` |
| `tunnels` | `TunnelsEditor` |
| `ntp` | `NtpEditor` |
| `experimental` | `ExperimentalEditor` |
| `iptables` | `IptablesEditor` |
| `ebpf` | `EbpfEditor` |
| `clash-for-android` | `ClashForAndroidEditor` |
| `about` | `AboutPage` |
| `settings` | `SettingsPage` |

## 关键数据流
`App` mounts `ConfigBackgroundTasks` as a sibling of the layout so config/auto-save updates do not re-render the application shell. It subscribes only to the three UI fields required by `AppShell`, registers global keyboard listeners for undo/redo/save shortcuts, and maps `activeSection` to lazy editor components. Lazy editors and YamlPreview are wrapped in `<Suspense>` with a `LoadingPanel` fallback.

## 关联测试
- No dedicated `App` integration test
