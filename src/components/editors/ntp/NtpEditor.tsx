import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, BoolField } from '@/components/editors/shared/fields'

export function NtpEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const ntp = config.ntp || {}
  const setNtp = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.ntp) draft.ntp = {}
      ;(draft.ntp as Record<string, unknown>)[key] = value
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-sm font-semibold">NTP 配置</h2>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="启用" description="ntp.enable">
          <BoolField value={ntp.enable ?? false} onChange={(v) => setNtp('enable', v)} />
        </FieldWrapper>
        <FieldWrapper label="写系统时钟" description="ntp.write-to-system (需 root)">
          <BoolField value={ntp['write-to-system'] ?? false} onChange={(v) => setNtp('write-to-system', v)} />
        </FieldWrapper>
        <FieldWrapper label="服务器" description="ntp.server">
          <TextField value={ntp.server || ''} onChange={(v) => setNtp('server', v)} placeholder="time.apple.com" />
        </FieldWrapper>
        <FieldWrapper label="端口" description="ntp.port">
          <NumberField value={ntp.port} onChange={(v) => setNtp('port', v)} placeholder="123" />
        </FieldWrapper>
        <FieldWrapper label="同步间隔 (分钟)" description="ntp.interval">
          <NumberField value={ntp.interval} onChange={(v) => setNtp('interval', v)} placeholder="30" />
        </FieldWrapper>
        <FieldWrapper label="代理" description="ntp.dialer-proxy">
          <TextField value={ntp['dialer-proxy'] || ''} onChange={(v) => setNtp('dialer-proxy', v)} placeholder="DIRECT" />
        </FieldWrapper>
      </div>
    </div>
  )
}
