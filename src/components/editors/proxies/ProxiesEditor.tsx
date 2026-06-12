import { useState } from 'react'
import { useConfigStore } from '@/store/config-store'
import { Plus, Trash2, Copy, Search } from 'lucide-react'
import { SelectField, TextField, NumberField, BoolField } from '@/components/editors/shared/fields'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { SensitiveField } from '@/components/editors/shared/SensitiveField'
import type { ProxyConfig } from '@/schema/model'
import { PROXY_TYPES, IP_VERSIONS, NETWORK_TYPES } from '@/lib/constants'

const PROXY_TYPE_LABELS: Record<string, string> = {
  direct: 'Direct', dns: 'DNS', reject: 'Reject', 'reject-drop': 'Reject Drop',
  compatible: 'Compatible', pass: 'Pass',
  ss: 'Shadowsocks', ssr: 'ShadowsocksR', snell: 'Snell',
  http: 'HTTP', socks: 'SOCKS5',
  vmess: 'VMess', vless: 'VLESS', trojan: 'Trojan',
  hysteria: 'Hysteria', hysteria2: 'Hysteria2', tuic: 'TUIC',
  wireguard: 'WireGuard', ssh: 'SSH',
  anytls: 'AnyTLS', mieru: 'Mieru', sudoku: 'Sudoku',
  tailscale: 'Tailscale', masque: 'MASQUE', trusttunnel: 'TrustTunnel', openvpn: 'OpenVPN',
}

