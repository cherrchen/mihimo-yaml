import { useMemo, useRef, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { yaml as yamlLang } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { YamlDiff } from './YamlDiff'

export function YamlPreview() {
  const config = useConfigStore((s) => s.config)
  const integrityReport = useConfigStore((s) => s.integrityReport)
  const { previewMode, setPreviewMode, theme } = useUiStore()

  const yaml = useMemo(() => stringifyYamlOrdered(config), [config])

  const prevYamlRef = useRef<string>('')
  const [previousYaml, setPreviousYaml] = useState('')

  useEffect(() => {
    setPreviousYaml(prevYamlRef.current)
    prevYamlRef.current = yaml
  }, [yaml])

  const tabs = [
    { id: 'yaml' as const, label: 'YAML' },
    { id: 'issues' as const, label: '问题', count: integrityReport?.issues.length },
    { id: 'diff' as const, label: '对比' },
    { id: 'report' as const, label: '兼容性' },
  ]

  return (
    <>
      <style>{'.yaml-preview .cm-editor{height:100%}'}</style>
      <div className="h-full flex flex-col yaml-preview">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPreviewMode(tab.id)}
            className={cn(
              'px-3 py-1.5 text-xs border-b-2 transition-colors',
              previewMode === tab.id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge variant="destructive" className="ml-1 text-[10px] px-1 py-0 h-3.5">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden yaml-preview">
        {previewMode === 'yaml' && (
          <CodeMirror
            value={yaml}
            extensions={[yamlLang()]}
            theme={theme === 'dark' ? oneDark : undefined}
            readOnly
            basicSetup={{ lineNumbers: true, foldGutter: true }}
            className="h-full text-xs"
            style={{ height: '100%' }}
          />
        )}

        {previewMode === 'issues' && (
          <div className="p-2 overflow-y-auto h-full">
            {integrityReport?.issues.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">没有发现问题</p>
            ) : (
              <div className="space-y-1">
                {integrityReport?.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={cn(
                      'px-2 py-1.5 rounded text-xs border',
                      issue.severity === 'error'
                        ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
                    )}
                  >
                    <div className="font-medium">{issue.type}</div>
                    <div className="text-muted-foreground">{issue.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {previewMode === 'diff' && (
          <div className="h-full overflow-hidden">
            <YamlDiff oldText={previousYaml} newText={yaml} />
          </div>
        )}

        {previewMode === 'report' && (
          <div className="p-2 overflow-y-auto h-full">
            <p className="text-xs text-muted-foreground">兼容性报告将在导出时生成。</p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border px-2 py-1 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{yaml.split('\n').length} 行</span>
        <span>{yaml.length} 字符</span>
      </div>
    </div>
    </>
  )
}
