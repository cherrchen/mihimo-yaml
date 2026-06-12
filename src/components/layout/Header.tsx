import {
  Sun,
  Moon,
  FileDown,
  FileUp,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/ui-store'
import { useConfigStore } from '@/store/config-store'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { useCallback } from 'react'

export function Header() {
  const { theme, setTheme } = useUiStore()
  const { configName, undo, redo, canUndo, canRedo, config, setConfigYaml } = useConfigStore()

  const handleExport = useCallback(() => {
    const yaml = stringifyYamlOrdered(config)
    setConfigYaml(yaml)

    // Trigger download
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${configName}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }, [config, configName, setConfigYaml])

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const idx = order.indexOf(theme)
    setTheme(order[(idx + 1) % order.length])
  }

  return (
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
        <Button variant="ghost" size="icon" title="自动保存中" disabled>
          <Save className="size-4" />
        </Button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" title="打开草稿">
          <FolderOpen className="size-4" />
          <span className="text-xs ml-1">打开</span>
        </Button>
        <Button variant="ghost" size="sm" title="导入">
          <FileUp className="size-4" />
          <span className="text-xs ml-1">导入</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExport} title="导出 YAML">
          <FileDown className="size-4" />
          <span className="text-xs ml-1">导出</span>
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button variant="ghost" size="icon" onClick={cycleTheme} title="切换主题">
          {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>
      </div>
    </div>
  )
}
