import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, TextField } from '@/components/editors/shared/fields'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

export function IptablesEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const set = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.iptables) draft.iptables = {}
      ;(draft.iptables as Record<string, unknown>)[key] = value
    })
  }

  const ipt = config.iptables || {}

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">iptables</h2>
      <EditorSection title="透明代理转发" description="配置 Linux iptables 入站转发、DNS 重定向和绕过地址。" stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="启用 iptables" help="启用 mihomo 管理的 iptables 透明代理规则。" yamlKey="iptables.enable" defaultValue={false}>
          <BoolField value={ipt.enable ?? false} onChange={(v) => set('enable', v)} />
        </FieldWrapper>

        <FieldWrapper label="入站接口" help="指定接收透明代理流量的 Linux 网络接口。" yamlKey="iptables.inbound-interface" example="eth0">
          <TextField value={ipt['inbound-interface'] || ''} onChange={(v) => set('inbound-interface', v)} placeholder="eth0" />
        </FieldWrapper>

        <FieldWrapper label="DNS 重定向" help="将匹配的 DNS 请求重定向到代理处理。" yamlKey="iptables.dns-redirect" defaultValue={false}>
          <BoolField value={ipt['dns-redirect'] ?? false} onChange={(v) => set('dns-redirect', v)} />
        </FieldWrapper>

        <FieldWrapper label="绕过地址" help="这些地址不会进入 iptables 透明代理规则，多个值使用逗号分隔。" yamlKey="iptables.bypass" example="192.168.0.0/16">
        <TextField
          value={(ipt.bypass || []).join(', ')}
          onChange={(v) => set('bypass', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)}
          placeholder="输入地址，用逗号分隔"
        />
        </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
