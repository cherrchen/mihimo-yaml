import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, TextField } from '@/components/editors/shared/fields'

export function EbpfEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const set = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.ebpf) draft.ebpf = {}
      ;(draft.ebpf as Record<string, unknown>)[key] = value
    })
  }

  const eb = config.ebpf || {}

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-sm font-semibold">ebpf 配置</h2>
      <p className="text-xs text-muted-foreground">Linux 平台专用 eBPF 包转发</p>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="启用">
          <BoolField value={eb.enable ?? false} onChange={(v) => set('enable', v)} />
        </FieldWrapper>

        <FieldWrapper label="BPF 文件系统路径" description="bpf-fs-path">
          <TextField value={eb['bpf-fs-path'] || ''} onChange={(v) => set('bpf-fs-path', v)} placeholder="/sys/fs/bpf" />
        </FieldWrapper>
      </div>

      <FieldWrapper label="自动重定向接口" description="auto-redir">
        <TextField
          value={(eb['auto-redir'] || []).join(', ')}
          onChange={(v) => set('auto-redir', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)}
          placeholder="eth0, wlan0"
        />
      </FieldWrapper>

      <FieldWrapper label="重定向到 TUN" description="redirect-to-tun">
        <TextField
          value={(eb['redirect-to-tun'] || []).join(', ')}
          onChange={(v) => set('redirect-to-tun', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)}
          placeholder="eth0, wlan0"
        />
      </FieldWrapper>
    </div>
  )
}
