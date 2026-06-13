import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, TextField } from '@/components/editors/shared/fields'

export function ClashForAndroidEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const set = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft['clash-for-android']) draft['clash-for-android'] = {}
      ;(draft['clash-for-android'] as Record<string, unknown>)[key] = value
    })
  }

  const cfa = config['clash-for-android'] || {}

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-sm font-semibold">Clash for Android 配置</h2>
      <p className="text-xs text-muted-foreground">安卓客户端专用配置项</p>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="附加系统 DNS" description="append-system-dns">
          <BoolField value={cfa['append-system-dns'] ?? false} onChange={(v) => set('append-system-dns', v)} />
        </FieldWrapper>

        <FieldWrapper label="UI 副标题模式" description="ui-subtitle-pattern" example="%s - Mihomo">
          <TextField value={cfa['ui-subtitle-pattern'] || ''} onChange={(v) => set('ui-subtitle-pattern', v)} placeholder="%s" />
        </FieldWrapper>
      </div>
    </div>
  )
}
