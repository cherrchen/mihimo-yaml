import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField } from '@/components/editors/shared/fields'
import { Plus, Trash2 } from 'lucide-react'
import type { TunnelConfig } from '@/schema/model'

export function TunnelsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const tunnels = config.tunnels || []

  const setTunnels = (updater: (ts: TunnelConfig[]) => TunnelConfig[]) => {
    updateConfig((draft) => {
      draft.tunnels = updater(draft.tunnels || [])
    })
  }

  const addTunnel = () => setTunnels((ts) => [...ts, { network: ['tcp', 'udp'], address: '', target: '', proxy: '' }])

  const updateTunnel = (i: number, key: keyof TunnelConfig, value: unknown) => {
    setTunnels((ts) => {
      const copy = [...ts]
      copy[i] = { ...copy[i], [key]: value }
      return copy
    })
  }

  const removeTunnel = (i: number) => {
    setTunnels((ts) => ts.filter((_, j) => j !== i))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">隧道</h2>
        <button type="button" onClick={addTunnel} className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <Plus className="size-3.5" /> 添加隧道
        </button>
      </div>

      <EditorSection title="端口转发" description="监听本地地址，并通过指定代理将流量转发到目标。" stashSupport={false}>
        <div className="space-y-3">
      {tunnels.map((tunnel, i) => (
        <div key={i} className="space-y-3 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">隧道 #{i + 1}</span>
            <button type="button" aria-label={`删除隧道 ${i + 1}`} onClick={() => removeTunnel(i)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldWrapper label="网络类型" help="指定隧道接受的传输协议，多个值使用逗号分隔。" yamlKey="tunnels[].network" example="tcp, udp">
              <TextField
                value={tunnel.network?.join(', ') || ''}
                onChange={(v) => updateTunnel(i, 'network', v.split(',').map((s) => s.trim()).filter(Boolean))}
                placeholder="tcp, udp"
              />
            </FieldWrapper>
            <FieldWrapper label="监听地址" help="设置本地监听的地址和端口。" yamlKey="tunnels[].address" example="0.0.0.0:8080">
              <TextField
                value={tunnel.address || ''}
                onChange={(v) => updateTunnel(i, 'address', v)}
                placeholder="0.0.0.0:8080"
              />
            </FieldWrapper>
            <FieldWrapper label="目标地址" help="设置流量最终转发到的地址和端口。" yamlKey="tunnels[].target" example="example.com:80">
              <TextField
                value={tunnel.target || ''}
                onChange={(v) => updateTunnel(i, 'target', v)}
                placeholder="example.com:80"
              />
            </FieldWrapper>
            <FieldWrapper label="转发代理" help="指定隧道流量经过的代理或代理组。" yamlKey="tunnels[].proxy" example="PROXY">
              <TextField
                value={tunnel.proxy || ''}
                onChange={(v) => updateTunnel(i, 'proxy', v)}
                placeholder="PROXY"
              />
            </FieldWrapper>
          </div>
        </div>
      ))}

      {tunnels.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <p className="text-xs text-muted-foreground">暂无隧道配置</p>
          <button type="button" onClick={addTunnel} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <Plus className="size-3" /> 添加第一条隧道
          </button>
        </div>
      )}
        </div>
      </EditorSection>
    </div>
  )
}
