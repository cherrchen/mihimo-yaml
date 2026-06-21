import { useState } from 'react'
import { useConfigStore } from '@/store/config-store'
import { TextField } from '@/components/editors/shared/fields'
import { Plus, Trash2 } from 'lucide-react'
import { RULE_TYPES } from '@/lib/constants'
import { SplitEditorDetailPane, SplitEditorLayout, SplitEditorListPane } from '@/components/editors/shared/SplitEditorLayout'

export function SubRulesEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)
  const [selectedName, setSelectedName] = useState<string>('')

  const subRules = config['sub-rules'] || {}

  const setSubRule = (name: string, rules: string[] | undefined) => {
    updateConfig((draft) => {
      if (!draft['sub-rules']) draft['sub-rules'] = {}
      if (rules === undefined) {
        delete draft['sub-rules'][name]
      } else {
        draft['sub-rules'][name] = rules
      }
    })
  }

  const addSubRule = () => {
    const name = `sub-rule-${Object.keys(subRules).length + 1}`
    setSubRule(name, ['MATCH,DIRECT'])
    setSelectedName(name)
  }

  return (
    <SplitEditorLayout>
      <SplitEditorListPane>
        <button onClick={addSubRule} className="mb-2 flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          <Plus className="size-3.5" /> 添加子规则
        </button>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {Object.keys(subRules).map((name) => (
            <div
              key={name}
              onClick={() => setSelectedName(name)}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${
                selectedName === name ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className="text-[10px] text-muted-foreground ml-1">
                ({subRules[name].length} 条)
              </span>
            </div>
          ))}
        </div>
      </SplitEditorListPane>

      <SplitEditorDetailPane>
        {selectedName && subRules[selectedName] ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{selectedName}</h3>
              <button onClick={() => { setSubRule(selectedName, undefined); setSelectedName('') }} className="p-1 hover:bg-destructive/20 rounded text-destructive">
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {subRules[selectedName].map((rule, i) => {
                const parts = rule.split(',').map((s) => s.trim())
                return (
                  <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-1">
                    <span className="text-[10px] w-6 text-muted-foreground">{i + 1}</span>
                    <select
                      value={parts[0]}
                      onChange={(e) => {
                        const next = [...subRules[selectedName]]
                        next[i] = `${e.target.value},${parts.slice(1).join(',')}`
                        setSubRule(selectedName, next)
                      }}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      {RULE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <TextField
                      value={parts[1] || ''}
                      onChange={(v) => {
                        const next = [...subRules[selectedName]]
                        next[i] = `${parts[0]},${v},${parts[2] || ''}`
                        setSubRule(selectedName, next)
                      }}
                      placeholder="payload"
                    />
                    <TextField
                      value={parts[2] || ''}
                      onChange={(v) => {
                        const next = [...subRules[selectedName]]
                        next[i] = `${parts[0]},${parts[1] || ''},${v}`
                        setSubRule(selectedName, next)
                      }}
                      placeholder="target"
                    />
                    <button
                      onClick={() => {
                        setSubRule(selectedName, subRules[selectedName].filter((_, j) => j !== i))
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => setSubRule(selectedName, [...subRules[selectedName], 'DOMAIN-SUFFIX,example.com,DIRECT'])}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3" /> 添加规则
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground p-8 text-center">选择或添加子规则</p>
        )}
      </SplitEditorDetailPane>
    </SplitEditorLayout>
  )
}
