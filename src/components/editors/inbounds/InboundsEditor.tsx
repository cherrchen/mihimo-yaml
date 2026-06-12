import { useState } from 'react'
import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { TextField, NumberField, BoolField, SelectField } from '@/components/editors/shared/fields'
import { LISTENER_TYPES } from '@/lib/constants'
import { Plus, Trash2 } from 'lucide-react'
import type { ListenerConfig } from '@/schema/model'

export function InboundsEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)

  const listeners = config.listeners || []

  const setListeners = (updater: (ls: ListenerConfig[]) => ListenerConfig[]) => {
    updateConfig((draft) => {
      draft.listeners = updater(draft.listeners || [])
    })
  }

  const addListener = () => {
    setListeners((ls) => [...ls, { name: `in-${ls.length + 1}`, type: 'http', port: 8080 }])
    setSelectedIdx(listeners.length)
  }

  return (
    <div className="p-4 flex h-full">
      <div className="w-56 flex-shrink-0 border-r border-border pr-3 flex flex-col">
        <button onClick={addListener} className="mb-2 flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          <Plus className="size-3.5" /> 添加 Inbound
        </button>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {listeners.map((l, i) => (
            <div
              key={`${l.name}-${i}`}
              onClick={() => setSelectedIdx(i)}
              className={`px-2 py-1 rounded text-xs cursor-pointer flex items-center justify-between ${
                selectedIdx === i ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            >
              <span className="truncate">{l.name}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">{l.type}:{l.port}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 pl-4 overflow-y-auto max-w-lg">
        {selectedIdx >= 0 && listeners[selectedIdx] ? (
          <ListenerDetailEditor
            listener={listeners[selectedIdx]}
            onChange={(upd) => { setListeners((ls) => { const copy = [...ls]; copy[selectedIdx] = upd(copy[selectedIdx]); return copy }) }}
            onDelete={() => {
              setListeners((ls) => ls.filter((_, i) => i !== selectedIdx))
              setSelectedIdx(Math.min(selectedIdx, listeners.length - 2))
            }}
          />
        ) : (
          <p className="text-xs text-muted-foreground p-8 text-center">选择或添加 Inbound</p>
        )}
      </div>
    </div>
  )
}

function ListenerDetailEditor({
  listener,
  onChange,
  onDelete,
}: {
  listener: ListenerConfig
  onChange: (updater: (l: ListenerConfig) => ListenerConfig) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{listener.name}</h3>
        <button onClick={onDelete} className="p-1 hover:bg-destructive/20 rounded text-destructive">
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="名称" required>
          <TextField value={listener.name} onChange={(v) => onChange((l) => ({ ...l, name: v }))} />
        </FieldWrapper>
        <FieldWrapper label="类型" required>
          <SelectField value={listener.type} onChange={(v) => onChange((l) => ({ ...l, type: v }))} options={LISTENER_TYPES} />
        </FieldWrapper>
        <FieldWrapper label="端口">
          <NumberField value={listener.port} onChange={(v) => onChange((l) => ({ ...l, port: v }))} placeholder="8080" />
        </FieldWrapper>
        <FieldWrapper label="监听地址" description="listen">
          <TextField value={listener.listen || ''} onChange={(v) => onChange((l) => ({ ...l, listen: v }))} placeholder="0.0.0.0" />
        </FieldWrapper>
        <FieldWrapper label="UDP" description="是否启用 UDP">
          <BoolField value={listener.udp ?? true} onChange={(v) => onChange((l) => ({ ...l, udp: v }))} />
        </FieldWrapper>
        <FieldWrapper label="代理" description="proxy: 所有流量导向此代理">
          <TextField value={listener.proxy || ''} onChange={(v) => onChange((l) => ({ ...l, proxy: v }))} placeholder="DIRECT" />
        </FieldWrapper>
        <FieldWrapper label="规则" description="rule: 使用此 sub-rule">
          <TextField value={listener.rule || ''} onChange={(v) => onChange((l) => ({ ...l, rule: v }))} placeholder="" />
        </FieldWrapper>
      </div>

      {/* Type-specific */}
      {(listener.type === 'http' || listener.type === 'socks' || listener.type === 'mixed') && (
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="用户名">
            <TextField value={listener.username || ''} onChange={(v) => onChange((l) => ({ ...l, username: v }))} />
          </FieldWrapper>
          <FieldWrapper label="密码" sensitive>
            <input type="password" value={listener.password || ''} onChange={(e) => onChange((l) => ({ ...l, password: e.target.value }))} className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs" />
          </FieldWrapper>
        </div>
      )}

      {listener.type === 'shadowsocks' && (
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="加密方法" required>
            <TextField value={listener.cipher || ''} onChange={(v) => onChange((l) => ({ ...l, cipher: v }))} placeholder="aes-256-gcm" />
          </FieldWrapper>
          <FieldWrapper label="密码" required sensitive>
            <input type="password" value={listener.password || ''} onChange={(e) => onChange((l) => ({ ...l, password: e.target.value }))} className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs" />
          </FieldWrapper>
        </div>
      )}

      {listener.type === 'tunnel' && (
        <div className="grid grid-cols-2 gap-3">
          <FieldWrapper label="目标地址" required>
            <TextField value={listener.target || ''} onChange={(v) => onChange((l) => ({ ...l, target: v }))} placeholder="example.com:80" />
          </FieldWrapper>
          <FieldWrapper label="网络类型">
            <TextField value={listener.network?.join(', ') || ''} onChange={(v) => onChange((l) => ({ ...l, network: v.split(',').map((s) => s.trim()).filter(Boolean) }))} placeholder="tcp, udp" />
          </FieldWrapper>
        </div>
      )}
    </div>
  )
}
