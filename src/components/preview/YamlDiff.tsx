import { useMemo } from 'react'
import { diffLines, type Change } from 'diff'
import { cn } from '@/lib/utils'

interface YamlDiffProps {
  oldText: string
  newText: string
}

function countChanges(changes: Change[]) {
  let added = 0
  let removed = 0
  for (const c of changes) {
    if (c.added) added += c.count || 0
    if (c.removed) removed += c.count || 0
  }
  return { added, removed }
}

export function YamlDiff({ oldText, newText }: YamlDiffProps) {
  const changes = useMemo(() => diffLines(oldText, newText), [oldText, newText])
  const stats = useMemo(() => countChanges(changes), [changes])

  const isEmpty = oldText === newText || (oldText === '' && newText === '')

  if (isEmpty) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-xs text-muted-foreground">没有差异</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <pre className="text-xs font-mono leading-relaxed p-2">
          {changes.map((change, i) => {
            const lines = change.value.split('\n')
            // Remove trailing empty line from split
            if (lines[lines.length - 1] === '') lines.pop()

            return lines.map((line, j) => (
              <div
                key={`${i}-${j}`}
                className={cn(
                  'px-2 py-0',
                  change.added && 'bg-green-500/15 text-green-700 dark:text-green-400',
                  change.removed && 'bg-red-500/15 text-red-700 dark:text-red-400',
                  !change.added && !change.removed && 'text-muted-foreground',
                )}
              >
                <span className="inline-block w-4 text-right mr-2 select-none opacity-50">
                  {change.added ? '+' : change.removed ? '-' : ' '}
                </span>
                {line || '\u00A0'}
              </div>
            ))
          })}
        </pre>
      </div>
      <div className="border-t border-border px-2 py-1 flex items-center gap-3 text-[10px] text-muted-foreground">
        {stats.added > 0 && <span className="text-green-600">+{stats.added} 行新增</span>}
        {stats.removed > 0 && <span className="text-red-600">-{stats.removed} 行删除</span>}
        <span>{stats.added + stats.removed} 处变更</span>
      </div>
    </div>
  )
}
