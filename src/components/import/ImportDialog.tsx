import { useState } from 'react'
import { FileUp, Link, Clipboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileImport } from './FileImport'
import { UrlImport } from './UrlImport'
import { ClipboardImport } from './ClipboardImport'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  initialTab?: Tab
}

type Tab = 'file' | 'url' | 'clipboard'

export function ImportDialog({ open, onClose, initialTab = 'file' }: ImportDialogProps) {
  const [tab, setTab] = useState<Tab>(initialTab)

  if (!open) return null

  const tabs: { id: Tab; label: string; icon: typeof FileUp }[] = [
    { id: 'file', label: '文件导入', icon: FileUp },
    { id: 'url', label: 'URL 拉取', icon: Link },
    { id: 'clipboard', label: '剪贴板', icon: Clipboard },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">导入配置</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-7">
            <span className="text-xs">✕</span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {tab === 'file' && <FileImport />}
          {tab === 'url' && <UrlImport />}
          {tab === 'clipboard' && <ClipboardImport />}
        </div>
      </div>
    </div>
  )
}
