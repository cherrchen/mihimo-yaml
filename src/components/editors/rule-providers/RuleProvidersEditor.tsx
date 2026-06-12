import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, SelectField } from '@/components/editors/shared/fields'
import { PROVIDER_TYPES, RULE_PROVIDER_BEHAVIORS, RULE_PROVIDER_FORMATS } from '@/lib/constants'
import { Plus, Trash2 } from 'lucide-react'
import type { RuleProviderConfig } from '@/schema/model'
import { METACUBEX_TEMPLATES, type MetaRuleSetTemplate } from './templates'

export function RuleProvidersEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const providers = config['rule-providers'] || {}

  const setProvider = (name: string, provider: RuleProviderConfig | undefined) => {
    updateConfig((draft) => {
      if (!draft['rule-providers']) draft['rule-providers'] = {}
      if (provider === undefined) {
        delete draft['rule-providers'][name]
      } else {
        draft['rule-providers'][name] = provider
      }
    })
  }

  const addProvider = () => {
    const name = `ruleset-${Object.keys(providers).length + 1}`
    setProvider(name, { type: 'http', behavior: 'domain', format: 'yaml', url: '', path: '', interval: 86400 })
  }

  const applyTemplate = (tpl: MetaRuleSetTemplate) => {
    setProvider(tpl.name, {
      type: 'http',
      behavior: tpl.behavior,
      format: tpl.format,
      url: tpl.url,
      path: `./ruleset/${tpl.name}.${tpl.format}`,
      interval: 86400,
    })
  }

  return (
    <div className="p-4 max-w-2xl space-y-4">
      <h2 className="text-sm font-semibold">规则 Provider</h2>

      {/* Template picker */}
      <div className="border border-border rounded-md p-3">
        <h3 className="text-xs font-medium mb-2">MetaCubeX 规则集模板</h3>
        <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
          {METACUBEX_TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              onClick={() => applyTemplate(tpl)}
              className="text-left px-2 py-1 text-xs rounded hover:bg-accent truncate"
              title={`${tpl.category} / ${tpl.behavior} / ${tpl.format}`}
            >
              <span className="font-medium">{tpl.name}</span>
              <span className="text-[10px] text-muted-foreground ml-1">
                {tpl.behavior}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={addProvider} className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
        <Plus className="size-3.5" /> 添加 Provider
      </button>

      {/* Provider list */}
      <div className="space-y-4">
        {Object.entries(providers).map(([name, provider]) => (
          <div key={name} className="border border-border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold">{name}</h4>
              <button
                onClick={() => setProvider(name, undefined)}
                className="p-0.5 hover:bg-destructive/20 rounded text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FieldWrapper label="类型">
                <SelectField
                  value={provider.type}
                  onChange={(v) => setProvider(name, { ...provider, type: v })}
                  options={PROVIDER_TYPES}
                />
              </FieldWrapper>

              <FieldWrapper label="Behavior">
                <SelectField
                  value={provider.behavior || ''}
                  onChange={(v) => setProvider(name, { ...provider, behavior: v })}
                  options={RULE_PROVIDER_BEHAVIORS}
                  placeholder="domain"
                />
              </FieldWrapper>

              <FieldWrapper label="Format">
                <SelectField
                  value={provider.format || ''}
                  onChange={(v) => setProvider(name, { ...provider, format: v })}
                  options={RULE_PROVIDER_FORMATS}
                  placeholder="yaml"
                />
              </FieldWrapper>

              <FieldWrapper label="更新间隔 (秒)" advanced>
                <input
                  type="number"
                  value={provider.interval ?? ''}
                  onChange={(e) => setProvider(name, { ...provider, interval: Number(e.target.value) })}
                  placeholder="86400"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                />
              </FieldWrapper>
            </div>

            {provider.type === 'http' && (
              <div className="mt-2">
                <FieldWrapper label="URL">
                  <TextField
                    value={provider.url || ''}
                    onChange={(v) => setProvider(name, { ...provider, url: v })}
                    placeholder="https://raw.githubusercontent.com/..."
                  />
                </FieldWrapper>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-2">
              <FieldWrapper label="本地路径" advanced>
                <TextField
                  value={provider.path || ''}
                  onChange={(v) => setProvider(name, { ...provider, path: v })}
                  placeholder="./ruleset/xxx.yaml"
                />
              </FieldWrapper>

              <FieldWrapper label="下载代理" advanced>
                <TextField
                  value={provider.proxy || ''}
                  onChange={(v) => setProvider(name, { ...provider, proxy: v })}
                  placeholder="DIRECT"
                />
              </FieldWrapper>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
