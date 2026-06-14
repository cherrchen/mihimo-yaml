import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
  previewPanel: ReactNode
  sidebarWidth: number
  sidebarOpen: boolean
  previewWidth?: number
}

export function AppShell({
  header,
  sidebar,
  children,
  previewPanel,
  sidebarWidth,
  sidebarOpen,
  previewWidth = 360,
}: AppShellProps) {
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border h-12">
        {header}
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            'flex-shrink-0 border-r border-border overflow-y-auto transition-all duration-200',
            'max-md:w-0',
            sidebarOpen ? '' : 'w-0',
          )}
          style={isNarrow ? undefined : { width: sidebarOpen ? sidebarWidth : 0 }}
        >
          {sidebar}
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {children}
        </div>

        {/* Preview Panel */}
        <div
          className="flex-shrink-0 border-l border-border overflow-y-auto max-lg:hidden"
          style={{ width: previewWidth }}
        >
          {previewPanel}
        </div>
      </div>
    </div>
  )
}
