import { useState } from 'react'
import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, BoolField, SelectField } from '@/components/editors/shared/fields'
import { PROVIDER_TYPES, IP_VERSIONS } from '@/lib/constants'
import { Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import type { ProxyProviderConfig } from '@/schema/model'
import { Button } from '@/components/ui/button'

export function ProxyProvidersEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  const providers = config['proxy-providers'] || {}

  const setProvider = (name: string, provider: ProxyProviderConfig | undefined) => {
    updateConfig((draft) => {
      if (!draft['proxy-providers']) draft['proxy-providers'] = {}
      if (provider === undefined) {
        delete draft['proxy-providers'][name]
      } else {
        draft['proxy-providers'][name] = provider
      }
    })
  }

  const addProvider = () => {
    const name = `provider-${Object.keys(providers).length + 1}`
    setProvider(name, { type: 'http', interval: 3600 })
    setSelectedProvider(name)
  }

  return (
    <div className="p-4 flex h-full">
      <div className="w-56 flex-shrink-0 border-r border-border pr-3 flex flex-col">
        <button onClick={addProvider} className="mb-2 flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          <Plus className="size-3.5" /> 添加 Provider
        </button>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {Object.keys(providers).map((name) => (
            <div
              key={name}
              onClick={() => setSelectedProvider(name)}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${
                selectedProvider === name ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            >
              <div className="font-medium truncate">{name}</div>
              <div className="text-[10px] text-muted-foreground">{providers[name].type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 pl-4 overflow-y-auto max-w-lg">
        {selectedProvider && providers[selectedProvider] ? (
          <ProviderDetailEditor
            name={selectedProvider}
            provider={providers[selectedProvider]}
            onChange={(p) => setProvider(selectedProvider, p)}
            onDelete={() => {
              setProvider(selectedProvider, undefined)
              setSelectedProvider('')
            }}
          />
        ) : (
          <p className="text-xs text-muted-foreground p-8 text-center">选择或添加 Proxy Provider</p>
        )}
      </div>
    </div>
  )
}

function ProviderDetailEditor({
  name,
  provider,
  onChange,
  onDelete,
}: {
  name: string
  provider: ProxyProviderConfig
  onChange: (p: ProxyProviderConfig) => void
  onDelete: () => void
}) {
  const [fetchResult, setFetchResult] = useState<string>('')
  const [fetchError, setFetchError] = useState('')
  const [fetching, setFetching] = useState(false)

  const handleFetch = async () => {
    if (!provider.url) return
    setFetching(true)
    setFetchError('')
    setFetchResult('')
    try {
      const resp = await fetch(provider.url, { signal: AbortSignal.timeout(15000) })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const text = await resp.text()
      setFetchResult(text.slice(0, 3000))
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : '拉取失败')
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{name}</h3>
        <button onClick={onDelete} className="p-1 hover:bg-destructive/20 rounded text-destructive">
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="类型" required>
          <SelectField value={provider.type} onChange={(v) => onChange({ ...provider, type: v })} options={PROVIDER_TYPES} />
        </FieldWrapper>
        <FieldWrapper label="更新间隔 (秒)">
          <NumberField value={provider.interval} onChange={(v) => onChange({ ...provider, interval: v })} placeholder="3600" />
        </FieldWrapper>
      </div>

      {provider.type === 'http' && (
        <>
          <FieldWrapper label="URL">
            <div className="flex gap-1">
              <TextField value={provider.url || ''} onChange={(v) => onChange({ ...provider, url: v })} placeholder="https://..." />
              <Button variant="outline" size="sm" onClick={handleFetch} disabled={fetching || !provider.url}>
                <RefreshCw className={`size-3.5 ${fetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </FieldWrapper>

          {fetchError && (
            <div className="flex items-start gap-2 rounded-md bg-red-500/10 border border-red-500/30 p-2 text-xs text-red-600">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">拉取失败</p>
                <p>{fetchError}</p>
              </div>
            </div>
          )}

          {fetchResult && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">拉取预览 ({fetchResult.split('\n').length} 行)</span>
              </div>
              <pre className="max-h-32 overflow-auto rounded-md border border-border bg-muted/50 p-2 text-[10px] font-mono">{fetchResult}</pre>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="路径" advanced>
          <TextField value={provider.path || ''} onChange={(v) => onChange({ ...provider, path: v })} placeholder="./providers/xxx.yaml" />
        </FieldWrapper>
        <FieldWrapper label="下载代理" advanced>
          <TextField value={provider.proxy || ''} onChange={(v) => onChange({ ...provider, proxy: v })} placeholder="DIRECT" />
        </FieldWrapper>
        <FieldWrapper label="大小限制 (字节)" advanced>
          <NumberField value={provider['size-limit']} onChange={(v) => onChange({ ...provider, 'size-limit': v })} placeholder="0" />
        </FieldWrapper>
        <FieldWrapper label="筛选 (正则)" advanced>
          <TextField value={provider.filter || ''} onChange={(v) => onChange({ ...provider, filter: v })} placeholder=".*HK.*" />
        </FieldWrapper>
        <FieldWrapper label="排除筛选" advanced>
          <TextField value={provider['exclude-filter'] || ''} onChange={(v) => onChange({ ...provider, 'exclude-filter': v })} placeholder=".*过期.*" />
        </FieldWrapper>
        <FieldWrapper label="排除类型" advanced>
          <TextField value={provider['exclude-type'] || ''} onChange={(v) => onChange({ ...provider, 'exclude-type': v })} placeholder="ss|ssr" />
        </FieldWrapper>
      </div>

      {/* Health Check */}
      <FieldWrapper label="健康检查">
        <div className="grid grid-cols-2 gap-3 border border-border rounded-md p-3">
          <FieldWrapper label="启用">
            <BoolField value={provider['health-check']?.enable ?? false} onChange={(v) => onChange({ ...provider, 'health-check': { ...provider['health-check'], enable: v } })} />
          </FieldWrapper>
          <FieldWrapper label="URL">
            <TextField value={provider['health-check']?.url || ''} onChange={(v) => onChange({ ...provider, 'health-check': { ...provider['health-check'], url: v } })} placeholder="https://..." />
          </FieldWrapper>
          <FieldWrapper label="间隔 (秒)">
            <NumberField value={provider['health-check']?.interval} onChange={(v) => onChange({ ...provider, 'health-check': { ...provider['health-check'], interval: v } })} placeholder="300" />
          </FieldWrapper>
          <FieldWrapper label="延迟检查">
            <BoolField value={provider['health-check']?.lazy ?? true} onChange={(v) => onChange({ ...provider, 'health-check': { ...provider['health-check'], lazy: v } })} />
          </FieldWrapper>
        </div>
      </FieldWrapper>

      {/* Override */}
      <FieldWrapper label="覆盖设置 (Override)">
        <div className="grid grid-cols-2 gap-3 border border-border rounded-md p-3">
          <FieldWrapper label="名称前缀">
            <TextField value={provider.override?.['additional-prefix'] || ''} onChange={(v) => onChange({ ...provider, override: { ...provider.override, 'additional-prefix': v } })} placeholder="[前缀]" />
          </FieldWrapper>
          <FieldWrapper label="名称后缀">
            <TextField value={provider.override?.['additional-suffix'] || ''} onChange={(v) => onChange({ ...provider, override: { ...provider.override, 'additional-suffix': v } })} placeholder="[后缀]" />
          </FieldWrapper>
          <FieldWrapper label="UDP">
            <BoolField value={provider.override?.udp ?? false} onChange={(v) => onChange({ ...provider, override: { ...provider.override, udp: v } })} />
          </FieldWrapper>
          <FieldWrapper label="TFO">
            <BoolField value={provider.override?.tfo ?? false} onChange={(v) => onChange({ ...provider, override: { ...provider.override, tfo: v } })} />
          </FieldWrapper>
          <FieldWrapper label="跳过证书验证">
            <BoolField value={provider.override?.['skip-cert-verify'] ?? false} onChange={(v) => onChange({ ...provider, override: { ...provider.override, 'skip-cert-verify': v } })} />
          </FieldWrapper>
          <FieldWrapper label="Dialer Proxy">
            <TextField value={provider.override?.['dialer-proxy'] || ''} onChange={(v) => onChange({ ...provider, override: { ...provider.override, 'dialer-proxy': v } })} placeholder="" />
          </FieldWrapper>
          <FieldWrapper label="IP 版本">
            <SelectField value={provider.override?.['ip-version'] || ''} onChange={(v) => onChange({ ...provider, override: { ...provider.override, 'ip-version': v } })} options={['', ...IP_VERSIONS]} placeholder="不变" />
          </FieldWrapper>
        </div>
      </FieldWrapper>
    </div>
  )
}
