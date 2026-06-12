import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { DnsServerChoice } from '@/compatibility/dns-strategy'

interface DnsStrategyDialogProps {
  open: boolean
  onClose: () => void
  choices: DnsServerChoice[]
  onConfirm: (manualChoices: Record<string, string>, strategy: 'auto-first' | 'manual-choose' | 'block-export') => void
}

export function DnsStrategyDialog({ open, onClose, choices, onConfirm }: DnsStrategyDialogProps) {
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const c of choices) init[c.domain] = c.selected
    return init
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Stash DNS 策略处理</h3>
          <p className="text-xs text-muted-foreground mt-1">
            以下 DNS nameserver-policy 条目包含多个 DNS 服务器。请选择处理方式。
          </p>
        </div>

        <div className="p-4 space-y-3">
          {choices.map((c) => (
            <div key={c.domain} className="border border-border rounded-md p-2">
              <p className="text-xs font-medium mb-1">{c.domain}</p>
              <select
                value={selections[c.domain] || c.servers[0]}
                onChange={(e) => setSelections((s) => ({ ...s, [c.domain]: e.target.value }))}
                className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {c.servers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.servers.length} 个服务器可选</p>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onConfirm(selections, 'auto-first')}>
              全部选第一个
            </Button>
            <Button variant="outline" size="sm" onClick={() => onConfirm(selections, 'block-export')}>
              阻止这些策略
            </Button>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onClose}>取消</Button>
            <Button size="sm" onClick={() => onConfirm(selections, 'manual-choose')}>
              确认选择
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
