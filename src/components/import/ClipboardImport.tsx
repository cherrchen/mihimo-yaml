import { useState } from 'react'
import { ClipboardPaste } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'
import { parseYaml } from '@/schema/yaml'

interface ClipboardImportProps {
  onClose: () => void
}

export function ClipboardImport({ onClose }: ClipboardImportProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const { setConfig, setConfigYaml, setConfigName } = useConfigStore()
  const { setActiveSection } = useUiStore()

  const handlePaste = async () => {
    setError('')
    try {
      const clipText = await navigator.clipboard.readText()
      setText(clipText)
    } catch {
      setError('无法读取剪贴板，请手动粘贴到下方区域')
    }
  }

  const handleConfirm = () => {
    if (!text.trim()) {
      setError('请先粘贴 YAML 内容')
      return
    }
    try {
      const config = parseYaml(text)
      setConfig(config)
      setConfigYaml(text)
      setConfigName('从剪贴板导入')
      setActiveSection('general')
      setText('')
      onClose()
    } catch (e) {
      setError(`YAML 解析错误: ${e instanceof Error ? e.message : '未知错误'}`)
    }
  }

  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={handlePaste} className="gap-2">
        <ClipboardPaste className="size-4" />
        从剪贴板读取
      </Button>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setError('') }}
        placeholder="或在此手动粘贴 YAML 配置..."
        rows={14}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
      />
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-2 text-xs text-destructive">
          {error}
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => { setText(''); setError('') }}>
          清空
        </Button>
        <Button size="sm" onClick={handleConfirm} disabled={!text.trim()}>
          确认导入
        </Button>
      </div>
    </div>
  )
}
