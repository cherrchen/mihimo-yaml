import { useState, useMemo } from 'react'
import { Download, Copy, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/config-store'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { generateMihomoReport, generateStashReport } from '@/compatibility/stash'
import { getMultiServerEntries } from '@/compatibility/dns-strategy'
import { CompatibilityReport } from './CompatibilityReport'
import { DnsStrategyDialog } from './DnsStrategyDialog'

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  mode: 'mihomo' | 'stash'
}

export function ExportDialog({ open, onClose, mode }: ExportDialogProps) {
  const config = useConfigStore((s) => s.config)
  const configName = useConfigStore((s) => s.configName)
  const [copied, setCopied] = useState(false)
  const [showDnsDialog, setShowDnsDialog] = useState(false)

  const report = useMemo(() => {
    if (mode === 'mihomo') return generateMihomoReport(config)
    return generateStashReport(config)
  }, [config, mode])

  const yaml = useMemo(() => {
    if (mode === 'stash') {
      return stringifyYamlOrdered(report.transformedConfig)
    }
    return stringifyYamlOrdered(config)
  }, [config, report, mode])

  const dnsChoices = useMemo(() => {
    if (mode !== 'stash') return []
    return getMultiServerEntries(config.dns)
  }, [config.dns, mode])

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${configName}-${mode}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleDnsConfirm = () => {
    setShowDnsDialog(false)
    handleDownload()
  }

  const canExport = report.summary.errors === 0 || mode === 'mihomo'

  const handleExport = () => {
    if (mode === 'stash' && dnsChoices.length > 0) {
      setShowDnsDialog(true)
      return
    }
    handleDownload()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold">
                {mode === 'mihomo' ? 'Mihomo 完整导出' : 'Stash 兼容导出'}
              </h3>
              <p className="text-[10px] text-muted-foreground">{configName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="size-7">
              <span className="text-xs">✕</span>
            </Button>
          </div>

          {/* Report */}
          <div className="px-4 py-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">兼容性报告</h4>
            <CompatibilityReport issues={report.issues} summary={report.summary} />
          </div>

          {/* YAML Preview */}
          <div className="px-4 py-3 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">YAML 预览</h4>
            <pre className="max-h-48 overflow-auto rounded-md border border-border bg-muted/50 p-3 text-xs font-mono whitespace-pre-wrap">
              {yaml.slice(0, 3000)}
              {yaml.length > 3000 && <span className="text-muted-foreground">... (共 {yaml.length} 字符)</span>}
            </pre>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t border-border flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? '已复制' : '复制到剪贴板'}
            </Button>
            <Button size="sm" onClick={handleExport} disabled={!canExport}>
              <Download className="size-3.5" />
              下载 .yaml
            </Button>
          </div>
        </div>
      </div>

      <DnsStrategyDialog
        open={showDnsDialog}
        onClose={() => setShowDnsDialog(false)}
        choices={dnsChoices}
        onConfirm={handleDnsConfirm}
      />
    </>
  )
}
