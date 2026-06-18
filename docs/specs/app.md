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
- `@/hooks/useAutoSave` — `useAutoSave` to start auto-save watcher
- `@/pages/Dashboard` — default landing page
- 18 lazy-loaded editor/page components (via `React.lazy`)

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
`App` calls `useAutoSave()` to activate persistent auto-save on mount. It registers global keyboard listeners for `Ctrl+Z` (undo), `Ctrl+Shift+Z` (redo), and `Ctrl+S` (suppressed, handled by auto-save). The `renderEditor` function maps `activeSection` from the UI store to the corresponding lazy-loaded component via a switch statement. All editors and the YamlPreview panel are wrapped in `<Suspense>` with a `LoadingPanel` fallback. The layout is composed via `<AppShell>`, receiving the header, nav tree, preview panel, and main content area as props.

## 关联测试
- No dedicated test file; tested indirectly through component integration tests
