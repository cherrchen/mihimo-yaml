import { useId, useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, NumberField, SelectField, TextField } from '@/components/editors/shared/fields'
import { DNS_ENHANCED_MODES, DNS_CACHE_ALGORITHMS, DNS_FAKE_IP_FILTER_MODES } from '@/lib/constants'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Switch } from '@/components/ui/switch'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

export function DnsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const dns = config.dns || {}
  const dnsEnabled = dns.enable === true
  const setDns = (key: string, value: unknown) => {
    updateConfig((draft) => {
      if (!draft.dns) draft.dns = {}
      ;(draft.dns as Record<string, unknown>)[key] = value
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold">DNS</h2>
        <label className="flex items-center gap-2 text-xs font-medium" htmlFor="dns-enabled">
          启用 DNS
          <Switch
            id="dns-enabled"
            checked={dnsEnabled}
            onCheckedChange={(checked) => setDns('enable', checked)}
            aria-label="启用 DNS"
          />
        </label>
      </div>

      <fieldset
        disabled={!dnsEnabled}
        aria-disabled={!dnsEnabled}
        className="m-0 min-w-0 space-y-5 border-0 p-0 transition-opacity disabled:opacity-50"
      >
      <EditorSection title="解析与上游" description="配置增强解析模式与 DNS 上游服务器。">
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper label="增强模式" help="选择域名解析的增强方式；fake-ip 会为域名分配虚拟地址。" yamlKey="dns.enhanced-mode" defaultValue="redir-host" stashSupport={false}>
            <SelectField value={dns['enhanced-mode'] || ''} onChange={(v) => setDns('enhanced-mode', v)} options={DNS_ENHANCED_MODES} emptyPlaceholder="未设置" />
          </FieldWrapper>
        </div>
        <div data-dns-primary-servers className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FieldWrapper label="默认 DNS 服务器" help="用于解析其他 DNS 服务器域名，仅应填写 IP 地址。" yamlKey="dns.default-nameserver" example="223.5.5.5, 119.29.29.29">
            <StringListEditor value={dns['default-nameserver'] || []} onChange={(v) => setDns('default-nameserver', v)} placeholder="223.5.5.5" />
          </FieldWrapper>
          <FieldWrapper label="主要 DNS 服务器" help="配置处理普通域名请求的主要上游服务器。" yamlKey="dns.nameserver" example="https://doh.pub/dns-query">
            <StringListEditor value={dns.nameserver || []} onChange={(v) => setDns('nameserver', v)} placeholder="https://doh.pub/dns-query" />
          </FieldWrapper>
        </div>
        <div className="mt-4">
          <FieldWrapper label="备用 DNS 服务器" help="主要解析结果不满足过滤条件时使用这些备用上游。" yamlKey="dns.fallback" example="https://dns.cloudflare.com/dns-query" stashSupport={false}>
            <StringListEditor value={dns.fallback || []} onChange={(v) => setDns('fallback', v)} placeholder="https://dns.cloudflare.com/dns-query" />
          </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="监听与缓存" description="配置 DNS 服务监听、地址族和缓存协议偏好。" collapsible defaultOpen={false}>
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper label="DNS 监听地址" help="设置 DNS 服务的本地监听地址和端口。" yamlKey="dns.listen" example="0.0.0.0:53">
            <TextField value={dns.listen || ''} onChange={(v) => setDns('listen', v)} placeholder="0.0.0.0:53" />
          </FieldWrapper>
          <FieldWrapper label="IPv6 解析" help="允许返回 AAAA 记录并解析 IPv6 地址。" yamlKey="dns.ipv6" defaultValue={false} stashSupport={false}>
            <BoolField value={dns.ipv6 ?? false} onChange={(v) => setDns('ipv6', v)} />
          </FieldWrapper>
          <FieldWrapper label="缓存算法" help="选择 DNS 缓存淘汰算法。" yamlKey="dns.cache-algorithm" defaultValue="lru" stashSupport={false}>
            <SelectField value={dns['cache-algorithm'] || ''} onChange={(v) => setDns('cache-algorithm', v)} options={DNS_CACHE_ALGORITHMS} emptyPlaceholder="未设置" />
          </FieldWrapper>
          <FieldWrapper label="优先 HTTP/3" help="访问支持 HTTP/3 的 DoH 上游时优先使用 H3。" yamlKey="dns.prefer-h3" defaultValue={false}>
            <BoolField value={dns['prefer-h3'] ?? false} onChange={(v) => setDns('prefer-h3', v)} />
          </FieldWrapper>
        </div>
      </EditorSection>

      {dns['enhanced-mode'] === 'fake-ip' && (
        <EditorSection title="Fake IP" description="配置虚拟地址范围、有效期和过滤模式。" collapsible defaultOpen={false} stashSupport={false}>
          <div className={FIELD_GRID_CLASS}>
            <FieldWrapper label="Fake IP 范围" help="设置为域名分配虚拟 IPv4 地址的 CIDR。" yamlKey="dns.fake-ip-range" defaultValue="198.18.0.1/16">
              <TextField value={dns['fake-ip-range'] || '198.18.0.1/16'} onChange={(v) => setDns('fake-ip-range', v)} placeholder="198.18.0.1/16" />
            </FieldWrapper>
            <FieldWrapper label="Fake IP TTL" help="设置 Fake IP 映射的有效时间。" yamlKey="dns.fake-ip-ttl" defaultValue={1}>
              <NumberField value={dns['fake-ip-ttl']} onChange={(v) => setDns('fake-ip-ttl', v)} placeholder="1" />
            </FieldWrapper>
            <FieldWrapper label="Fake IP 过滤模式" help="决定过滤列表按黑名单、白名单或规则方式工作。" yamlKey="dns.fake-ip-filter-mode" defaultValue="blacklist">
              <SelectField value={dns['fake-ip-filter-mode'] || ''} onChange={(v) => setDns('fake-ip-filter-mode', v)} options={DNS_FAKE_IP_FILTER_MODES} emptyPlaceholder="未设置" />
            </FieldWrapper>
          </div>
        </EditorSection>
      )}

      <EditorSection title="分流 DNS" description="为代理节点和直连流量指定独立上游。" collapsible defaultOpen={false} stashSupport={false}>
        <div className="space-y-4">
          <FieldWrapper label="代理节点 DNS" help="专门用于解析代理服务器自身的域名。" yamlKey="dns.proxy-server-nameserver" example="https://doh.pub/dns-query">
            <StringListEditor value={dns['proxy-server-nameserver'] || []} onChange={(v) => setDns('proxy-server-nameserver', v)} placeholder="https://doh.pub/dns-query" />
          </FieldWrapper>
          <FieldWrapper label="直连 DNS 服务器" help="为直连流量指定独立的 DNS 上游。" yamlKey="dns.direct-nameserver" example="223.5.5.5">
            <StringListEditor value={dns['direct-nameserver'] || []} onChange={(v) => setDns('direct-nameserver', v)} placeholder="223.5.5.5" />
          </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection title="域名策略" description="按域名或规则集选择指定的 DNS 上游。" collapsible defaultOpen={false}>
        <FieldWrapper label="域名 DNS 策略" help="为匹配的域名指定一个或多个 DNS 服务器。" yamlKey="dns.nameserver-policy" example="geosite:cn → 223.5.5.5">
          <NameserverPolicyEditor value={dns['nameserver-policy'] || {}} onChange={(v) => setDns('nameserver-policy', v)} />
        </FieldWrapper>
      </EditorSection>

      {dns.fallback && dns.fallback.length > 0 && (
        <EditorSection title="Fallback 过滤" description="定义何时改用备用 DNS 的地理和域名条件。" collapsible defaultOpen={false} stashSupport={false}>
          <div className={FIELD_GRID_CLASS}>
            <FieldWrapper label="GeoIP 过滤" help="根据解析结果的 GeoIP 归属判断是否使用备用 DNS。" yamlKey="dns.fallback-filter.geoip" defaultValue>
              <BoolField value={dns['fallback-filter']?.geoip ?? true} onChange={(v) => setDns('fallback-filter', { ...dns['fallback-filter'], geoip: v })} />
            </FieldWrapper>
            <FieldWrapper label="GeoIP 国家代码" help="指定被视为本地解析结果的国家或地区代码。" yamlKey="dns.fallback-filter.geoip-code" defaultValue="CN">
              <TextField value={dns['fallback-filter']?.['geoip-code'] || 'CN'} onChange={(v) => setDns('fallback-filter', { ...dns['fallback-filter'], 'geoip-code': v })} />
            </FieldWrapper>
            <FieldWrapper label="污染 GeoSite 分类" help="这些 GeoSite 分类匹配时使用备用 DNS。" yamlKey="dns.fallback-filter.geosite" example="gfw">
              <StringListEditor value={dns['fallback-filter']?.geosite || []} onChange={(v) => setDns('fallback-filter', { ...dns['fallback-filter'], geosite: v })} placeholder="gfw" />
            </FieldWrapper>
            <FieldWrapper label="污染域名" help="这些域名匹配时使用备用 DNS。" yamlKey="dns.fallback-filter.domain" example="example.com">
              <StringListEditor value={dns['fallback-filter']?.domain || []} onChange={(v) => setDns('fallback-filter', { ...dns['fallback-filter'], domain: v })} placeholder="example.com" />
            </FieldWrapper>
          </div>
        </EditorSection>
      )}
      </fieldset>
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
      <button type="button" aria-label="拖动调整 DNS 服务器顺序" {...attributes} {...listeners} className="shrink-0 cursor-grab touch-none rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <GripVertical className="size-3 text-muted-foreground" />
      </button>
      <TextField
        value={item}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1"
      />
      <button type="button" aria-label="删除 DNS 服务器" onClick={onDelete} className="rounded text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
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
            type="button"
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
            type="button"
            aria-label="删除 DNS 策略"
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
        type="button"
        onClick={() => onChange({ ...value, '': '' })}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-3" />
        添加策略
      </button>
    </div>
  )
}
