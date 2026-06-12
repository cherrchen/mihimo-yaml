import type { CompatibilityIssue } from '@/compatibility/stash'
import { cn } from '@/lib/utils'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface CompatibilityReportProps {
  issues: CompatibilityIssue[]
  summary: { removed: number; warnings: number; errors: number; transformed: number }
}

export function CompatibilityReport({ issues, summary }: CompatibilityReportProps) {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertCircle className="size-3.5 text-red-500 shrink-0" />
      case 'warning': return <AlertTriangle className="size-3.5 text-yellow-500 shrink-0" />
      default: return <Info className="size-3.5 text-blue-500 shrink-0" />
    }
  }

  const getBg = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500/10 border-red-500/30'
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30'
      default: return 'bg-blue-500/10 border-blue-500/30'
    }
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-md bg-red-500/10 p-2 text-center">
          <div className="text-sm font-bold text-red-600">{summary.errors}</div>
          <div className="text-[10px] text-muted-foreground">错误</div>
        </div>
        <div className="rounded-md bg-yellow-500/10 p-2 text-center">
          <div className="text-sm font-bold text-yellow-600">{summary.warnings}</div>
          <div className="text-[10px] text-muted-foreground">警告</div>
        </div>
        <div className="rounded-md bg-blue-500/10 p-2 text-center">
          <div className="text-sm font-bold text-blue-600">{summary.transformed}</div>
          <div className="text-[10px] text-muted-foreground">已转换</div>
        </div>
        <div className="rounded-md bg-muted p-2 text-center">
          <div className="text-sm font-bold text-muted-foreground">{summary.removed}</div>
          <div className="text-[10px] text-muted-foreground">已移除</div>
        </div>
      </div>

      {/* Issues list */}
      {issues.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">没有兼容性问题</p>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 px-3 py-2 rounded-md border text-xs',
                getBg(issue.severity),
              )}
            >
              {getIcon(issue.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-[10px] font-mono bg-background/50 px-1 rounded">{issue.field}</code>
                  <span className="text-[10px] text-muted-foreground">{issue.action}</span>
                </div>
                <div className="text-muted-foreground mt-0.5">{issue.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
