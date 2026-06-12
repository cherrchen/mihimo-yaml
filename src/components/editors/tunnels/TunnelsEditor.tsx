import { useConfigStore } from '@/store/config-store'
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
    <div className="p-4 max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Tunnels (隧道)</h2>
        <button onClick={addTunnel} className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          <Plus className="size-3.5" /> 添加隧道
        </button>
      </div>

      {tunnels.map((tunnel, i) => (
        <div key={i} className="border border-border rounded-md p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">隧道 #{i + 1}</span>
            <button onClick={() => removeTunnel(i)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldWrapper label="网络类型" description="network (tcp/udp)">
              <TextField
                value={tunnel.network?.join(', ') || ''}
                onChange={(v) => updateTunnel(i, 'network', v.split(',').map((s) => s.trim()).filter(Boolean))}
                placeholder="tcp, udp"
              />
            </FieldWrapper>
            <FieldWrapper label="监听地址" description="address">
              <TextField
                value={tunnel.address || ''}
                onChange={(v) => updateTunnel(i, 'address', v)}
                placeholder="0.0.0.0:8080"
              />
            </FieldWrapper>
            <FieldWrapper label="目标地址" description="target">
              <TextField
                value={tunnel.target || ''}
                onChange={(v) => updateTunnel(i, 'target', v)}
                placeholder="example.com:80"
              />
            </FieldWrapper>
            <FieldWrapper label="代理" description="proxy">
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
        <p className="text-xs text-muted-foreground p-4 text-center">暂无隧道配置</p>
      )}
    </div>
  )
}
