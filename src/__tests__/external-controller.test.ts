import { describe, it, expect, beforeEach } from 'vitest'
import { getControllerSettings } from '@/hooks/useExternalController'

describe('External Controller hook utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should read controller URL from localStorage', () => {
    localStorage.setItem('mihomo-yaml-controller', 'http://127.0.0.1:9090')
    const { url } = getControllerSettings()
    expect(url).toBe('http://127.0.0.1:9090')
  })

  it('should read controller secret from localStorage', () => {
    localStorage.setItem('mihomo-yaml-controller-secret', 'my-token')
    const { secret } = getControllerSettings()
    expect(secret).toBe('my-token')
  })

  it('should return empty strings when no settings configured', () => {
    const { url, secret } = getControllerSettings()
    expect(url).toBe('')
    expect(secret).toBe('')
  })

  it('should strip trailing slash from URL', () => {
    localStorage.setItem('mihomo-yaml-controller', 'http://127.0.0.1:9090/')
    const { url } = getControllerSettings()
    expect(url).toBe('http://127.0.0.1:9090')
  })

  it('should build correct proxy fetch URL from settings', () => {
    localStorage.setItem('mihomo-yaml-controller', 'http://example.com:9090')
    const { url } = getControllerSettings()
    expect(`${url}/proxies`).toBe('http://example.com:9090/proxies')
  })

  it('should build correct delay test URL for a proxy', () => {
    localStorage.setItem('mihomo-yaml-controller', 'http://example.com:9090')
    const { url } = getControllerSettings()
    const proxyName = 'MyProxy'
    const delayUrl = `${url}/proxies/${encodeURIComponent(proxyName)}/delay?url=https%3A%2F%2Fwww.gstatic.com%2Fgenerate_204&timeout=5000`
    expect(delayUrl).toContain('http://example.com:9090/proxies/MyProxy/delay')
    expect(delayUrl).toContain('gstatic.com')
  })
})
