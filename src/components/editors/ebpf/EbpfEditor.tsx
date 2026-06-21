import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, TextField } from '@/components/editors/shared/fields'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

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
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">Linux eBPF转发设置</h2>
      <EditorSection title="eBPF 转发" description="启用 Linux eBPF 包转发并设置 BPF 文件系统位置。" stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="启用 eBPF" help="启用 mihomo 的 Linux eBPF 转发功能。" yamlKey="ebpf.enable" defaultValue={false}>
          <BoolField value={eb.enable ?? false} onChange={(v) => set('enable', v)} />
        </FieldWrapper>

        <FieldWrapper label="BPF 文件系统路径" help="指定已挂载的 BPF 文件系统目录。" yamlKey="ebpf.bpf-fs-path" example="/sys/fs/bpf">
          <TextField value={eb['bpf-fs-path'] || ''} onChange={(v) => set('bpf-fs-path', v)} placeholder="/sys/fs/bpf" />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="接口映射" description="指定自动重定向或转发到 TUN 的网络接口。" collapsible defaultOpen={false} stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
      <FieldWrapper label="自动重定向接口" help="对这些接口启用 eBPF 自动重定向，多个接口使用逗号分隔。" yamlKey="ebpf.auto-redir" example="eth0, wlan0">
        <TextField
          value={(eb['auto-redir'] || []).join(', ')}
          onChange={(v) => set('auto-redir', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)}
          placeholder="eth0, wlan0"
        />
      </FieldWrapper>

      <FieldWrapper label="重定向到 TUN" help="将这些接口的流量送入 TUN，多个接口使用逗号分隔。" yamlKey="ebpf.redirect-to-tun" example="eth0, wlan0">
        <TextField
          value={(eb['redirect-to-tun'] || []).join(', ')}
          onChange={(v) => set('redirect-to-tun', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)}
          placeholder="eth0, wlan0"
        />
      </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
