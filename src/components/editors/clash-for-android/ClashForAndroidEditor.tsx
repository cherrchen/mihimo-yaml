import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, TextField } from '@/components/editors/shared/fields'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

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
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">Clash for Android</h2>
      <EditorSection title="Android 客户端行为" description="配置 Clash for Android 专用的 DNS 和界面显示选项。" stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="附加系统 DNS" help="将 Android 系统 DNS 追加到客户端的解析服务器列表。" yamlKey="clash-for-android.append-system-dns" defaultValue={false}>
          <BoolField value={cfa['append-system-dns'] ?? false} onChange={(v) => set('append-system-dns', v)} />
        </FieldWrapper>

        <FieldWrapper label="UI 副标题模式" help="设置客户端界面中配置副标题的格式，%s 会替换为原始名称。" yamlKey="clash-for-android.ui-subtitle-pattern" example="%s - Mihomo">
          <TextField value={cfa['ui-subtitle-pattern'] || ''} onChange={(v) => set('ui-subtitle-pattern', v)} placeholder="%s" />
        </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
