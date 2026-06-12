import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, BoolField, SelectField } from '@/components/editors/shared/fields'
import { TUN_STACKS } from '@/lib/constants'

export function TunEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const tun = config.tun || {}
  const setTun = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.tun) draft.tun = {}
      ;(draft.tun as Record<string, unknown>)[key] = value
    })
  }

  return (
    <div className="p-4 max-w-2xl space-y-4">
      <h2 className="text-sm font-semibold">TUN 配置</h2>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="启用" description="tun.enable">
          <BoolField value={tun.enable ?? false} onChange={(v) => setTun('enable', v)} />
        </FieldWrapper>
        <FieldWrapper label="协议栈" description="tun.stack">
          <SelectField value={tun.stack || ''} onChange={(v) => setTun('stack', v)} options={TUN_STACKS} placeholder="gvisor" />
        </FieldWrapper>
        <FieldWrapper label="设备名" description="tun.device">
          <TextField value={tun.device || ''} onChange={(v) => setTun('device', v)} placeholder="" />
        </FieldWrapper>
        <FieldWrapper label="自动路由" description="tun.auto-route">
          <BoolField value={tun['auto-route'] ?? true} onChange={(v) => setTun('auto-route', v)} />
        </FieldWrapper>
        <FieldWrapper label="自动重定向" description="tun.auto-redirect (Linux)">
          <BoolField value={tun['auto-redirect'] ?? false} onChange={(v) => setTun('auto-redirect', v)} />
        </FieldWrapper>
        <FieldWrapper label="自动检测接口" description="tun.auto-detect-interface">
          <BoolField value={tun['auto-detect-interface'] ?? true} onChange={(v) => setTun('auto-detect-interface', v)} />
        </FieldWrapper>
        <FieldWrapper label="DNS 劫持" description="tun.dns-hijack (逗号分隔)" example="0.0.0.0:53">
          <TextField
            value={tun['dns-hijack']?.join(', ') || ''}
            onChange={(v) => setTun('dns-hijack', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="0.0.0.0:53"
          />
        </FieldWrapper>
        <FieldWrapper label="严格路由" description="tun.strict-route">
          <BoolField value={tun['strict-route'] ?? false} onChange={(v) => setTun('strict-route', v)} />
        </FieldWrapper>
        <FieldWrapper label="MTU">
          <NumberField value={tun.mtu} onChange={(v) => setTun('mtu', v)} placeholder="9000" />
        </FieldWrapper>
        <FieldWrapper label="GSO" advanced>
          <BoolField value={tun.gso ?? false} onChange={(v) => setTun('gso', v)} />
        </FieldWrapper>
        <FieldWrapper label="GSO 最大大小" advanced>
          <NumberField value={tun['gso-max-size']} onChange={(v) => setTun('gso-max-size', v)} placeholder="65536" />
        </FieldWrapper>
        <FieldWrapper label="端点独立 NAT" advanced>
          <BoolField value={tun['endpoint-independent-nat'] ?? false} onChange={(v) => setTun('endpoint-independent-nat', v)} />
        </FieldWrapper>
        <FieldWrapper label="路由地址" description="route-address (逗号分隔 CIDR)">
          <TextField
            value={tun['route-address']?.join(', ') || ''}
            onChange={(v) => setTun('route-address', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="10.0.0.0/8, 172.16.0.0/12"
          />
        </FieldWrapper>
        <FieldWrapper label="排除路由" description="route-exclude-address (逗号分隔)" advanced>
          <TextField
            value={tun['route-exclude-address']?.join(', ') || ''}
            onChange={(v) => setTun('route-exclude-address', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="192.168.0.0/16"
          />
        </FieldWrapper>
      </div>
    </div>
  )
}
