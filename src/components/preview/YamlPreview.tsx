import { useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { yaml as yamlLang } from '@codemirror/lang-yaml'
import type { Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { IntegrityIssue } from '@/engine/integrity'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { YamlDiff } from './YamlDiff'

const YAML_EXTENSIONS = [yamlLang()]
const PLAIN_TEXT_EXTENSIONS: Extension[] = []
const VIRTUALIZE_THRESHOLD = 200
const LARGE_YAML_LINE_THRESHOLD = 5_000

function countYamlLines(value: string) {
  if (!value) return 0

  let count = 1
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) === 10) count += 1
  }
  return count
}

function IssueCard({ issue }: { issue: IntegrityIssue }) {
  return (
    <div
      data-testid="integrity-issue"
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
  )
}

function IssuesList({ issues }: { issues: IntegrityIssue[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // TanStack Virtual intentionally exposes mutable measurement methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: issues.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 58,
    overscan: 10,
  })

  if (issues.length === 0) {
    return <p className="text-xs text-muted-foreground p-2">没有发现问题</p>
  }

  if (issues.length <= VIRTUALIZE_THRESHOLD) {
    return (
      <div className="p-2 overflow-y-auto h-full space-y-1">
        {issues.map((issue, index) => <IssueCard key={index} issue={issue} />)}
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="p-2 overflow-y-auto h-full">
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            className="absolute left-0 top-0 w-full pb-1"
            style={{ transform: `translateY(${virtualRow.start}px)` }}
          >
            <IssueCard issue={issues[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function YamlPreview() {
  const yaml = useConfigStore((state) => state.configYaml)
  const integrityReport = useConfigStore((state) => state.integrityReport)
  const derivationPending = useConfigStore((state) => state.derivationPending)
  const previewMode = useUiStore((state) => state.previewMode)
  const setPreviewMode = useUiStore((state) => state.setPreviewMode)
  const theme = useUiStore((state) => state.theme)

  const prevYamlRef = useRef<string>('')
  const [previousYaml, setPreviousYaml] = useState('')

  useEffect(() => {
    if (!yaml) return
    setPreviousYaml(prevYamlRef.current)
    prevYamlRef.current = yaml
  }, [yaml])

  const yamlLineCount = useMemo(() => countYamlLines(yaml), [yaml])
  const isLargeYaml = yamlLineCount > LARGE_YAML_LINE_THRESHOLD
  const stats = { lines: yamlLineCount, characters: yaml.length }

  const issues = integrityReport?.issues ?? []
  const tabs = [
    { id: 'yaml' as const, label: 'YAML' },
    { id: 'issues' as const, label: '问题', count: issues.length },
    { id: 'diff' as const, label: '对比' },
    { id: 'report' as const, label: '兼容性' },
  ]

  return (
    <>
      <style>{'.yaml-preview .cm-editor{height:100%}'}</style>
      <div className="h-full flex flex-col yaml-preview">
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

        <div className="flex-1 min-h-0 overflow-hidden yaml-preview">
          {previewMode === 'yaml' && (
            <CodeMirror
              value={yaml}
              extensions={isLargeYaml ? PLAIN_TEXT_EXTENSIONS : YAML_EXTENSIONS}
              theme={theme === 'dark' ? oneDark : undefined}
              readOnly
              basicSetup={{ lineNumbers: true, foldGutter: true }}
              className="h-full text-xs"
              style={{ height: '100%' }}
            />
          )}

          {previewMode === 'issues' && <IssuesList issues={issues} />}

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

        <div className="border-t border-border px-2 py-1 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{derivationPending ? '更新中...' : `${stats.lines} 行`}</span>
          <span>{stats.characters} 字符</span>
        </div>
      </div>
    </>
  )
}
