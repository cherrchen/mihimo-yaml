import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, BoolField } from '@/components/editors/shared/fields'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

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
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">NTP</h2>

      <EditorSection title="同步服务" description="配置时间服务器和常规同步周期。">
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="启用时间同步" help="启用 mihomo 内置的 NTP 客户端。" yamlKey="ntp.enable" defaultValue={false}>
          <BoolField value={ntp.enable ?? false} onChange={(v) => setNtp('enable', v)} />
        </FieldWrapper>
        <FieldWrapper label="时间服务器" help="指定提供时间信息的 NTP 服务器。" yamlKey="ntp.server" defaultValue="time.apple.com" example="time.apple.com">
          <TextField value={ntp.server || ''} onChange={(v) => setNtp('server', v)} placeholder="time.apple.com" />
        </FieldWrapper>
        <FieldWrapper label="服务器端口" help="指定 NTP 服务端口，通常无需修改。" yamlKey="ntp.port" defaultValue={123}>
          <NumberField value={ntp.port} onChange={(v) => setNtp('port', v)} placeholder="123" />
        </FieldWrapper>
        <FieldWrapper label="同步间隔" help="设置两次时间同步之间的间隔。单位：分钟。" yamlKey="ntp.interval" defaultValue={30}>
          <NumberField value={ntp.interval} onChange={(v) => setNtp('interval', v)} placeholder="30" />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="系统与路由" description="控制系统时钟写入和 NTP 流量出口。" collapsible defaultOpen={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="写入系统时钟" help="将同步后的时间写入系统时钟，运行环境需要相应权限。" yamlKey="ntp.write-to-system" defaultValue={false}>
          <BoolField value={ntp['write-to-system'] ?? false} onChange={(v) => setNtp('write-to-system', v)} />
        </FieldWrapper>
        <FieldWrapper label="拨号代理" help="指定 NTP 请求使用的代理；留空时使用默认路由。" yamlKey="ntp.dialer-proxy" example="DIRECT">
          <TextField value={ntp['dialer-proxy'] || ''} onChange={(v) => setNtp('dialer-proxy', v)} placeholder="DIRECT" />
        </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
