import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { DNS_ENHANCED_MODES, DNS_CACHE_ALGORITHMS, DNS_FAKE_IP_FILTER_MODES } from '@/lib/constants'
import { Plus, Trash2, GripVertical } from 'lucide-react'

export function DnsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const dns = config.dns || {}
  const setDns = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.dns) draft.dns = {}
      ;(draft.dns as Record<string, unknown>)[key] = value
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-sm font-semibold">DNS 配置</h2>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="启用 DNS" description="dns.enable">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dns.enable ?? false}
              onChange={(e) => setDns('enable', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="增强模式" description="dns.enhanced-mode" stashSupport={false}>
          <select
            value={dns['enhanced-mode'] || ''}
            onChange={(e) => setDns('enhanced-mode', e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          >
            <option value="">选择模式</option>
            {DNS_ENHANCED_MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label="DNS 监听" description="dns.listen" example="0.0.0.0:53">
          <input
            type="text"
            value={dns.listen || ''}
            onChange={(e) => setDns('listen', e.target.value)}
            placeholder="0.0.0.0:53"
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label="IPv6 解析" description="dns.ipv6 (AAAA 记录)" stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dns.ipv6 ?? false}
              onChange={(e) => setDns('ipv6', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="缓存算法" description="dns.cache-algorithm" advanced>
          <select
            value={dns['cache-algorithm'] || ''}
            onChange={(e) => setDns('cache-algorithm', e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          >
            <option value="">lru</option>
            {DNS_CACHE_ALGORITHMS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label="Prefer HTTP/3" description="dns.prefer-h3 (DOH 优先 H3)" advanced>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dns['prefer-h3'] ?? false}
              onChange={(e) => setDns('prefer-h3', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        {dns['enhanced-mode'] === 'fake-ip' && (
          <>
            <FieldWrapper label="Fake IP 范围" description="dns.fake-ip-range" stashSupport={false}>
              <input
                type="text"
                value={dns['fake-ip-range'] || '198.18.0.1/16'}
                onChange={(e) => setDns('fake-ip-range', e.target.value)}
                placeholder="198.18.0.1/16"
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
            </FieldWrapper>

            <FieldWrapper label="Fake IP TTL" description="dns.fake-ip-ttl" advanced>
              <input
                type="number"
                value={dns['fake-ip-ttl'] ?? ''}
                onChange={(e) => setDns('fake-ip-ttl', Number(e.target.value))}
                placeholder="1"
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
            </FieldWrapper>

            <FieldWrapper label="Fake IP 过滤模式" description="dns.fake-ip-filter-mode" advanced stashSupport={false}>
              <select
                value={dns['fake-ip-filter-mode'] || ''}
                onChange={(e) => setDns('fake-ip-filter-mode', e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="">选择模式</option>
                {DNS_FAKE_IP_FILTER_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FieldWrapper>
          </>
        )}
      </div>

      {/* Nameservers */}
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">DNS 服务器</h3>

      <FieldWrapper label="默认 DNS 服务器" description="dns.default-nameserver (仅 IP)" example="223.5.5.5, 119.29.29.29">
        <StringListEditor
          value={dns['default-nameserver'] || []}
          onChange={(v) => setDns('default-nameserver', v)}
          placeholder="223.5.5.5"
        />
      </FieldWrapper>

      <FieldWrapper label="NameServer" description="dns.nameserver" example="https://doh.pub/dns-query">
        <StringListEditor
          value={dns.nameserver || []}
          onChange={(v) => setDns('nameserver', v)}
          placeholder="https://doh.pub/dns-query"
        />
      </FieldWrapper>

      <FieldWrapper label="Fallback" description="dns.fallback (国外 DNS)" stashSupport={false}>
        <StringListEditor
          value={dns.fallback || []}
          onChange={(v) => setDns('fallback', v)}
          placeholder="https://dns.cloudflare.com/dns-query"
        />
      </FieldWrapper>

      <FieldWrapper label="代理 DNS 服务器" description="dns.proxy-server-nameserver" advanced stashSupport={false}>
        <StringListEditor
          value={dns['proxy-server-nameserver'] || []}
          onChange={(v) => setDns('proxy-server-nameserver', v)}
          placeholder="https://doh.pub/dns-query"
        />
      </FieldWrapper>

      <FieldWrapper label="直连 DNS 服务器" description="dns.direct-nameserver" advanced stashSupport={false}>
        <StringListEditor
          value={dns['direct-nameserver'] || []}
          onChange={(v) => setDns('direct-nameserver', v)}
          placeholder="223.5.5.5"
        />
      </FieldWrapper>

      {/* Nameserver Policy */}
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">DNS 策略</h3>
      <FieldWrapper label="NameServer Policy" description="dns.nameserver-policy (按域名的 DNS 策略)">
        <NameserverPolicyEditor
          value={dns['nameserver-policy'] || {}}
          onChange={(v) => setDns('nameserver-policy', v)}
        />
      </FieldWrapper>

      {/* Fallback Filter */}
      {dns.fallback && dns.fallback.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Fallback 过滤</h3>
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="GeoIP 过滤" description="fallback-filter.geoip" stashSupport={false}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dns['fallback-filter']?.geoip ?? true}
                  onChange={(e) => {
                    setDns('fallback-filter', { ...dns['fallback-filter'], geoip: e.target.checked })
                  }}
                  className="size-4 rounded border-input"
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="GeoIP 国家代码" description="fallback-filter.geoip-code" stashSupport={false}>
              <input
                type="text"
                value={dns['fallback-filter']?.['geoip-code'] || 'CN'}
                onChange={(e) => {
                  setDns('fallback-filter', { ...dns['fallback-filter'], 'geoip-code': e.target.value })
                }}
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label="污染 GeoSite 分类" description="fallback-filter.geosite" advanced stashSupport={false}>
            <StringListEditor
              value={dns['fallback-filter']?.geosite || []}
              onChange={(v) => setDns('fallback-filter', { ...dns['fallback-filter'], geosite: v })}
              placeholder="gfw"
            />
          </FieldWrapper>

          <FieldWrapper label="污染域名" description="fallback-filter.domain" advanced stashSupport={false}>
            <StringListEditor
              value={dns['fallback-filter']?.domain || []}
              onChange={(v) => setDns('fallback-filter', { ...dns['fallback-filter'], domain: v })}
              placeholder="example.com"
            />
          </FieldWrapper>
        </>
      )}
    </div>
  )
}

// === Helper sub-components ===

function StringListEditor({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <GripVertical className="size-3 text-muted-foreground shrink-0 cursor-grab" />
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...value]
              next[i] = e.target.value
              onChange(next)
            }}
            className="flex-1 h-7 rounded-md border border-input bg-background px-2 py-0.5 text-xs"
          />
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, ''])}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-3" />
        添加
      </button>
    </div>
  )
}

function NameserverPolicyEditor({
  value,
  onChange,
}: {
  value: Record<string, string | string[]>
  onChange: (value: Record<string, string | string[]>) => void
}) {
  const entries = Object.entries(value)

  return (
    <div className="space-y-1">
      {entries.map(([domain, servers], i) => (
        <div key={i} className="flex items-start gap-1">
          <input
            type="text"
            value={domain}
            onChange={(e) => {
              const next = { ...value }
              delete next[domain]
              next[e.target.value] = servers
              onChange(next)
            }}
            placeholder="geosite:cn"
            className="w-32 h-7 rounded-md border border-input bg-background px-2 py-0.5 text-xs shrink-0"
          />
          <input
            type="text"
            value={Array.isArray(servers) ? servers.join(', ') : servers}
            onChange={(e) => {
              const parts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
              onChange({ ...value, [domain]: parts.length <= 1 ? parts[0] || '' : parts })
            }}
            placeholder="223.5.5.5, 119.29.29.29"
            className="flex-1 h-7 rounded-md border border-input bg-background px-2 py-0.5 text-xs"
          />
          <button
            onClick={() => {
              const next = { ...value }
              delete next[domain]
              onChange(next)
            }}
            className="text-muted-foreground hover:text-destructive mt-0.5"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange({ ...value, '': '' })}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-3" />
        添加策略
      </button>
    </div>
  )
}
