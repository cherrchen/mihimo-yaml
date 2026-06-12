import { useState } from 'react'
import {
  Sun,
  Moon,
  FileDown,
  FileUp,
  Undo2,
  Redo2,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/ui-store'
import { useConfigStore } from '@/store/config-store'
import { ImportDialog } from '@/components/import/ImportDialog'
import { ExportDialog } from '@/components/export/ExportDialog'

export function Header() {
  const { theme, setTheme } = useUiStore()
  const { configName, undo, redo, canUndo, canRedo, hasUnsavedChanges, triggerSave } = useConfigStore()
  const [importOpen, setImportOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportMode, setExportMode] = useState<'mihomo' | 'stash'>('mihomo')
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const handleExport = (mode: 'mihomo' | 'stash') => {
    setExportMode(mode)
    setExportOpen(true)
  }

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const idx = order.indexOf(theme)
    setTheme(order[(idx + 1) % order.length])
  }

  return (
    <>
      <div className="h-full flex items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight">mihomo-yaml</h1>
          <span className="text-xs text-muted-foreground">{configName}</span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled={!canUndo()} onClick={undo} title="撤销">
            <Undo2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!canRedo()} onClick={redo} title="重做">
            <Redo2 className="size-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="icon" title={hasUnsavedChanges ? '保存' : '已保存'} disabled={!hasUnsavedChanges} onClick={triggerSave}>
            <Save className="size-4" />
          </Button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setImportOpen(true)} title="导入">
            <FileUp className="size-4" />
            <span className="text-xs ml-1">导入</span>
          </Button>
          <div className="relative"
            onMouseEnter={() => setExportMenuOpen(true)}
            onMouseLeave={() => setExportMenuOpen(false)}
          >
            <Button variant="ghost" size="sm" title="导出 YAML" asChild>
              <span>
                <FileDown className="size-4" />
                <span className="text-xs ml-1">导出</span>
              </span>
            </Button>
            {exportMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-8 z-40 w-36 rounded-md border border-border bg-popover shadow-md p-1">
                <button
                  onClick={() => handleExport('mihomo')}
                  className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent"
                >
                  Mihomo 完整导出
                </button>
                <button
                  onClick={() => handleExport('stash')}
                  className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent"
                >
                  Stash 兼容导出
                </button>
              </div>
            )}
          </div>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={cycleTheme} title="切换主题">
            {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
        </div>
      </div>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} mode={exportMode} />
    </>
  )
}
