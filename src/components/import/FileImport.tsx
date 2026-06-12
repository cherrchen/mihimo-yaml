import { useState, useCallback, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'
import { parseYaml } from '@/schema/yaml'

export function FileImport() {
  const [preview, setPreview] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { setConfig, setConfigYaml } = useConfigStore()
  const { setActiveSection } = useUiStore()

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
      setError('请选择 .yaml 或 .yml 文件')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setPreview(text)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleConfirm = () => {
    try {
      const config = parseYaml(preview)
      setConfig(config)
      setConfigYaml(preview)
      setActiveSection('general')
      setPreview('')
      setError('')
    } catch (e) {
      setError(`YAML 解析错误: ${e instanceof Error ? e.message : '未知错误'}`)
    }
  }

  const handleCancel = () => {
    setPreview('')
    setError('')
  }

  if (!preview) {
    return (
      <div className="space-y-3">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">拖拽 YAML 文件到此处</p>
          <p className="text-xs text-muted-foreground mt-1">或</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileRef.current?.click()}
          >
            选择文件
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".yaml,.yml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 p-2 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">文件预览</h4>
        <FileText className="size-4 text-muted-foreground" />
      </div>
      <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/50 p-3 text-xs font-mono whitespace-pre-wrap">
        {preview}
      </pre>
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-2 text-xs text-destructive">
          {error}
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleCancel}>取消</Button>
        <Button size="sm" onClick={handleConfirm}>确认导入</Button>
      </div>
    </div>
  )
}
