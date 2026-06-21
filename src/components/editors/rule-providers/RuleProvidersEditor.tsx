import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, SelectField } from '@/components/editors/shared/fields'
import { PROVIDER_TYPES, RULE_PROVIDER_BEHAVIORS, RULE_PROVIDER_FORMATS } from '@/lib/constants'
import { Plus, Trash2 } from 'lucide-react'
import type { RuleProviderConfig } from '@/schema/model'
import { getTemplatePath, METACUBEX_TEMPLATES, type MetaRuleSetTemplate } from './templates'

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
    setProvider(name, { type: 'http', behavior: 'domain', format: 'mrs', url: '', path: '', interval: 86400 })
  }

  const applyTemplate = (tpl: MetaRuleSetTemplate) => {
    setProvider(tpl.name, {
      type: 'http',
      behavior: tpl.behavior,
      format: tpl.format,
      url: tpl.url,
      path: getTemplatePath(tpl),
      interval: 86400,
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <h2 className="text-sm font-semibold">规则 Provider</h2>

      <div className="rounded-md border border-border p-3">
        <h3 className="mb-2 text-xs font-medium">MetaCubeX 规则集模板</h3>
        <div className="grid max-h-48 grid-cols-3 gap-1 overflow-y-auto">
          {METACUBEX_TEMPLATES.map((tpl) => (
            <button
              type="button"
              key={tpl.name}
              aria-label={`${tpl.name} ${tpl.behavior}`}
              onClick={() => applyTemplate(tpl)}
              className="truncate rounded px-2 py-1 text-left text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              title={`${tpl.category} / ${tpl.behavior} / ${tpl.format}`}
            >
              <span className="font-medium">{tpl.name}</span>
              <span className="ml-1 text-[10px] text-muted-foreground">{tpl.behavior}</span>
            </button>
          ))}
        </div>
      </div>

      <EditorSection title="Provider 列表" description="管理远程或本地规则集的来源、格式和更新方式。">
        <button type="button" onClick={addProvider} className="mb-3 flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <Plus className="size-3.5" /> 添加 Provider
        </button>
        <div className="space-y-3">
        {Object.entries(providers).map(([name, provider]) => (
          <div key={name} className="rounded-md border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold">{name}</h4>
              <button
                type="button"
                aria-label={`删除规则 Provider ${name}`}
                onClick={() => setProvider(name, undefined)}
                className="rounded p-1 text-destructive hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldWrapper label="类型" help="选择从远程 URL、本地文件或内联内容加载规则。" yamlKey={`rule-providers.${name}.type`} required>
                <SelectField
                  value={provider.type}
                  onChange={(v) => setProvider(name, { ...provider, type: v })}
                  options={PROVIDER_TYPES}
                />
              </FieldWrapper>

              <FieldWrapper label="规则行为" help="声明规则集包含域名、IP CIDR 或完整经典规则。" yamlKey={`rule-providers.${name}.behavior`}>
                <SelectField
                  value={provider.behavior || ''}
                  onChange={(v) => setProvider(name, { ...provider, behavior: v })}
                  options={RULE_PROVIDER_BEHAVIORS}
                  emptyPlaceholder="未设置"
                />
              </FieldWrapper>

              <FieldWrapper label="文件格式" help="指定规则集使用 mrs、yaml 或 text 格式。" yamlKey={`rule-providers.${name}.format`}>
                <SelectField
                  value={provider.format || ''}
                  onChange={(v) => setProvider(name, { ...provider, format: v })}
                  options={RULE_PROVIDER_FORMATS}
                  emptyPlaceholder="未设置"
                />
              </FieldWrapper>

            {provider.type === 'http' && (
                <FieldWrapper label="远程 URL" help="填写规则集的 HTTPS 下载地址。" yamlKey={`rule-providers.${name}.url`} example="https://raw.githubusercontent.com/…">
                  <TextField
                    value={provider.url || ''}
                    onChange={(v) => setProvider(name, { ...provider, url: v })}
                    placeholder="https://raw.githubusercontent.com/..."
                  />
                </FieldWrapper>
            )}
            </div>

            <details className="mt-3 border-t border-border/70 pt-3">
              <summary className="cursor-pointer rounded text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">存储与更新</summary>
              <p className="mt-1 text-[11px] text-muted-foreground">配置更新周期、本地缓存路径和下载出口。</p>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldWrapper label="更新间隔" help="设置远程规则集的自动更新周期。单位：秒。" yamlKey={`rule-providers.${name}.interval`} defaultValue={86400}>
                <NumberField value={provider.interval} onChange={(v) => setProvider(name, { ...provider, interval: v })} placeholder="86400" />
              </FieldWrapper>
              <FieldWrapper label="本地路径" help="指定规则集的本地文件或缓存路径。" yamlKey={`rule-providers.${name}.path`} example="./ruleset/xxx.mrs">
                <TextField
                  value={provider.path || ''}
                  onChange={(v) => setProvider(name, { ...provider, path: v })}
                  placeholder="./ruleset/xxx.mrs"
                />
              </FieldWrapper>

              <FieldWrapper label="下载代理" help="指定下载远程规则集时使用的代理。" yamlKey={`rule-providers.${name}.proxy`} example="DIRECT">
                <TextField
                  value={provider.proxy || ''}
                  onChange={(v) => setProvider(name, { ...provider, proxy: v })}
                  placeholder="DIRECT"
                />
              </FieldWrapper>
              </div>
            </details>
          </div>
        ))}
        {Object.keys(providers).length === 0 && (
          <div className="rounded-md border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">暂无规则 Provider</p>
            <button type="button" onClick={addProvider} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <Plus className="size-3" /> 添加第一个 Provider
            </button>
          </div>
        )}
        </div>
      </EditorSection>

    </div>
  )
}
