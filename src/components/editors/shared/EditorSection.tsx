import { type ReactNode, useId } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EditorSectionProps {
  title: string
  description: string
  children: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  stashSupport?: boolean
}

function SectionHeading({
  title,
  description,
  stashSupport,
}: Pick<EditorSectionProps, 'title' | 'description' | 'stashSupport'>) {
  return (
    <span className="block min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        {stashSupport === false && (
          <Badge variant="outline" className="h-4 px-1.5 py-0 text-[9px] font-medium">
            仅 mihomo
          </Badge>
        )}
      </span>
      <span className="mt-0.5 block text-[11px] font-normal leading-relaxed text-muted-foreground">
        {description}
      </span>
    </span>
  )
}

export function EditorSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  stashSupport,
}: EditorSectionProps) {
  const headingId = useId()

  if (!collapsible) {
    return (
      <section aria-labelledby={headingId} className="space-y-3 border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
        <h3 id={headingId}>
          <SectionHeading title={title} description={description} stashSupport={stashSupport} />
        </h3>
        {children}
      </section>
    )
  }

  return (
    <Collapsible.Root asChild defaultOpen={defaultOpen}>
      <section aria-labelledby={headingId} className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
        <h3 id={headingId}>
          <Collapsible.Trigger className="group flex w-full items-start gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <SectionHeading title={title} description={description} stashSupport={stashSupport} />
            <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
          </Collapsible.Trigger>
        </h3>
        <Collapsible.Content className="pt-3">
          {children}
        </Collapsible.Content>
      </section>
    </Collapsible.Root>
  )
}
