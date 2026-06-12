import { useConfigStore } from '@/store/config-store'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { SelectField, NumberField } from '@/components/editors/shared/fields'
import { MODES, LOG_LEVELS, FIND_PROCESS_MODES, GEODATA_LOADERS } from '@/lib/constants'

export function GeneralEditor() {
  const config = useConfigStore((s) => s.config)
  const updateConfig = useConfigStore((s) => s.updateConfig)

  const set = (key: string, value: unknown) => {
    updateConfig((draft) => {
      const parts = key.split('.')
      if (parts.length === 1) {
        ;(draft as Record<string, unknown>)[key] = value
      } else if (parts.length === 2 && parts[0] === 'profile') {
        if (!draft.profile) draft.profile = {}
        ;(draft.profile as Record<string, unknown>)[parts[1]] = value
      } else if (parts.length === 2 && parts[0] === 'tls') {
        if (!draft.tls) draft.tls = {}
        ;(draft.tls as Record<string, unknown>)[parts[1]] = value
      }
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-sm font-semibold">通用设置</h2>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="代理模式" description="mode: 全局 / 规则 / 直连" required>
          <SelectField
            value={config.mode || ''}
            onChange={(v) => set('mode', v)}
            options={MODES}
            placeholder="选择模式"
          />
        </FieldWrapper>

        <FieldWrapper label="日志级别" description="log-level">
          <SelectField
            value={config['log-level'] || ''}
            onChange={(v) => set('log-level', v)}
            options={LOG_LEVELS}
            placeholder="选择日志级别"
          />
        </FieldWrapper>

        <FieldWrapper label="IPv6" description="是否允许 IPv6 流量" stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.ipv6 ?? true}
              onChange={(e) => set('ipv6', e.target.checked)}
              className="size-4 rounded border-input"
            />
            <span className="text-xs text-muted-foreground">{config.ipv6 !== false ? '已启用' : '已禁用'}</span>
          </div>
        </FieldWrapper>

        <FieldWrapper label="出站接口" description="interface-name: 指定出站网络接口">
          <input
            type="text"
            value={config['interface-name'] || ''}
            onChange={(e) => set('interface-name', e.target.value)}
            placeholder="例如 eth0"
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          />
        </FieldWrapper>
      </div>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">进程匹配</h3>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="进程匹配模式" description="find-process-mode" advanced stashSupport={false}>
          <SelectField
            value={config['find-process-mode'] || ''}
            onChange={(v) => set('find-process-mode', v)}
            options={FIND_PROCESS_MODES}
            placeholder="strict"
          />
        </FieldWrapper>
      </div>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">External Controller</h3>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="API 监听地址" description="external-controller" example="127.0.0.1:9090" stashSupport={false}>
          <input
            type="text"
            value={config['external-controller'] || ''}
            onChange={(e) => set('external-controller', e.target.value)}
            placeholder="127.0.0.1:9090"
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label="API 密钥" description="secret" stashSupport={false}>
          <input
            type="password"
            value={config.secret || ''}
            onChange={(e) => set('secret', e.target.value)}
            placeholder="输入密钥"
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label="HTTPS API 地址" description="external-controller-tls" advanced stashSupport={false}>
          <input
            type="text"
            value={config['external-controller-tls'] || ''}
            onChange={(e) => set('external-controller-tls', e.target.value)}
            placeholder="127.0.0.1:9443"
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label="外部 UI 路径" description="external-ui" advanced stashSupport={false}>
          <input
            type="text"
            value={config['external-ui'] || ''}
            onChange={(e) => set('external-ui', e.target.value)}
            placeholder="/path/to/ui"
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
          />
        </FieldWrapper>
      </div>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">连接</h3>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="TCP Keep Alive 间隔" description="keep-alive-interval (秒)" advanced stashSupport={false}>
          <NumberField
            value={config['keep-alive-interval']}
            onChange={(v) => set('keep-alive-interval', v)}
            placeholder="0"
            min={0}
          />
        </FieldWrapper>

        <FieldWrapper label="禁用 Keep Alive" description="disable-keep-alive" advanced stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config['disable-keep-alive'] || false}
              onChange={(e) => set('disable-keep-alive', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="TCP 并发连接" description="tcp-concurrent" advanced stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config['tcp-concurrent'] || false}
              onChange={(e) => set('tcp-concurrent', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="统一延迟" description="unified-delay" advanced stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config['unified-delay'] || false}
              onChange={(e) => set('unified-delay', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>
      </div>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">GeoData</h3>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="GeoData 格式" description="geodata-mode (true=dat, false=mmdb)" advanced stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config['geodata-mode'] || false}
              onChange={(e) => set('geodata-mode', e.target.checked)}
              className="size-4 rounded border-input"
            />
            <span className="text-xs text-muted-foreground">{config['geodata-mode'] ? 'dat 格式' : 'mmdb 格式'}</span>
          </div>
        </FieldWrapper>

        <FieldWrapper label="GeoData 加载器" description="geodata-loader" advanced stashSupport={false}>
          <SelectField
            value={config['geodata-loader'] || ''}
            onChange={(v) => set('geodata-loader', v)}
            options={GEODATA_LOADERS}
            placeholder="memconservative"
          />
        </FieldWrapper>

        <FieldWrapper label="自动更新 GEO" description="geo-auto-update" advanced stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config['geo-auto-update'] || false}
              onChange={(e) => set('geo-auto-update', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="GEO 更新间隔" description="geo-update-interval (小时)" advanced stashSupport={false}>
          <NumberField
            value={config['geo-update-interval']}
            onChange={(v) => set('geo-update-interval', v)}
            placeholder="24"
            min={1}
          />
        </FieldWrapper>
      </div>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Profile</h3>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="持久化选中组" description="profile.store-selected" stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.profile?.['store-selected'] ?? true}
              onChange={(e) => set('profile.store-selected', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="持久化 Fake IP" description="profile.store-fake-ip" advanced stashSupport={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.profile?.['store-fake-ip'] || false}
              onChange={(e) => set('profile.store-fake-ip', e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </FieldWrapper>
      </div>
    </div>
  )
}
