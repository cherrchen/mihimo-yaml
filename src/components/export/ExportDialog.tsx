import { useState, useMemo } from 'react'
import { Download, Copy, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/config-store'
import { stringifyYamlOrdered } from '@/schema/yaml'
import { generateMihomoReport, generateStashReport } from '@/compatibility/stash'
import { getMultiServerEntries, resolveSingleServerDns, applyManualDnsChoices } from '@/compatibility/dns-strategy'
import type { DnsStrategyAction } from '@/compatibility/dns-strategy'
import { getEffectiveConfig } from '@/lib/effective-config'
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
  const [pendingAction, setPendingAction] = useState<'download' | 'copy' | null>(null)
  const effectiveConfig = useMemo(() => getEffectiveConfig(config), [config])

  const report = useMemo(() => {
    if (mode === 'mihomo') return generateMihomoReport(effectiveConfig)
    return generateStashReport(effectiveConfig)
  }, [effectiveConfig, mode])

  const yaml = useMemo(() => {
    if (mode === 'stash') {
      return stringifyYamlOrdered(report.transformedConfig)
    }
    return stringifyYamlOrdered(effectiveConfig)
  }, [effectiveConfig, report, mode])

  const dnsChoices = useMemo(() => {
    if (mode !== 'stash') return []
    return getMultiServerEntries(effectiveConfig.dns)
  }, [effectiveConfig.dns, mode])

  const handleDownload = () => {
    downloadBlob(yaml)
  }

  const handleCopy = async () => {
    if (!canExport) return
    if (mode === 'stash' && dnsChoices.length > 0) {
      setPendingAction('copy')
      setShowDnsDialog(true)
      return
    }
    try {
      await navigator.clipboard.writeText(yaml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const downloadBlob = (yamlStr: string) => {
    const blob = new Blob([yamlStr], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${configName}-${mode}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }

  const applyDnsResolution = (
    manualChoices: Record<string, string>,
    action: DnsStrategyAction,
  ) => {
    const resolvedConfig = JSON.parse(JSON.stringify(report.transformedConfig)) as typeof report.transformedConfig

    if (resolvedConfig.dns?.['nameserver-policy']) {
      if (action === 'block-export') {
        const result = resolveSingleServerDns(
          resolvedConfig.dns['nameserver-policy'] as Record<string, string | string[]>,
          'block-export',
        )
        for (const domain of result.blocked) {
          delete resolvedConfig.dns['nameserver-policy'][domain]
        }
        Object.assign(
          resolvedConfig.dns['nameserver-policy'] as Record<string, string>,
          result.resolved,
        )
      } else {
        resolvedConfig.dns['nameserver-policy'] = applyManualDnsChoices(
          resolvedConfig.dns['nameserver-policy'] as Record<string, string | string[]>,
          manualChoices,
        )
      }
    }

    return stringifyYamlOrdered(resolvedConfig)
  }

  const handleDnsConfirm = async (
    manualChoices: Record<string, string>,
    action: DnsStrategyAction,
  ) => {
    setShowDnsDialog(false)
    const resolvedYaml = applyDnsResolution(manualChoices, action)

    if (pendingAction === 'download') {
      downloadBlob(resolvedYaml)
    } else if (pendingAction === 'copy') {
      try {
        await navigator.clipboard.writeText(resolvedYaml)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignore
      }
    }
    setPendingAction(null)
  }

  const canExport = report.summary.errors === 0 || mode === 'mihomo'

  const handleExport = () => {
    if (mode === 'stash' && dnsChoices.length > 0) {
      setPendingAction('download')
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
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!canExport}>
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
