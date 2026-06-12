import { useState } from 'react'
import { useConfigStore } from '@/store/config-store'
import { Plus, Trash2 } from 'lucide-react'
import { RULE_TYPES } from '@/lib/constants'

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
    <div className="p-6 flex h-full">
      <div className="w-48 flex-shrink-0 border-r border-border pr-3 flex flex-col">
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
      </div>

      <div className="flex-1 pl-4 overflow-y-auto max-w-lg">
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
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[10px] w-6 text-muted-foreground">{i + 1}</span>
                    <select
                      value={parts[0]}
                      onChange={(e) => {
                        const next = [...subRules[selectedName]]
                        next[i] = `${e.target.value},${parts.slice(1).join(',')}`
                        setSubRule(selectedName, next)
                      }}
                      className="w-32 h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {RULE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input
                      type="text"
                      value={parts[1] || ''}
                      onChange={(e) => {
                        const next = [...subRules[selectedName]]
                        next[i] = `${parts[0]},${e.target.value},${parts[2] || ''}`
                        setSubRule(selectedName, next)
                      }}
                      placeholder="payload"
                      className="flex-1 h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <input
                      type="text"
                      value={parts[2] || ''}
                      onChange={(e) => {
                        const next = [...subRules[selectedName]]
                        next[i] = `${parts[0]},${parts[1] || ''},${e.target.value}`
                        setSubRule(selectedName, next)
                      }}
                      placeholder="target"
                      className="w-24 h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
    </div>
  )
}
