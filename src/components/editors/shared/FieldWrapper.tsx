import { type ReactNode, useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ChevronDown, ChevronRight, CircleHelp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface FieldWrapperProps {
  label: string
  description?: string
  help?: ReactNode
  yamlKey?: string
  defaultValue?: string | number | boolean
  example?: string
  required?: boolean
  children: ReactNode
  advanced?: boolean
  defaultExpanded?: boolean
  stashSupport?: boolean
  sensitive?: boolean
}

export function FieldWrapper({
  label,
  description,
  help,
  yamlKey,
  defaultValue,
  example,
  required,
  children,
  advanced,
  defaultExpanded,
  stashSupport,
  sensitive,
}: FieldWrapperProps) {
  const [expanded, setExpanded] = useState(advanced ? !!defaultExpanded : true)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {advanced && (
          <button
            type="button"
            aria-label={`${expanded ? '收起' : '展开'}${label}`}
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground"
          >
            {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        )}
        <label className={cn('text-xs font-medium', advanced && !expanded ? 'text-muted-foreground' : '')}>
          {label}
        </label>
        {help && (
          <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  aria-label={`查看${label}说明`}
                  className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <CircleHelp className="size-3.5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={6}
                  className="z-50 max-w-72 rounded-md border border-border bg-popover px-3 py-2 text-[11px] leading-relaxed text-popover-foreground shadow-md"
                >
                  <div>{help}</div>
                  {(yamlKey || defaultValue !== undefined || example) && (
                    <div className="mt-1.5 space-y-0.5 text-muted-foreground">
                      {yamlKey && <p>YAML 字段：<code className="text-foreground">{yamlKey}</code></p>}
                      {defaultValue !== undefined && <p>默认值：<code className="text-foreground">{String(defaultValue)}</code></p>}
                      {example && <p>示例：<code className="text-foreground">{example}</code></p>}
                    </div>
                  )}
                  <Tooltip.Arrow className="fill-border" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
        {required && <span className="text-red-500 text-[10px]">*必填</span>}
        {sensitive && <span className="text-yellow-500 text-[10px]">*敏感</span>}
        {stashSupport === false && (
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">仅 mihomo</Badge>
        )}
      </div>
      {(!advanced || expanded) && (
        <>
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
          {children}
          {example && !help && (
            <p className="text-[10px] text-muted-foreground">示例: {example}</p>
          )}
        </>
      )}
    </div>
  )
}
