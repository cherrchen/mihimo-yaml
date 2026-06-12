import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField } from '@/components/editors/shared/fields'

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
    <div className="p-4 max-w-2xl space-y-4">
      <h2 className="text-sm font-semibold">Experimental 配置</h2>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="禁用 QUIC GSO" description="quic-go-disable-gso">
          <BoolField value={exp['quic-go-disable-gso'] ?? false} onChange={(v) => setExp('quic-go-disable-gso', v)} />
        </FieldWrapper>
        <FieldWrapper label="禁用 QUIC ECN" description="quic-go-disable-ecn (默认 true)">
          <BoolField value={exp['quic-go-disable-ecn'] ?? true} onChange={(v) => setExp('quic-go-disable-ecn', v)} />
        </FieldWrapper>
        <FieldWrapper label="IP4P 地址转换" description="dialer-ip4p-convert">
          <BoolField value={exp['dialer-ip4p-convert'] ?? false} onChange={(v) => setExp('dialer-ip4p-convert', v)} />
        </FieldWrapper>
      </div>
    </div>
  )
}
