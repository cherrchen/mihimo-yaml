# store-ui

## 职责
Zustand store for UI-level state including theme, sidebar layout, active navigation section, and display toggles.

## 文件
`src/store/ui-store.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `Theme` | `type` | `'light' \| 'dark' \| 'system'` |
| `NavSection` | `type` | Alias for `string` |
| `useUiStore` | `Zustand hook` | React hook providing UI state and actions |

### State

| 字段 | 类型 | 说明 |
|------|------|------|
| `theme` | `Theme` | Current colour theme (persisted in localStorage) |
| `sidebarWidth` | `number` | Sidebar width in pixels (persisted, default 280) |
| `sidebarOpen` | `boolean` | Whether the sidebar is visible |
| `activeSection` | `NavSection` | Currently selected navigation section key |
| `previewMode` | `'yaml' \| 'issues' \| 'diff' \| 'report'` | Which panel to show in the preview area |
| `showAdvancedFields` | `boolean` | Reserved global advanced-field toggle; currently unused outside the store |
| `showSensitiveFields` | `boolean` | Reserved global sensitive-field toggle; currently unused outside the store |
| `exportMode` | `'mihomo' \| 'stash'` | Reserved export mode; Header currently keeps its own local export mode |

### Actions

| 方法 | 签名 | 说明 |
|------|------|------|
| `setTheme` | `(theme: Theme) => void` | Persists to localStorage and applies to `<html>` class |
| `setSidebarWidth` | `(width: number) => void` | Persists new width to localStorage |
| `toggleSidebar` | `() => void` | Toggles `sidebarOpen` boolean |
| `setActiveSection` | `(section: NavSection) => void` | Navigates to a section |
| `setPreviewMode` | `(mode: ...) => void` | Switches the preview panel display |
| `toggleAdvancedFields` | `() => void` | Toggles advanced field visibility |
| `toggleSensitiveFields` | `() => void` | Toggles sensitive field visibility |
| `setExportMode` | `(mode: 'mihomo' \| 'stash') => void` | Sets export target mode |

## 依赖
- `zustand` — state management (`create`)
- (internal) `getInitialTheme()` — reads `localStorage['mihomo-yaml-theme']`
- (internal) `getInitialSidebar()` — reads `localStorage['mihomo-yaml-sidebar']`
- (internal) `applyTheme()` — toggles `dark` class on `document.documentElement`

## 关键数据流
On store creation, `getInitialTheme` and `getInitialSidebar` hydrate from localStorage. `setTheme` writes back to localStorage and calls `applyTheme`, which adds or removes the `dark` CSS class on `<html>` (respecting `prefers-color-scheme` when set to `system`). `setSidebarWidth` also persists to localStorage. All other state is transient in-memory. The `applyTheme` helper is also called at module load to ensure the `<html>` class is correct on page load.

## 关联测试
- No dedicated or indirect UI store test currently exists
