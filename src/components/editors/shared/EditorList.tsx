import * as React from 'react'
import { cn } from '@/lib/utils'

export const EditorList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-md border border-border', className)} {...props} />
  ),
)
EditorList.displayName = 'EditorList'

interface EditorListRowProps extends React.HTMLAttributes<HTMLDivElement> {
  isLast: boolean
}

export const EditorListRow = React.forwardRef<HTMLDivElement, EditorListRowProps>(
  ({ className, isLast, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(!isLast && 'border-b border-border', className)}
      {...props}
    />
  ),
)
EditorListRow.displayName = 'EditorListRow'
