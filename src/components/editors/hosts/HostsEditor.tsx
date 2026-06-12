import { useConfigStore } from '@/store/config-store'
import { Plus, Trash2 } from 'lucide-react'

export function HostsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const hosts = config.hosts || {}

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
    <div className="p-4 max-w-xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Hosts</h2>
        <button onClick={addEntry} className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          <Plus className="size-3.5" /> 添加
        </button>
      </div>

      <div className="space-y-1">
        {Object.entries(hosts).map(([domain, ip], i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              type="text"
              value={domain}
              onChange={(e) => {
                setEntry(domain, undefined)
                setEntry(e.target.value, ip)
              }}
              placeholder="domain.com"
              className="w-40 h-7 rounded border border-input bg-background px-2 text-xs"
            />
            <input
              type="text"
              value={typeof ip === 'string' ? ip : ip.join(', ')}
              onChange={(e) => {
                const val = e.target.value
                const commaParts = val.split(',').map((s) => s.trim()).filter(Boolean)
                setEntry(domain, commaParts.length <= 1 ? val : commaParts)
              }}
              placeholder="127.0.0.1"
              className="flex-1 h-7 rounded border border-input bg-background px-2 text-xs"
            />
            <button onClick={() => setEntry(domain, undefined)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
