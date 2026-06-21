import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SplitEditorLayout({ children }: { children: ReactNode }) {
  return <div className="flex h-full p-6">{children}</div>
}

export function SplitEditorListPane({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <aside
      data-editor-list-pane
      className={cn('flex w-[30%] min-w-56 shrink-0 flex-col border-r border-border pr-3', className)}
      {...props}
    />
  )
}

export function SplitEditorDetailPane({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <main className={cn('min-w-0 flex-1 overflow-y-auto pl-4', className)} {...props}>
      <div className="mx-auto w-full max-w-lg">{children}</div>
    </main>
  )
}
