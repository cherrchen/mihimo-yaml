import { useState, useId, useMemo } from 'react'
import { useConfigStore } from '@/store/config-store'
import { TextField } from '@/components/editors/shared/fields'
import { Plus, Trash2, AlertTriangle, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { RULE_TYPES } from '@/lib/constants'
import { parseRule, buildRuleString } from '@/lib/rule-parser'

const RULE_TARGETS = ['DIRECT', 'REJECT', 'REJECT-DROP', 'COMPATIBLE', 'PASS']

function SortableRuleItem({ id, className = '', onClick, children }: { id: string; className?: string; onClick?: () => void; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className={`border-b border-border last:border-b-0 ${className}`}>
      <div onClick={onClick} className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer">
        <button {...attributes} {...listeners} className="shrink-0 cursor-grab touch-none">
          <GripVertical className="size-3 text-muted-foreground" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function RulesEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)
  const [editingIdx, setEditingIdx] = useState<number>(-1)

  const rules = config.rules || []
  const ruleProviders = Object.keys(config['rule-providers'] || {})
  const subRules = Object.keys(config['sub-rules'] || {})
  const proxyNames = (config.proxies || []).map((p) => p.name)
  const groupNames = (config['proxy-groups'] || []).map((g) => g.name)
  const allTargets = [...RULE_TARGETS, ...proxyNames, ...groupNames]

  const idPrefix = useId()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ids = useMemo(() => rules.map((_, i) => `${idPrefix}-${i}`), [config.rules, idPrefix])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id as string)
      const newIndex = ids.indexOf(over.id as string)
      setEditingIdx(-1)
      setRules((rs) => arrayMove(rs, oldIndex, newIndex))
    }
  }

  const setRules = (updater: (rules: string[]) => string[]) => {
    updateConfig((draft) => {
      draft.rules = updater(draft.rules || [])
    })
  }

  const addRule = (afterIdx: number) => {
    setRules((rs) => {
      const next = [...rs]
      next.splice(afterIdx + 1, 0, 'DOMAIN-SUFFIX,example.com,DIRECT')
      return next
    })
    setEditingIdx(afterIdx + 1)
  }

  const removeRule = (idx: number) => {
    setRules((rs) => rs.filter((_, i) => i !== idx))
    setEditingIdx(-1)
  }

  const updateRule = (idx: number, value: string) => {
    setRules((rs) => {
      const next = [...rs]
      next[idx] = value
      return next
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">路由规则</h2>
        <button
          onClick={() => addRule(rules.length - 1)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs"
        >
          <Plus className="size-3.5" /> 添加规则
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-0.5 border border-border rounded-md">
            {rules.map((rule, i) => {
              const { type, payload, target, extra } = parseRule(rule)
              const isMatchAfter = i > 0 && parseRule(rules[i - 1]).type === 'MATCH'
              const editing = editingIdx === i

              if (editing) {
                return (
                  <div key={i} className={`border-b border-border last:border-b-0 ${isMatchAfter ? 'bg-yellow-500/5' : ''}`}>
                    <div className="px-2 py-2 space-y-2">
                      <div className="grid grid-cols-4 gap-1">
                        <div>
                          <label className="text-[10px] text-muted-foreground">类型</label>
                          <select
                            value={type}
                            onChange={(e) => updateRule(i, buildRuleString(e.target.value, payload, target, extra))}
                            className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                          >
                            {RULE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="text-[10px] text-muted-foreground">
                            {type === 'MATCH' ? '无需 payload' :
                             type === 'RULE-SET' ? 'Provider 名称' :
                             type === 'SUB-RULE' ? 'Sub-rule 名称' :
                             type === 'AND' || type === 'OR' || type === 'NOT' ? '子规则组合' :
                             '匹配值'}
                          </label>
                          {type === 'RULE-SET' ? (
                            <select
                              value={payload}
                              onChange={(e) => updateRule(i, buildRuleString(type, e.target.value, target, extra))}
                              className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                            >
                              <option value="">选择 rule-provider</option>
                              {ruleProviders.map((rp) => <option key={rp} value={rp}>{rp}</option>)}
                            </select>
                          ) : type === 'SUB-RULE' ? (
                            <select
                              value={payload}
                              onChange={(e) => updateRule(i, buildRuleString(type, e.target.value, target, extra))}
                              className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                            >
                              <option value="">选择 sub-rule</option>
                              {subRules.map((sr) => <option key={sr} value={sr}>{sr}</option>)}
                            </select>
                          ) : (
                            <TextField
                              value={payload}
                              onChange={(v) => updateRule(i, buildRuleString(type, v, target, extra))}
                              placeholder={type === 'MATCH' ? '' : 'example.com'}
                              disabled={type === 'MATCH'}
                            />
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] text-muted-foreground">目标</label>
                          <select
                            value={target}
                            onChange={(e) => updateRule(i, buildRuleString(type, payload, e.target.value, extra))}
                            className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                          >
                            {allTargets.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-muted-foreground">额外参数</label>
                          <TextField
                            value={extra}
                            onChange={(v) => updateRule(i, buildRuleString(type, payload, target, v))}
                            placeholder="no-resolve"
                            className="w-32"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button onClick={() => addRule(i)} className="px-2 py-0.5 text-xs rounded hover:bg-accent">
                            <Plus className="size-3 inline mr-1" />在此之后插入
                          </button>
                          <button onClick={() => setEditingIdx(-1)} className="px-2 py-0.5 text-xs rounded hover:bg-accent">
                            完成
                          </button>
                          <button onClick={() => removeRule(i)} className="p-0.5 hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <SortableRuleItem key={ids[i]} id={ids[i]} className={isMatchAfter ? 'bg-yellow-500/5' : ''} onClick={() => setEditingIdx(i)}>
                  <span className="text-[10px] w-8 shrink-0 text-muted-foreground">{i + 1}</span>
                  <span className="text-xs font-mono font-medium text-primary">{type}</span>
                  <span className="text-xs flex-1 truncate">{payload || ''}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs font-medium">{target}</span>
                  {isMatchAfter && <AlertTriangle className="size-3 text-yellow-500 shrink-0" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeRule(i) }}
                    className="p-0.5 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </SortableRuleItem>
              )
            })}

            {rules.length === 0 && (
              <div className="p-4 text-xs text-muted-foreground text-center">
                暂无规则。点击上方按钮添加第一条规则。
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
