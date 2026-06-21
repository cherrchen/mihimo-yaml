import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, BoolField, SelectField } from '@/components/editors/shared/fields'
import { TUN_STACKS } from '@/lib/constants'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

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
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">TUN</h2>

      <EditorSection title="启用与路由" description="启用虚拟网卡并配置基础路由接管方式。" stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="启用 TUN" help="启用 TUN 虚拟网卡以接管系统流量。" yamlKey="tun.enable" defaultValue={false}>
          <BoolField value={tun.enable ?? false} onChange={(v) => setTun('enable', v)} />
        </FieldWrapper>
        <FieldWrapper label="协议栈" help="选择 TUN 使用的网络协议栈；gvisor 隔离性更强，system 使用系统协议栈。" yamlKey="tun.stack" defaultValue="gvisor">
          <SelectField value={tun.stack || ''} onChange={(v) => setTun('stack', v)} options={TUN_STACKS} emptyPlaceholder="未设置" />
        </FieldWrapper>
        <FieldWrapper label="设备名" help="指定创建的 TUN 设备名称；留空时由内核选择。" yamlKey="tun.device" example="Meta">
          <TextField value={tun.device || ''} onChange={(v) => setTun('device', v)} placeholder="" />
        </FieldWrapper>
        <FieldWrapper label="自动路由" help="自动写入系统路由，使流量进入 TUN。" yamlKey="tun.auto-route" defaultValue>
          <BoolField value={tun['auto-route'] ?? true} onChange={(v) => setTun('auto-route', v)} />
        </FieldWrapper>
        <FieldWrapper label="自动检测接口" help="自动选择系统的默认出站网络接口。" yamlKey="tun.auto-detect-interface" defaultValue>
          <BoolField value={tun['auto-detect-interface'] ?? true} onChange={(v) => setTun('auto-detect-interface', v)} />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="DNS 与路由范围" description="控制 DNS 劫持、自定义路由和防泄漏行为。" collapsible defaultOpen={false} stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="DNS 劫持" help="将指定地址上的 DNS 请求送入 mihomo，多个地址使用逗号分隔。" yamlKey="tun.dns-hijack" example="0.0.0.0:53">
          <TextField
            value={tun['dns-hijack']?.join(', ') || ''}
            onChange={(v) => setTun('dns-hijack', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="0.0.0.0:53"
          />
        </FieldWrapper>
        <FieldWrapper label="严格路由" help="收紧系统路由以减少流量绕过 TUN 的可能。" yamlKey="tun.strict-route" defaultValue={false}>
          <BoolField value={tun['strict-route'] ?? false} onChange={(v) => setTun('strict-route', v)} />
        </FieldWrapper>
        <FieldWrapper label="路由地址" help="仅将这些 CIDR 范围交给 TUN 路由，多个值使用逗号分隔。" yamlKey="tun.route-address" example="10.0.0.0/8, 172.16.0.0/12">
          <TextField
            value={tun['route-address']?.join(', ') || ''}
            onChange={(v) => setTun('route-address', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="10.0.0.0/8, 172.16.0.0/12"
          />
        </FieldWrapper>
        <FieldWrapper label="排除路由" help="这些 CIDR 范围绕过 TUN 路由，多个值使用逗号分隔。" yamlKey="tun.route-exclude-address" example="192.168.0.0/16">
          <TextField
            value={tun['route-exclude-address']?.join(', ') || ''}
            onChange={(v) => setTun('route-exclude-address', v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])}
            placeholder="192.168.0.0/16"
          />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="Linux 重定向" description="使用 Linux nftables 自动重定向流量。" collapsible defaultOpen={false} stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="自动重定向" help="在 Linux 上自动配置 nftables 规则以提高转发性能。" yamlKey="tun.auto-redirect" defaultValue={false}>
          <BoolField value={tun['auto-redirect'] ?? false} onChange={(v) => setTun('auto-redirect', v)} />
        </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="性能与 NAT" description="调整 MTU、分段卸载和 NAT 映射方式。" collapsible defaultOpen={false} stashSupport={false}>
        <div className={FIELD_GRID_CLASS}>
        <FieldWrapper label="MTU" help="设置 TUN 设备的最大传输单元。" yamlKey="tun.mtu" defaultValue={9000}>
          <NumberField value={tun.mtu} onChange={(v) => setTun('mtu', v)} placeholder="9000" />
        </FieldWrapper>
        <FieldWrapper label="GSO" help="启用 Generic Segmentation Offload 以减少大流量场景下的处理开销。" yamlKey="tun.gso" defaultValue={false}>
          <BoolField value={tun.gso ?? false} onChange={(v) => setTun('gso', v)} />
        </FieldWrapper>
        <FieldWrapper label="GSO 最大大小" help="限制单个 GSO 数据块的最大字节数。" yamlKey="tun.gso-max-size" defaultValue={65536}>
          <NumberField value={tun['gso-max-size']} onChange={(v) => setTun('gso-max-size', v)} placeholder="65536" />
        </FieldWrapper>
        <FieldWrapper label="端点独立 NAT" help="为 UDP 使用端点独立的 NAT 映射。" yamlKey="tun.endpoint-independent-nat" defaultValue={false}>
          <BoolField value={tun['endpoint-independent-nat'] ?? false} onChange={(v) => setTun('endpoint-independent-nat', v)} />
        </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