export function ProxiesEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)
  const [search, setSearch] = useState('')

  const proxies = config.proxies || []

  const filtered = search
    ? proxies.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.type.toLowerCase().includes(search.toLowerCase()) ||
          (p.server || '').toLowerCase().includes(search.toLowerCase()),
      )
    : proxies

  const setProxies = (updater: (proxies: ProxyConfig[]) => ProxyConfig[]) => {
    updateConfig((draft) => {
      draft.proxies = updater(draft.proxies || [])
    })
  }

  const addProxy = () => {
    setProxies((ps) => [
      ...ps,
      { name: `proxy-${ps.length + 1}`, type: 'ss', server: '', port: 443 },
    ])
    setSelectedIdx(proxies.length)
  }

  const removeProxy = (idx: number) => {
    setProxies((ps) => ps.filter((_, i) => i !== idx))
    setSelectedIdx(Math.min(selectedIdx, proxies.length - 2))
  }

  const duplicateProxy = (idx: number) => {
    const copy = JSON.parse(JSON.stringify(proxies[idx])) as ProxyConfig
    copy.name = `${copy.name}-copy`
    setProxies((ps) => {
      const next = [...ps]
      next.splice(idx + 1, 0, copy)
      return next
    })
    setSelectedIdx(idx + 1)
  }

  const updateProxy = (idx: number, updater: (p: ProxyConfig) => void) => {
    updateConfig((draft) => {
      if (!draft.proxies) return
      const p = { ...draft.proxies[idx] }
      updater(p)
      draft.proxies[idx] = p
    })
  }

  return (
    <div className="p-6 flex h-full">
      {/* Left: Proxy List */}
      <div className="w-64 flex-shrink-0 border-r border-border pr-3 flex flex-col">
        <div className="relative mb-2">
          <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索节点..."
            className="w-full h-7 pl-7 pr-2 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          onClick={addProxy}
          className="mb-2 flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs hover:bg-primary/90"
        >
          <Plus className="size-3.5" />
          添加节点
        </button>

        <div className="flex-1 overflow-y-auto space-y-0.5">
          {filtered.map((proxy, i) => (
            <div
              key={`${proxy.name}-${i}`}
              onClick={() => setSelectedIdx(i)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer ${
                selectedIdx === i
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50 text-muted-foreground'
              }`}
            >
              <span className="text-[10px] w-6 shrink-0 text-muted-foreground">{i + 1}</span>
              <span className="truncate flex-1">{proxy.name}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {PROXY_TYPE_LABELS[proxy.type] || proxy.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Editor */}
      <div className="flex-1 pl-4 overflow-y-auto">
        {selectedIdx >= 0 && proxies[selectedIdx] ? (
          <ProxyDetailEditor
            proxy={proxies[selectedIdx]}
            onChange={(updater) => updateProxy(selectedIdx, updater)}
            onDelete={() => removeProxy(selectedIdx)}
            onDuplicate={() => duplicateProxy(selectedIdx)}
          />
        ) : (
          <p className="text-xs text-muted-foreground p-8 text-center">选择一个节点或添加新节点开始编辑</p>
        )}
      </div>
    </div>
  )
}

function ProxyDetailEditor({
  proxy,
  onChange,
  onDelete,
  onDuplicate,
}: {
  proxy: ProxyConfig
  onChange: (updater: (p: ProxyConfig) => void) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  return (
    <div className="space-y-4 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{proxy.name}</h3>
        <div className="flex items-center gap-1">
          <button onClick={onDuplicate} className="p-1 hover:bg-accent rounded" title="复制">
            <Copy className="size-3.5" />
          </button>
          <button onClick={onDelete} className="p-1 hover:bg-destructive/20 rounded text-destructive" title="删除">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Common fields */}
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="名称" required>
          <TextField
            value={proxy.name}
            onChange={(v) => onChange((p) => { p.name = v })}
            placeholder="代理名称 (唯一)"
          />
        </FieldWrapper>

        <FieldWrapper label="类型" required>
          <SelectField
            value={proxy.type}
            onChange={(v) => onChange((p) => { p.type = v })}
            options={PROXY_TYPES}
          />
        </FieldWrapper>

        <FieldWrapper label="服务器" description="server">
          <TextField
            value={proxy.server || ''}
            onChange={(v) => onChange((p) => { p.server = v })}
            placeholder="server.example.com"
          />
        </FieldWrapper>

        <FieldWrapper label="端口" description="port">
          <NumberField
            value={proxy.port}
            onChange={(v) => onChange((p) => { p.port = v })}
            placeholder="443"
            min={1}
            max={65535}
          />
        </FieldWrapper>

        <FieldWrapper label="UDP" description="是否启用 UDP 中继">
          <BoolField
            value={proxy.udp ?? false}
            onChange={(v) => onChange((p) => { p.udp = v })}
          />
        </FieldWrapper>

        <FieldWrapper label="IP 版本" description="ip-version" advanced>
          <SelectField
            value={proxy['ip-version'] || ''}
            onChange={(v) => onChange((p) => { p['ip-version'] = v })}
            options={IP_VERSIONS}
            placeholder="dual"
          />
        </FieldWrapper>
      </div>

      {/* Type-specific fields */}
      <TypeSpecificFields proxy={proxy} onChange={onChange} />

      {/* Advanced */}
      <DetailsSection title="高级选项" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="TFO" description="TCP Fast Open">
            <BoolField
              value={proxy.tfo ?? false}
              onChange={(v) => onChange((p) => { p.tfo = v })}
            />
          </FieldWrapper>

          <FieldWrapper label="MPTCP" description="TCP Multi Path">
            <BoolField
              value={proxy.mptcp ?? false}
              onChange={(v) => onChange((p) => { p.mptcp = v })}
            />
          </FieldWrapper>

          <FieldWrapper label="出站接口" description="interface-name">
            <TextField
              value={proxy['interface-name'] || ''}
              onChange={(v) => onChange((p) => { p['interface-name'] = v })}
              placeholder="eth0"
            />
          </FieldWrapper>

          <FieldWrapper label="路由标记" description="routing-mark (Linux)">
            <NumberField
              value={proxy['routing-mark']}
              onChange={(v) => onChange((p) => { p['routing-mark'] = v })}
              placeholder="0"
            />
          </FieldWrapper>

          <FieldWrapper label="Dialer Proxy" description="前级代理 (链式代理)">
            <TextField
              value={proxy['dialer-proxy'] || ''}
              onChange={(v) => onChange((p) => { p['dialer-proxy'] = v })}
              placeholder="入口节点"
            />
          </FieldWrapper>
        </div>
      </DetailsSection>

      {/* TLS Section */}
      <DetailsSection title="TLS 配置" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="TLS">
            <BoolField
              value={proxy.tls ?? false}
              onChange={(v) => onChange((p) => { p.tls = v })}
            />
          </FieldWrapper>

          <FieldWrapper label="SNI" description="TLS SNI">
            <TextField
              value={proxy.sni || proxy.servername || ''}
              onChange={(v) => onChange((p) => { p.sni = v })}
              placeholder="server.example.com"
            />
          </FieldWrapper>

          <FieldWrapper label="跳过证书验证" description="skip-cert-verify">
            <BoolField
              value={proxy['skip-cert-verify'] ?? false}
              onChange={(v) => onChange((p) => { p['skip-cert-verify'] = v })}
            />
          </FieldWrapper>

          <FieldWrapper label="客户端指纹" description="client-fingerprint (uTLS)">
            <SelectField
              value={proxy['client-fingerprint'] || ''}
              onChange={(v) => onChange((p) => { p['client-fingerprint'] = v })}
              options={['', 'chrome', 'firefox', 'safari', 'ios', 'android', 'edge', '360', 'qq', 'random']}
              placeholder="无"
            />
          </FieldWrapper>

          <FieldWrapper label="ALPN" description="ALPN 协议列表">
            <TextField
              value={proxy.alpn?.join(', ') || ''}
              onChange={(v) => onChange((p) => { p.alpn = v ? v.split(',').map((s) => s.trim()) : undefined })}
              placeholder="h2, http/1.1"
            />
          </FieldWrapper>
        </div>
      </DetailsSection>

      {/* SMUX Section */}
      <DetailsSection title="SMUX (多路复用)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="启用">
            <BoolField
              value={proxy.smux?.enabled ?? false}
              onChange={(v) => onChange((p) => {
                if (!p.smux) p.smux = {}
                p.smux.enabled = v
              })}
            />
          </FieldWrapper>

          <FieldWrapper label="协议">
            <SelectField
              value={proxy.smux?.protocol || ''}
              onChange={(v) => onChange((p) => {
                if (!p.smux) p.smux = {}
                p.smux.protocol = v
              })}
              options={['smux', 'yamux', 'h2mux']}
              placeholder="h2mux"
            />
          </FieldWrapper>

          <FieldWrapper label="最大连接数" description="max-connections">
            <NumberField
              value={proxy.smux?.['max-connections']}
              onChange={(v) => onChange((p) => {
                if (!p.smux) p.smux = {}
                p.smux['max-connections'] = v
              })}
              placeholder="4"
            />
          </FieldWrapper>

          <FieldWrapper label="Padding" description="启用 padding">
            <BoolField
              value={proxy.smux?.padding ?? false}
              onChange={(v) => onChange((p) => {
                if (!p.smux) p.smux = {}
                p.smux.padding = v
              })}
            />
          </FieldWrapper>
        </div>
      </DetailsSection>

      {/* Network / Transport */}
      <DetailsSection title="传输层 (Network)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="传输协议" description="network">
            <SelectField
              value={proxy.network || ''}
              onChange={(v) => onChange((p) => { p.network = v })}
              options={NETWORK_TYPES}
              placeholder="tcp"
            />
          </FieldWrapper>

          {proxy.network === 'ws' && (
            <FieldWrapper label="WS 路径" description="ws-opts.path">
              <TextField
                value={proxy['ws-opts']?.path || ''}
                onChange={(v) => onChange((p) => {
                  if (!p['ws-opts']) p['ws-opts'] = {}
                  p['ws-opts'].path = v
                })}
                placeholder="/"
              />
            </FieldWrapper>
          )}

          {proxy.network === 'grpc' && (
            <FieldWrapper label="gRPC 服务名" description="grpc-opts.grpc-service-name">
              <TextField
                value={proxy['grpc-opts']?.['grpc-service-name'] || ''}
                onChange={(v) => onChange((p) => {
                  if (!p['grpc-opts']) p['grpc-opts'] = {}
                  p['grpc-opts']['grpc-service-name'] = v
                })}
                placeholder="GunService"
              />
            </FieldWrapper>
          )}

          {proxy.network === 'h2' && (
            <FieldWrapper label="H2 路径" description="h2-opts.path">
              <TextField
                value={proxy['h2-opts']?.path || ''}
                onChange={(v) => onChange((p) => {
                  if (!p['h2-opts']) p['h2-opts'] = {}
                  p['h2-opts'].path = v
                })}
                placeholder="/"
              />
            </FieldWrapper>
          )}
        </div>
      </DetailsSection>
    </div>
  )
}

// === Type-specific fields ===

function TypeSpecificFields({
  proxy,
  onChange,
}: {
  proxy: ProxyConfig
  onChange: (updater: (p: ProxyConfig) => void) => void
}) {
  switch (proxy.type) {
    case 'ss':
      return <SSFields proxy={proxy} onChange={onChange} />
    case 'vmess':
      return <VMessFields proxy={proxy} onChange={onChange} />
    case 'vless':
      return <VLESSFields proxy={proxy} onChange={onChange} />
    case 'trojan':
      return <TrojanFields proxy={proxy} onChange={onChange} />
    case 'hysteria':
      return <HysteriaFields proxy={proxy} onChange={onChange} />
    case 'hysteria2':
      return <Hysteria2Fields proxy={proxy} onChange={onChange} />
    case 'tuic':
      return <TuicFields proxy={proxy} onChange={onChange} />
    case 'wireguard':
      return <WireGuardFields proxy={proxy} onChange={onChange} />
    case 'http':
    case 'socks':
      return <AuthFields proxy={proxy} onChange={onChange} />
    case 'snell':
      return <SnellFields proxy={proxy} onChange={onChange} />
    case 'ssh':
      return <SSHFields proxy={proxy} onChange={onChange} />
    default:
      return null
  }
}

function SSFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="加密方法" required description="cipher" example="aes-256-gcm">
        <SelectField
          value={proxy.cipher || ''}
          onChange={(v) => onChange((p) => { p.cipher = v })}
          options={['aes-128-gcm', 'aes-192-gcm', 'aes-256-gcm', 'chacha20-ietf-poly1305', 'xchacha20-ietf-poly1305', '2022-blake3-aes-128-gcm', '2022-blake3-aes-256-gcm', '2022-blake3-chacha20-poly1305']}
          placeholder="选择加密"
        />
      </FieldWrapper>
      <FieldWrapper label="密码" required sensitive>
        <SensitiveField value={proxy.password || ''} onChange={(v) => onChange((p) => { p.password = v })} label="密码" />
      </FieldWrapper>
      <FieldWrapper label="UDP over TCP" description="udp-over-tcp">
        <BoolField value={proxy['udp-over-tcp'] ?? false} onChange={(v) => onChange((p) => { p['udp-over-tcp'] = v })} />
      </FieldWrapper>
      <FieldWrapper label="Plugin" description="插件" advanced>
        <TextField value={proxy.plugin || ''} onChange={(v) => onChange((p) => { p.plugin = v })} placeholder="obfs" />
      </FieldWrapper>
    </div>
  )
}

function VMessFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="UUID" required sensitive>
        <SensitiveField value={proxy.uuid || ''} onChange={(v) => onChange((p) => { p.uuid = v })} label="UUID" />
      </FieldWrapper>
      <FieldWrapper label="Alter ID" description="alterId">
        <NumberField value={proxy.alterId} onChange={(v) => onChange((p) => { p.alterId = v })} placeholder="0" min={0} />
      </FieldWrapper>
      <FieldWrapper label="加密" description="security">
        <SelectField
          value={proxy.security || ''}
          onChange={(v) => onChange((p) => { p.security = v })}
          options={['auto', 'aes-128-gcm', 'chacha20-poly1305', 'none', 'zero']}
          placeholder="auto"
        />
      </FieldWrapper>
    </div>
  )
}

function VLESSFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="UUID" required sensitive>
        <SensitiveField value={proxy.uuid || ''} onChange={(v) => onChange((p) => { p.uuid = v })} label="UUID" />
      </FieldWrapper>
      <FieldWrapper label="Flow" description="xtls-rprx-vision">
        <TextField value={proxy.flow || ''} onChange={(v) => onChange((p) => { p.flow = v })} placeholder="xtls-rprx-vision" />
      </FieldWrapper>
    </div>
  )
}

function TrojanFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="密码" required sensitive>
        <SensitiveField value={proxy.password || ''} onChange={(v) => onChange((p) => { p.password = v })} label="密码" />
      </FieldWrapper>
    </div>
  )
}

function HysteriaFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="上传带宽" description="up">
        <TextField value={proxy.up || ''} onChange={(v) => onChange((p) => { p.up = v })} placeholder="50 Mbps" />
      </FieldWrapper>
      <FieldWrapper label="下载带宽" description="down">
        <TextField value={proxy.down || ''} onChange={(v) => onChange((p) => { p.down = v })} placeholder="100 Mbps" />
      </FieldWrapper>
      <FieldWrapper label="认证" sensitive>
        <SensitiveField value={proxy.auth || proxy['auth-str'] || ''} onChange={(v) => onChange((p) => { p.auth = v })} label="Auth" />
      </FieldWrapper>
      <FieldWrapper label="混淆密码" description="obfs">
        <TextField value={proxy.obfs || ''} onChange={(v) => onChange((p) => { p.obfs = v })} placeholder="obfs-password" />
      </FieldWrapper>
    </div>
  )
}

function Hysteria2Fields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="密码" required sensitive>
        <SensitiveField value={proxy.password || ''} onChange={(v) => onChange((p) => { p.password = v })} label="密码" />
      </FieldWrapper>
      <FieldWrapper label="上传带宽" description="up">
        <TextField value={proxy.up || ''} onChange={(v) => onChange((p) => { p.up = v })} placeholder="50 Mbps" />
      </FieldWrapper>
      <FieldWrapper label="下载带宽" description="down">
        <TextField value={proxy.down || ''} onChange={(v) => onChange((p) => { p.down = v })} placeholder="100 Mbps" />
      </FieldWrapper>
      <FieldWrapper label="混淆密码" description="obfs-password">
        <TextField value={proxy.obfs || ''} onChange={(v) => onChange((p) => { p.obfs = v })} placeholder="" />
      </FieldWrapper>
    </div>
  )
}

function TuicFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="UUID" required sensitive>
        <SensitiveField value={proxy.uuid || ''} onChange={(v) => onChange((p) => { p.uuid = v })} label="UUID" />
      </FieldWrapper>
      <FieldWrapper label="密码" required sensitive>
        <SensitiveField value={proxy.password || ''} onChange={(v) => onChange((p) => { p.password = v })} label="密码" />
      </FieldWrapper>
      <FieldWrapper label="拥塞控制" description="congestion-controller" advanced>
        <TextField value={proxy['congestion-controller'] || ''} onChange={(v) => onChange((p) => { p['congestion-controller'] = v })} placeholder="bbr" />
      </FieldWrapper>
      <FieldWrapper label="禁用 SNI" description="disable-sni" advanced>
        <BoolField value={proxy['disable-sni'] ?? false} onChange={(v) => onChange((p) => { p['disable-sni'] = v })} />
      </FieldWrapper>
    </div>
  )
}

function WireGuardFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="私钥" required sensitive>
        <SensitiveField value={proxy['private-key'] || ''} onChange={(v) => onChange((p) => { p['private-key'] = v })} label="私钥" />
      </FieldWrapper>
      <FieldWrapper label="公钥" required>
        <TextField value={proxy['public-key'] || ''} onChange={(v) => onChange((p) => { p['public-key'] = v })} placeholder="server public key" />
      </FieldWrapper>
      <FieldWrapper label="IP" required description="本地 IPv4">
        <TextField value={proxy.ip || ''} onChange={(v) => onChange((p) => { p.ip = v })} placeholder="10.0.0.2/32" />
      </FieldWrapper>
      <FieldWrapper label="IPv6" description="本地 IPv6">
        <TextField value={proxy.ipv6 || ''} onChange={(v) => onChange((p) => { p.ipv6 = v })} placeholder="fd00::2/128" />
      </FieldWrapper>
      <FieldWrapper label="MTU">
        <NumberField value={proxy.mtu} onChange={(v) => onChange((p) => { p.mtu = v })} placeholder="1420" />
      </FieldWrapper>
      <FieldWrapper label="Allowed IPs">
        <TextField value={proxy['allowed-ips']?.join(', ') || ''} onChange={(v) => onChange((p) => { p['allowed-ips'] = v ? v.split(',').map((s) => s.trim()) : undefined })} placeholder="0.0.0.0/0, ::/0" />
      </FieldWrapper>
    </div>
  )
}

function SSHFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="用户名" required>
        <TextField value={proxy.username || ''} onChange={(v) => onChange((p) => { p.username = v })} placeholder="root" />
      </FieldWrapper>
      <FieldWrapper label="密码 / 私钥" sensitive>
        <SensitiveField value={proxy.password || proxy['private-key'] || ''} onChange={(v) => {
          onChange((p) => { p.password = v })
        }} label="密码或私钥" />
      </FieldWrapper>
    </div>
  )
}

function SnellFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="PSK" required sensitive>
        <SensitiveField value={proxy.psk || ''} onChange={(v) => onChange((p) => { p.psk = v })} label="Pre-shared Key" />
      </FieldWrapper>
    </div>
  )
}

function AuthFields({ proxy, onChange }: { proxy: ProxyConfig; onChange: (updater: (p: ProxyConfig) => void) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldWrapper label="用户名">
        <TextField value={proxy.username || ''} onChange={(v) => onChange((p) => { p.username = v })} placeholder="user" />
      </FieldWrapper>
      <FieldWrapper label="密码" sensitive>
        <SensitiveField value={proxy.password || ''} onChange={(v) => onChange((p) => { p.password = v })} label="密码" />
      </FieldWrapper>
    </div>
  )
}

// === Details Section (collapsible) ===

function DetailsSection({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border rounded-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium hover:bg-accent"
      >
        {title}
        <span className="text-muted-foreground">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="px-3 pb-3 pt-1">{children}</div>}
    </div>
  )
}
