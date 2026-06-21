import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { TextField } from '@/components/editors/shared/fields'
import { Plus, Trash2 } from 'lucide-react'
import { EditorList, EditorListRow } from '@/components/editors/shared/EditorList'

export function HostsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const hosts = config.hosts || {}
  const entries = Object.entries(hosts)

  const setEntry = (domain: string, value: string | string[] | undefined) => {
    updateConfig((draft) => {
      if (!draft.hosts) draft.hosts = {}
      if (value === undefined) {
        delete draft.hosts[domain]
      } else {
        draft.hosts[domain] = value
      }
    })
  }

  const addEntry = () => {
    updateConfig((draft) => {
      if (!draft.hosts) draft.hosts = {}
      draft.hosts[''] = ''
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Hosts</h2>
        <button type="button" onClick={addEntry} className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <Plus className="size-3.5" /> 添加
        </button>
      </div>

      <EditorSection title="静态解析" description="将域名固定解析到一个或多个 IP 地址。">
        {entries.length > 0 && (
          <EditorList data-hosts-list>
            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-2 border-b border-border px-2 py-1.5 text-[10px] text-muted-foreground sm:grid">
              <span>域名</span>
              <span>IP 地址</span>
              <span className="sr-only">操作</span>
            </div>
          {entries.map(([domain, ip], i) => (
            <EditorListRow
              key={i}
              isLast={i === entries.length - 1}
              data-host-row
              className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] sm:items-center"
            >
            <TextField
              value={domain}
              onChange={(v) => {
                setEntry(domain, undefined)
                setEntry(v, ip)
              }}
              placeholder="domain.com"
            />
            <TextField
              value={typeof ip === 'string' ? ip : ip.join(', ')}
              onChange={(v) => {
                const commaParts = v.split(',').map((s) => s.trim()).filter(Boolean)
                setEntry(domain, commaParts.length <= 1 ? v : commaParts)
              }}
              placeholder="127.0.0.1"
            />
            <button type="button" aria-label={`删除 Hosts 条目 ${domain || i + 1}`} onClick={() => setEntry(domain, undefined)} className="justify-self-end rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <Trash2 className="size-3.5" />
            </button>
            </EditorListRow>
          ))}
          </EditorList>
        )}
        {entries.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">暂无静态解析条目</p>
            <button type="button" onClick={addEntry} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <Plus className="size-3" /> 添加第一条记录
            </button>
          </div>
        )}
      </EditorSection>
    </div>
  )
}
