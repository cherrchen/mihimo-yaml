# hooks-external-controller

## 职责
React hook for communicating with a running mihomo instance's External Controller REST API.

## 文件
`src/hooks/useExternalController.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `useExternalController` | `function` | React hook returning controller state and actions |
| `getControllerSettings` | `function` | Reads controller URL and secret from localStorage |

```typescript
interface ProxyInfo {
  name: string
  type: string
  delay: number | null
  history: Array<{ time: string; delay: number }>
}

interface ControllerState {
  proxies: ProxyInfo[]
  delays: Record<string, number | null>
  loading: boolean
  error: string | null
  isConnected: boolean
}

function useExternalController(): ControllerState & {
  testConnection: () => Promise<void>
  testDelay: (proxyName: string) => Promise<number | null>
  clearError: () => void
}

function getControllerSettings(): { url: string; secret: string }
```

## 依赖
- `react` — `useState`, `useCallback`, `useRef`
- (internal) `buildHeaders()` — constructs `Content-Type` + optional `Authorization: Bearer` headers

## 关键数据流
`getControllerSettings` reads the controller URL and secret from localStorage keys `mihomo-yaml-controller` and `mihomo-yaml-controller-secret`. `testConnection` fetches `GET /proxies`, parses the response into `ProxyInfo[]` (extracting name, type, delay, and history), then sets `isConnected: true`. `testDelay` fetches `GET /proxies/:name/delay?url=...&timeout=5000` for a specific proxy and updates that proxy's delay in state. Both methods use `AbortController` to cancel in-flight requests on re-invocation. Errors are surfaced in `state.error` with user-friendly Chinese messages for connection failures or 401/403 auth errors. `clearError` resets the error field.

## 关联测试
- `src/__tests__/external-controller.test.ts`
