import { useState, useCallback, useRef } from 'react'

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

const PROBE_URL = 'https://www.gstatic.com/generate_204'
const DELAY_TIMEOUT = 5000

function getControllerSettings() {
  const url = (localStorage.getItem('mihomo-yaml-controller') || '').replace(/\/+$/, '')
  const secret = localStorage.getItem('mihomo-yaml-controller-secret') || ''
  return { url, secret }
}

function buildHeaders(secret: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`
  }
  return headers
}

export function useExternalController() {
  const [state, setState] = useState<ControllerState>({
    proxies: [],
    delays: {},
    loading: false,
    error: null,
    isConnected: false,
  })
  const abortRef = useRef<AbortController | null>(null)

  const testConnection = useCallback(async () => {
    const { url, secret } = getControllerSettings()
    if (!url) {
      setState((s) => ({ ...s, error: '未配置 External Controller 地址，请在设置页面填写', loading: false }))
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      const res = await fetch(`${url}/proxies`, {
        headers: buildHeaders(secret),
        signal: controller.signal,
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('认证失败，请检查 Secret 配置')
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      const rawProxies = data.proxies || {}

      const proxies: ProxyInfo[] = Object.entries(rawProxies).map(([name, info]) => {
        const p = info as { type?: string; history?: Array<{ time: string; delay: number }>; now?: string }
        return {
          name,
          type: p.type || 'unknown',
          delay: typeof p.now === 'string' ? parseInt(p.now, 10) : (typeof p.now === 'number' ? p.now : null),
          history: (p.history || []).slice(0, 10),
        }
      })

      const delays: Record<string, number | null> = {}
      for (const p of proxies) {
        delays[p.name] = p.delay
      }

      setState({ proxies, delays, loading: false, error: null, isConnected: true })
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      const message = err instanceof TypeError
        ? '无法连接到 External Controller，请检查地址是否正确且 mihomo 正在运行'
        : (err as Error).message
      setState((s) => ({ ...s, loading: false, error: message, isConnected: false }))
    }
  }, [])

  const testDelay = useCallback(async (proxyName: string): Promise<number | null> => {
    const { url, secret } = getControllerSettings()
    if (!url) return null

    try {
      const params = new URLSearchParams({ url: PROBE_URL, timeout: String(DELAY_TIMEOUT) })
      const res = await fetch(`${url}/proxies/${encodeURIComponent(proxyName)}/delay?${params}`, {
        headers: buildHeaders(secret),
      })
      if (!res.ok) return null
      const data = await res.json()
      const delay = typeof data.delay === 'number' ? data.delay : null

      setState((s) => ({
        ...s,
        delays: { ...s.delays, [proxyName]: delay },
        proxies: s.proxies.map((p) =>
          p.name === proxyName ? { ...p, delay } : p,
        ),
      }))

      return delay
    } catch {
      return null
    }
  }, [])

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
  }, [])

  return {
    ...state,
    testConnection,
    testDelay,
    clearError,
  }
}

export { getControllerSettings }
