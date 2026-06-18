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
`getControllerSettings` reads the controller URL and secret from localStorage keys `mihomo-yaml-controller` and `mihomo-yaml-controller-secret`. `testConnection` cancels a previous connection request via `AbortController`, fetches `GET /proxies`, parses the response into `ProxyInfo[]`, and sets `isConnected: true`. Its connection/auth failures are exposed through `state.error`. `testDelay` separately fetches `GET /proxies/:name/delay?url=...&timeout=5000` and updates delay state; it has no abort signal and returns `null` on HTTP/network failure without setting `state.error`. `clearError` resets the error field.

## 关联测试
- `src/__tests__/external-controller.test.ts` (settings and URL construction only; hook fetch/state branches are not covered)
