import { useState } from 'react'
import { useConfigStore } from '@/store/config-store'
import { TextField } from '@/components/editors/shared/fields'
import { Plus, Trash2, AlertTriangle, GripVertical } from 'lucide-react'
import { RULE_TYPES } from '@/lib/constants'

const RULE_TARGETS = ['DIRECT', 'REJECT', 'REJECT-DROP', 'COMPATIBLE', 'PASS']

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

  const getRuleParts = (rule: string): [string, string, string, string] => {
    const parts = rule.split(',').map((s) => s.trim())
    return [parts[0] || '', parts[1] || '', parts[2] || '', parts[3] || '']
  }

  const buildRuleString = (type: string, payload: string, target: string, extra: string): string => {
    if (type === 'MATCH') return `MATCH,${target}`
    const parts = [type, payload, target]
    if (extra) parts.push(extra)
    return parts.join(',')
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

      <div className="space-y-0.5 border border-border rounded-md">
        {rules.map((rule, i) => {
          const [type, payload, target, extra] = getRuleParts(rule)
          const isMatchAfter = i > 0 && getRuleParts(rules[i - 1])[0] === 'MATCH'
          const editing = editingIdx === i

          return (
            <div key={i} className={`border-b border-border last:border-b-0 ${isMatchAfter ? 'bg-yellow-500/5' : ''}`}>
              {/* Compact view */}
              {!editing && (
                <div
                  onClick={() => setEditingIdx(i)}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                >
                  <GripVertical className="size-3 text-muted-foreground shrink-0" />
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
                </div>
              )}

              {/* Expanded editor */}
              {editing && (
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
              )}
            </div>
          )
        })}

        {rules.length === 0 && (
          <div className="p-4 text-xs text-muted-foreground text-center">
            暂无规则。点击上方按钮添加第一条规则。
          </div>
        )}
      </div>
    </div>
  )
}
