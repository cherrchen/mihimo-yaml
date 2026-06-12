import { useUiStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function SettingsPage() {
  const { theme, setTheme, setActiveSection } = useUiStore()
  const [corsProxy, setCorsProxy] = useState(() => localStorage.getItem('mihomo-yaml-cors-proxy') || '')
  const [controllerUrl, setControllerUrl] = useState(() => localStorage.getItem('mihomo-yaml-controller') || '')
  const [controllerSecret, setControllerSecret] = useState(() => localStorage.getItem('mihomo-yaml-controller-secret') || '')

  const saveSetting = (key: string, value: string) => {
    if (value) {
      localStorage.setItem(key, value)
    } else {
      localStorage.removeItem(key)
    }
  }

  return (
    <div className="p-4 max-w-xl">
      <button onClick={() => setActiveSection('dashboard')} className="text-xs text-muted-foreground hover:text-foreground mb-4 inline-block">
        &larr; 返回工作台
      </button>

      <h2 className="text-sm font-semibold mb-4">设置</h2>

      <div className="space-y-4">
        {/* Theme */}
        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium mb-2">主题</h3>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme(t)}
              >
                {t === 'light' ? '浅色' : t === 'dark' ? '深色' : '跟随系统'}
              </Button>
            ))}
          </div>
        </div>

        {/* CORS Proxy */}
        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium mb-2">CORS 代理 URL</h3>
          <p className="text-xs text-muted-foreground mb-2">
            用于绕过 URL 拉取时的 CORS 限制。仅在你信任代理服务时使用。
          </p>
          <input
            type="text"
            value={corsProxy}
            onChange={(e) => { setCorsProxy(e.target.value); saveSetting('mihomo-yaml-cors-proxy', e.target.value) }}
            placeholder="https://cors-proxy.example.com/"
            className="w-full h-8 rounded border border-input bg-background px-2 py-1 text-xs"
          />
          <p className="text-[10px] text-red-500 mt-1">
            隐私风险提示：CORS 代理可以查看你的完整配置文件内容。
          </p>
        </div>

        {/* External Controller */}
        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium mb-2">External Controller</h3>
          <p className="text-xs text-muted-foreground mb-2">
            可选连接本地 mihomo external-controller API 进行运行态测试。
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground">API 地址</label>
              <input
                type="text"
                value={controllerUrl}
                onChange={(e) => { setControllerUrl(e.target.value); saveSetting('mihomo-yaml-controller', e.target.value) }}
                placeholder="http://127.0.0.1:9090"
                className="w-full h-8 rounded border border-input bg-background px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">Secret</label>
              <input
                type="password"
                value={controllerSecret}
                onChange={(e) => { setControllerSecret(e.target.value); saveSetting('mihomo-yaml-controller-secret', e.target.value) }}
                placeholder="可选"
                className="w-full h-8 rounded border border-input bg-background px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium mb-2">关于</h3>
          <p className="text-xs text-muted-foreground">
            mihomo-yaml v0.1.0 · CC BY-NC 4.0
          </p>
        </div>
      </div>
    </div>
  )
}
