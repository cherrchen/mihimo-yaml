import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'
import { parseYaml } from '@/schema/yaml'

interface UrlImportProps {
  onClose: () => void
}

export function UrlImport({ onClose }: UrlImportProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [corsError, setCorsError] = useState(false)
  const [manualInput, setManualInput] = useState(false)
  const [manualYaml, setManualYaml] = useState('')
  const [proxyUrl, setProxyUrl] = useState('')
  const { setConfig, setConfigYaml, setConfigName } = useConfigStore()
  const { setActiveSection } = useUiStore()

  const handleFetch = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setCorsError(false)
    setContent('')
    try {
      // Try with optional CORS proxy
      const fetchUrl = proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url
      const resp = await fetch(fetchUrl, { signal: AbortSignal.timeout(15000) })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
      const text = await resp.text()
      setContent(text)
      setCorsError(false)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '未知错误'
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
        setCorsError(true)
        setError('CORS 错误：无法从浏览器直接拉取此 URL。请尝试以下方案：')
      } else {
        setError(`拉取失败: ${msg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleManualConfirm = () => {
    try {
      const config = parseYaml(manualYaml)
      setConfig(config)
      setConfigYaml(manualYaml)
      setConfigName('从URL导入')
      setActiveSection('general')
      onClose()
    } catch (e) {
      setError(`YAML 解析错误: ${e instanceof Error ? e.message : '未知'}`)
    }
  }

  const handleConfirm = () => {
    try {
      const config = parseYaml(content)
      setConfig(config)
      setConfigYaml(content)
      setConfigName('从URL导入')
      setActiveSection('general')
      onClose()
    } catch (e) {
      setError(`YAML 解析错误: ${e instanceof Error ? e.message : '未知'}`)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-medium">订阅 URL 或配置链接</label>
        <div className="flex gap-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/sub.yaml"
            className="flex-1 h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          />
          <Button size="sm" onClick={handleFetch} disabled={loading}>
            {loading ? '拉取中...' : '拉取'}
          </Button>
        </div>
      </div>

      {corsError && (
        <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              <p className="font-medium">{error}</p>
              <ol className="list-decimal ml-4 mt-1 space-y-1">
                <li>
                  <button onClick={() => setManualInput(true)} className="text-primary hover:underline">
                    手动粘贴 YAML 内容
                  </button>
                </li>
                <li>上传本地文件（切换回文件导入标签）</li>
                <li>使用 CORS 代理（见下方，注意隐私风险）</li>
              </ol>
            </div>
          </div>
          <details className="text-xs">
            <summary className="text-muted-foreground cursor-pointer">配置 CORS 代理 URL</summary>
            <div className="mt-2 flex gap-1">
              <input
                type="text"
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                placeholder="https://cors-proxy.example.com/"
                className="flex-1 h-7 rounded border border-input bg-background px-2 text-xs"
              />
              <Button size="sm" variant="outline" onClick={handleFetch} disabled={loading}>
                重试
              </Button>
            </div>
            <p className="text-[10px] text-red-500 mt-1">
              注意：CORS 代理可以看到你的完整配置文件内容，仅在你信任该代理服务时使用。
            </p>
          </details>
        </div>
      )}

      {error && !corsError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {content && (
        <div className="space-y-3">
          <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/50 p-3 text-xs font-mono whitespace-pre-wrap">
            {content.slice(0, 5000)}
            {content.length > 5000 && <span className="text-muted-foreground">... (已截断)</span>}
          </pre>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setContent('')}>取消</Button>
            <Button size="sm" onClick={handleConfirm}>确认导入</Button>
          </div>
        </div>
      )}

      {manualInput && (
        <div className="space-y-2">
          <textarea
            value={manualYaml}
            onChange={(e) => setManualYaml(e.target.value)}
            placeholder="在此粘贴 YAML 配置内容..."
            rows={12}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setManualInput(false)}>取消</Button>
            <Button size="sm" onClick={handleManualConfirm}>确认导入</Button>
          </div>
        </div>
      )}
    </div>
  )
}
