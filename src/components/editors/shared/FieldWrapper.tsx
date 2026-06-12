import { type ReactNode, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface FieldWrapperProps {
  label: string
  description?: string
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
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground">
            {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        )}
        <label className={cn('text-xs font-medium', advanced && !expanded ? 'text-muted-foreground' : '')}>
          {label}
        </label>
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
          {example && (
            <p className="text-[10px] text-muted-foreground">示例: {example}</p>
          )}
        </>
      )}
    </div>
  )
}
