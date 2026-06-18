import { useId, useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField } from '@/components/editors/shared/fields'
import { DNS_ENHANCED_MODES, DNS_CACHE_ALGORITHMS, DNS_FAKE_IP_FILTER_MODES } from '@/lib/constants'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
          <TextField
            value={dns.listen || ''}
            onChange={(v) => setDns('listen', v)}
            placeholder="0.0.0.0:53"
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
              <TextField
                value={dns['fake-ip-range'] || '198.18.0.1/16'}
                onChange={(v) => setDns('fake-ip-range', v)}
                placeholder="198.18.0.1/16"
              />
            </FieldWrapper>

            <FieldWrapper label="Fake IP TTL" description="dns.fake-ip-ttl" advanced>
              <NumberField
                value={dns['fake-ip-ttl']}
                onChange={(v) => setDns('fake-ip-ttl', v)}
                placeholder="1"
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
              <TextField
                value={dns['fallback-filter']?.['geoip-code'] || 'CN'}
                onChange={(v) => {
                  setDns('fallback-filter', { ...dns['fallback-filter'], 'geoip-code': v })
                }}
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

function SortableItem({
  id,
  item,
  placeholder,
  onChange,
  onDelete,
}: {
  id: string
  item: string
  placeholder?: string
  onChange: (value: string) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1">
      <button {...attributes} {...listeners} className="shrink-0 cursor-grab touch-none">
        <GripVertical className="size-3 text-muted-foreground" />
      </button>
      <TextField
        value={item}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1"
      />
      <button onClick={onDelete} className="text-muted-foreground hover:text-destructive">
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}

function StringListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}) {
  const idPrefix = useId()
  const ids = useMemo(() => value.map((_, i) => `${idPrefix}-${i}`), [value, idPrefix])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id as string)
      const newIndex = ids.indexOf(over.id as string)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {value.map((item, i) => (
            <SortableItem
              key={ids[i]}
              id={ids[i]}
              item={item}
              placeholder={placeholder}
              onChange={(v) => {
                const next = [...value]
                next[i] = v
                onChange(next)
              }}
              onDelete={() => onChange(value.filter((_, j) => j !== i))}
            />
          ))}
          <button
            onClick={() => onChange([...value, ''])}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3" />
            添加
          </button>
        </div>
      </SortableContext>
    </DndContext>
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
        <div
          key={i}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-start gap-1"
        >
          <TextField
            value={domain}
            onChange={(e) => {
              const next = { ...value }
              delete next[domain]
              next[e] = servers
              onChange(next)
            }}
            placeholder="geosite:cn"
          />
          <TextField
            value={Array.isArray(servers) ? servers.join(', ') : servers}
            onChange={(e) => {
              const parts = e.split(',').map((s) => s.trim()).filter(Boolean)
              onChange({ ...value, [domain]: parts.length <= 1 ? parts[0] || '' : parts })
            }}
            placeholder="223.5.5.5, 119.29.29.29"
            className="flex-1"
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
