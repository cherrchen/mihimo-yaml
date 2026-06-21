import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, BoolField } from '@/components/editors/shared/fields'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

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
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">Sniffer</h2>
      <EditorSection title="基本嗅探" description="启用域名嗅探并决定如何使用识别出的目标域名。" stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="启用域名嗅探" help="从连接流量中识别真实域名，以便应用域名规则。" yamlKey="sniffer.enable" defaultValue={false}>
          <BoolField value={sniffer.enable ?? false} onChange={(v) => setSniffer('enable', v)} />
        </FieldWrapper>
        <FieldWrapper label="覆盖连接目标" help="使用嗅探到的域名替换原始连接目标。" yamlKey="sniffer.override-destination" defaultValue>
          <BoolField value={sniffer['override-destination'] ?? true} onChange={(v) => setSniffer('override-destination', v)} />
        </FieldWrapper>
        <FieldWrapper label="强制 DNS 映射" help="对 redir-host 流量强制执行 DNS 映射嗅探。" yamlKey="sniffer.force-dns-mapping" defaultValue>
          <BoolField value={sniffer['force-dns-mapping'] ?? true} onChange={(v) => setSniffer('force-dns-mapping', v)} />
        </FieldWrapper>
        <FieldWrapper label="解析纯 IP" help="连接目标只有 IP 地址时也尝试识别域名。" yamlKey="sniffer.parse-pure-ip" defaultValue>
          <BoolField value={sniffer['parse-pure-ip'] ?? true} onChange={(v) => setSniffer('parse-pure-ip', v)} />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="协议与端口" description="限制参与嗅探的协议和目标端口。" collapsible defaultOpen={false} stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="嗅探协议" help="指定允许嗅探的协议，多个值使用逗号分隔。" yamlKey="sniffer.sniffing" example="HTTP, TLS, QUIC">
          <TextField
            value={sniffer.sniffing?.join(', ') || ''}
            onChange={(v) => setSniffer('sniffing', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="HTTP, TLS, QUIC"
          />
        </FieldWrapper>
        <FieldWrapper label="端口白名单" help="只嗅探这些目标端口，多个端口使用逗号分隔。" yamlKey="sniffer.port-whitelist" example="80, 443">
          <TextField
            value={sniffer['port-whitelist']?.join(', ') || ''}
            onChange={(v) => setSniffer('port-whitelist', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="80, 443"
          />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="域名例外" description="指定必须嗅探或应跳过的域名。" collapsible defaultOpen={false} stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="强制嗅探域名" help="这些域名始终执行嗅探，多个值使用逗号分隔。" yamlKey="sniffer.force-domain" example="example.com">
          <TextField
            value={sniffer['force-domain']?.join(', ') || ''}
            onChange={(v) => setSniffer('force-domain', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="example.com"
          />
        </FieldWrapper>
        <FieldWrapper label="跳过嗅探域名" help="这些域名不执行嗅探，多个值使用逗号分隔。" yamlKey="sniffer.skip-domain" example="skip.example.com">
          <TextField
            value={sniffer['skip-domain']?.join(', ') || ''}
            onChange={(v) => setSniffer('skip-domain', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="skip.example.com"
          />
        </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
