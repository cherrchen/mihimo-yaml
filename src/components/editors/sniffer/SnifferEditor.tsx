import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, BoolField } from '@/components/editors/shared/fields'

export function SnifferEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const sniffer = config.sniffer || {}
  const setSniffer = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.sniffer) draft.sniffer = {}
      ;(draft.sniffer as Record<string, unknown>)[key] = value
    })
  }

  return (
    <div className="p-4 max-w-2xl space-y-4">
      <h2 className="text-sm font-semibold">Sniffer (域名嗅探)</h2>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="启用" description="sniffer.enable">
          <BoolField value={sniffer.enable ?? false} onChange={(v) => setSniffer('enable', v)} />
        </FieldWrapper>
        <FieldWrapper label="覆盖目标" description="override-destination">
          <BoolField value={sniffer['override-destination'] ?? true} onChange={(v) => setSniffer('override-destination', v)} />
        </FieldWrapper>
        <FieldWrapper label="强制 DNS 映射" description="force-dns-mapping">
          <BoolField value={sniffer['force-dns-mapping'] ?? true} onChange={(v) => setSniffer('force-dns-mapping', v)} />
        </FieldWrapper>
        <FieldWrapper label="解析纯 IP" description="parse-pure-ip">
          <BoolField value={sniffer['parse-pure-ip'] ?? true} onChange={(v) => setSniffer('parse-pure-ip', v)} />
        </FieldWrapper>
        <FieldWrapper label="嗅探协议" description="sniffing (逗号分隔)" example="HTTP,TLS,QUIC">
          <TextField
            value={sniffer.sniffing?.join(', ') || ''}
            onChange={(v) => setSniffer('sniffing', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="HTTP, TLS, QUIC"
          />
        </FieldWrapper>
        <FieldWrapper label="强制域名" description="force-domain (逗号分隔)">
          <TextField
            value={sniffer['force-domain']?.join(', ') || ''}
            onChange={(v) => setSniffer('force-domain', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="example.com"
          />
        </FieldWrapper>
        <FieldWrapper label="跳过域名" description="skip-domain (逗号分隔)">
          <TextField
            value={sniffer['skip-domain']?.join(', ') || ''}
            onChange={(v) => setSniffer('skip-domain', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="skip.example.com"
          />
        </FieldWrapper>
        <FieldWrapper label="端口白名单" description="port-whitelist (逗号分隔)">
          <TextField
            value={sniffer['port-whitelist']?.join(', ') || ''}
            onChange={(v) => setSniffer('port-whitelist', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="80, 443"
          />
        </FieldWrapper>
      </div>
    </div>
  )
}
