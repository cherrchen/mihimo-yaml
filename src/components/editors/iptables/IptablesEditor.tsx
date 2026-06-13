import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, TextField } from '@/components/editors/shared/fields'

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
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-sm font-semibold">iptables 配置</h2>
      <p className="text-xs text-muted-foreground">Linux 平台专用 iptables 转发规则</p>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="启用">
          <BoolField value={ipt.enable ?? false} onChange={(v) => set('enable', v)} />
        </FieldWrapper>

        <FieldWrapper label="入站接口" description="inbound-interface">
          <TextField value={ipt['inbound-interface'] || ''} onChange={(v) => set('inbound-interface', v)} placeholder="eth0" />
        </FieldWrapper>

        <FieldWrapper label="DNS 重定向" description="dns-redirect">
          <BoolField value={ipt['dns-redirect'] ?? false} onChange={(v) => set('dns-redirect', v)} />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Bypass" description="bypass 地址列表">
        <TextField
          value={(ipt.bypass || []).join(', ')}
          onChange={(v) => set('bypass', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)}
          placeholder="输入地址，用逗号分隔"
        />
      </FieldWrapper>
    </div>
  )
}
