import { useState, useId, useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import { Plus, Trash2, Search, GripVertical, GitGraph } from 'lucide-react'
import { SelectField, TextField, NumberField, BoolField } from '@/components/editors/shared/fields'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { ProxyGroupTopology } from './ProxyGroupTopology'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ProxyGroupConfig } from '@/schema/model'
import { PROXY_GROUP_TYPES, LOAD_BALANCE_STRATEGIES } from '@/lib/constants'

export function ProxyGroupsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)
  const [search, setSearch] = useState('')

  const groups = config['proxy-groups'] || []
  const filtered = search
    ? groups
        .map((g, idx) => ({ group: g, idx }))
        .filter(({ group: g }) => g.name.toLowerCase().includes(search.toLowerCase()))
    : groups.map((g, idx) => ({ group: g, idx }))

  const setGroups = (updater: (groups: ProxyGroupConfig[]) => ProxyGroupConfig[]) => {
    updateConfig((draft) => {
      draft['proxy-groups'] = updater(draft['proxy-groups'] || [])
    })
  }

  const addGroup = () => {
    setGroups((gs) => [...gs, { name: `group-${gs.length + 1}`, type: 'select', proxies: ['DIRECT'] }])
    setSelectedIdx(groups.length)
  }

  const removeGroup = (idx: number) => {
    setGroups((gs) => gs.filter((_, i) => i !== idx))
    setSelectedIdx(Math.min(selectedIdx, groups.length - 2))
  }

  const updateGroup = (idx: number, updater: (g: ProxyGroupConfig) => void) => {
    updateConfig((draft) => {
      if (!draft['proxy-groups']) return
      const g = { ...draft['proxy-groups'][idx] }
      updater(g)
      draft['proxy-groups'][idx] = g
    })
  }

  const proxyNames = (config.proxies || []).map((p) => p.name)
  const groupNames = (config['proxy-groups'] || []).map((g) => g.name)
  const [view, setView] = useState<'list' | 'topology'>('list')

  if (view === 'topology') {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <button onClick={() => setView('list')} className="text-xs text-muted-foreground hover:text-foreground">&larr; 返回列表</button>
          <span className="text-xs font-medium">代理组拓扑图</span>
        </div>
        <div className="flex-1">
          <ProxyGroupTopology />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 flex h-full">
      <div className="w-64 flex-shrink-0 border-r border-border pr-3 flex flex-col">
        <div className="relative mb-2">
          <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索组..." className="w-full h-7 pl-7 pr-2 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button onClick={addGroup} className="mb-2 flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          <Plus className="size-3.5" /> 添加代理组
        </button>
        <button onClick={() => setView('topology')} className="mb-2 flex items-center gap-1 px-2 py-1 rounded border border-border text-xs hover:bg-accent">
          <GitGraph className="size-3.5" /> 拓扑图
        </button>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {filtered.map(({ group: g, idx }) => (
            <div
              key={`${g.name}-${idx}`}
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer ${selectedIdx === idx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
            >
              <span className="truncate flex-1">{g.name}</span>
              <span className="text-[10px] text-muted-foreground">{g.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 pl-4 overflow-y-auto max-w-lg mx-auto">
        {selectedIdx >= 0 && groups[selectedIdx] ? (
          <GroupDetailEditor
            group={groups[selectedIdx]}
            onChange={(updater) => updateGroup(selectedIdx, updater)}
            onDelete={() => removeGroup(selectedIdx)}
            proxyNames={proxyNames}
            groupNames={groupNames}
          />
        ) : (
          <p className="text-xs text-muted-foreground p-8 text-center">选择或添加一个代理组</p>
        )}
      </div>
    </div>
  )
}

function SortableMemberItem({ id, selected, onSelect, onDelete, refNames }: {
  id: string
  selected: string
  onSelect: (value: string) => void
  onDelete: () => void
  refNames: string[]
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
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
      >
        {refNames.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <button onClick={onDelete} className="text-muted-foreground hover:text-destructive">
        <Trash2 className="size-3" />
      </button>
    </div>
  )
}

function GroupDetailEditor({
  group, onChange, onDelete,
  proxyNames, groupNames,
}: {
  group: ProxyGroupConfig
  onChange: (updater: (g: ProxyGroupConfig) => void) => void
  onDelete: () => void
  proxyNames: string[]
  groupNames: string[]
}) {
  const allRefs = ['DIRECT', 'REJECT', 'REJECT-DROP', 'COMPATIBLE', 'PASS', ...proxyNames, ...groupNames.filter((n) => n !== group.name)]
  const proxies = group.proxies || []
  const idPrefix = useId()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ids = useMemo(() => proxies.map((_, i) => `${idPrefix}-${i}`), [group.proxies, idPrefix])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id as string)
      const newIndex = ids.indexOf(over.id as string)
      onChange((g) => { g.proxies = arrayMove(g.proxies || [], oldIndex, newIndex) })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{group.name}</h3>
        <button onClick={onDelete} className="p-1 hover:bg-destructive/20 rounded text-destructive">
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="名称" required>
          <TextField value={group.name} onChange={(v) => onChange((g) => { g.name = v })} placeholder="组名称" />
        </FieldWrapper>
        <FieldWrapper label="类型" required>
          <SelectField value={group.type} onChange={(v) => onChange((g) => { g.type = v })} options={PROXY_GROUP_TYPES} />
        </FieldWrapper>
      </div>

      {/* Proxies list */}
      <FieldWrapper label="代理成员" description="proxies (拖拽调整顺序)">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-0.5 border border-border rounded-md p-2 max-h-48 overflow-y-auto">
              {proxies.map((ref, i) => (
                <SortableMemberItem
                  key={ids[i]}
                  id={ids[i]}
                  selected={ref}
                  onSelect={(v) => onChange((g) => {
                    if (!g.proxies) g.proxies = []
                    g.proxies[i] = v
                  })}
                  onDelete={() => onChange((g) => { g.proxies = g.proxies?.filter((_, j) => j !== i) })}
                  refNames={allRefs}
                />
              ))}
              <button
                onClick={() => onChange((g) => { if (!g.proxies) g.proxies = []; g.proxies.push('DIRECT') })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-3" /> 添加
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </FieldWrapper>

      {/* Group-specific fields */}
      {(group.type === 'url-test' || group.type === 'fallback' || group.type === 'load-balance') && (
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="健康检查 URL" description="url">
            <TextField value={group.url || ''} onChange={(v) => onChange((g) => { g.url = v })} placeholder="https://www.gstatic.com/generate_204" />
          </FieldWrapper>
          <FieldWrapper label="检查间隔" description="interval (秒)">
            <NumberField value={group.interval ?? 0} onChange={(v) => onChange((g) => { g.interval = v })} placeholder="300" />
          </FieldWrapper>
          <FieldWrapper label="超时" description="timeout (ms)">
            <NumberField value={group.timeout ?? 5000} onChange={(v) => onChange((g) => { g.timeout = v })} placeholder="5000" />
          </FieldWrapper>
          <FieldWrapper label="最大失败次数" description="max-failed-times">
            <NumberField value={group['max-failed-times'] ?? 5} onChange={(v) => onChange((g) => { g['max-failed-times'] = v })} placeholder="5" />
          </FieldWrapper>
        </div>
      )}

      {group.type === 'load-balance' && (
        <FieldWrapper label="负载策略" description="strategy">
          <SelectField value={group.strategy || ''} onChange={(v) => onChange((g) => { g.strategy = v })} options={LOAD_BALANCE_STRATEGIES} placeholder="consistent-hashing" />
        </FieldWrapper>
      )}

      {group.type === 'relay' && (
        <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-md p-2 text-xs text-yellow-600 dark:text-yellow-400">
          Relay 不支持 UDP 中继。建议设置 disable-udp: true
        </div>
      )}

      {/* Advanced fields */}
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Use (Provider)" description="引用 proxy-provider">
          <TextField
            value={group.use?.join(', ') || ''}
            onChange={(v) => onChange((g) => { g.use = v ? v.split(',').map((s) => s.trim()) : undefined })}
            placeholder="provider1, provider2"
          />
        </FieldWrapper>

        <FieldWrapper label="禁用 UDP" description="disable-udp">
          <BoolField value={group['disable-udp'] ?? false} onChange={(v) => onChange((g) => { g['disable-udp'] = v })} />
        </FieldWrapper>

        <FieldWrapper label="空组回退" description="empty-fallback" advanced>
          <TextField value={group['empty-fallback'] || 'COMPATIBLE'} onChange={(v) => onChange((g) => { g['empty-fallback'] = v })} placeholder="COMPATIBLE" />
        </FieldWrapper>

        <FieldWrapper label="图标" description="icon (URL 或 base64)" advanced>
          <TextField value={group.icon || ''} onChange={(v) => onChange((g) => { g.icon = v })} placeholder="https://..." />
        </FieldWrapper>

        <FieldWrapper label="隐藏" description="hidden (API 中不可见)" advanced>
          <BoolField value={group.hidden ?? false} onChange={(v) => onChange((g) => { g.hidden = v })} />
        </FieldWrapper>

        <FieldWrapper label="筛选" description="filter (节点筛选正则)" advanced>
          <TextField value={group.filter || ''} onChange={(v) => onChange((g) => { g.filter = v })} placeholder=".*HK.*" />
        </FieldWrapper>

        <FieldWrapper label="排除筛选" description="exclude-filter" advanced>
          <TextField value={group['exclude-filter'] || ''} onChange={(v) => onChange((g) => { g['exclude-filter'] = v })} placeholder=".*过期.*" />
        </FieldWrapper>
      </div>
    </div>
  )
}
