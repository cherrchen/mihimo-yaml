import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField } from '@/components/editors/shared/fields'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

export function ExperimentalEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const exp = config.experimental || {}
  const setExp = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.experimental) draft.experimental = {}
      ;(draft.experimental as Record<string, unknown>)[key] = value
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">Experimental</h2>
      <EditorSection title="实验性网络选项" description="调整 QUIC 与 IP4P 的底层网络行为。">
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="禁用 QUIC GSO" help="关闭 QUIC 的 Generic Segmentation Offload；仅在兼容性问题排查时启用。" yamlKey="experimental.quic-go-disable-gso" defaultValue={false}>
          <BoolField value={exp['quic-go-disable-gso'] ?? false} onChange={(v) => setExp('quic-go-disable-gso', v)} />
        </FieldWrapper>
        <FieldWrapper label="禁用 QUIC ECN" help="关闭 QUIC 的显式拥塞通知功能。" yamlKey="experimental.quic-go-disable-ecn" defaultValue>
          <BoolField value={exp['quic-go-disable-ecn'] ?? true} onChange={(v) => setExp('quic-go-disable-ecn', v)} />
        </FieldWrapper>
        <FieldWrapper label="IP4P 地址转换" help="允许拨号器转换 IP4P 地址；仅在对应网络环境中启用。" yamlKey="experimental.dialer-ip4p-convert" defaultValue={false}>
          <BoolField value={exp['dialer-ip4p-convert'] ?? false} onChange={(v) => setExp('dialer-ip4p-convert', v)} />
        </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
