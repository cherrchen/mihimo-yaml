import { useConfigStore } from '@/store/config-store'
import { EditorSection } from '@/components/editors/shared/EditorSection'
import { FieldWrapper } from '@/components/editors/shared/FieldWrapper'
import { BoolField, SelectField, NumberField, TextField } from '@/components/editors/shared/fields'
import { SensitiveField } from '@/components/editors/shared/SensitiveField'
import { MODES, LOG_LEVELS, FIND_PROCESS_MODES, GEODATA_LOADERS } from '@/lib/constants'

const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

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
    <div className="mx-auto max-w-3xl space-y-5 p-6">
      <h2 className="text-sm font-semibold">全局设置</h2>

      <EditorSection
        title="核心运行"
        description="控制代理运行方式、日志输出和默认网络出口。"
      >
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper
            label="代理模式"
            help="决定流量按规则分流、全部走代理或全部直连。"
            yamlKey="mode"
            defaultValue="rule"
            required
          >
            <SelectField
              value={config.mode || ''}
              onChange={(v) => set('mode', v)}
              options={MODES}
              emptyPlaceholder="未设置"
            />
          </FieldWrapper>

          <FieldWrapper
            label="日志级别"
            help="控制内核日志详细程度，排查问题时可临时使用 debug。"
            yamlKey="log-level"
            defaultValue="info"
          >
            <SelectField
              value={config['log-level'] || ''}
              onChange={(v) => set('log-level', v)}
              options={LOG_LEVELS}
              emptyPlaceholder="未设置"
            />
          </FieldWrapper>

          <FieldWrapper
            label="IPv6"
            help="控制 mihomo 是否接收并处理 IPv6 流量；关闭后仅使用 IPv4。"
            yamlKey="ipv6"
            defaultValue
            stashSupport={false}
          >
            <div className="flex items-center gap-2">
              <BoolField value={config.ipv6 ?? true} onChange={(value) => set('ipv6', value)} ariaLabel="IPv6" />
              <span className="text-xs text-muted-foreground">{config.ipv6 !== false ? '已启用' : '已禁用'}</span>
            </div>
          </FieldWrapper>

          <FieldWrapper
            label="出站接口"
            help="强制出站流量使用指定网络接口；留空时由系统路由选择。"
            yamlKey="interface-name"
            example="eth0"
          >
            <TextField
              value={config['interface-name'] || ''}
              onChange={(v) => set('interface-name', v)}
              placeholder="例如 eth0"
            />
          </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection
        title="进程与连接优化"
        description="调整进程识别、长连接保活和 TCP 建连策略。"
        collapsible
        defaultOpen={false}
        stashSupport={false}
      >
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper
            label="进程匹配模式"
            help="决定路由匹配时如何查询发起连接的进程；strict 仅在规则需要时查找。"
            yamlKey="find-process-mode"
            defaultValue="strict"
          >
            <SelectField
              value={config['find-process-mode'] || ''}
              onChange={(v) => set('find-process-mode', v)}
              options={FIND_PROCESS_MODES}
              emptyPlaceholder="未设置"
            />
          </FieldWrapper>

          <FieldWrapper
            label="TCP Keep Alive 间隔"
            help="设置 TCP Keep Alive 探测间隔；0 表示使用内核或默认行为。单位：秒。"
            yamlKey="keep-alive-interval"
          >
            <NumberField
              value={config['keep-alive-interval']}
              onChange={(v) => set('keep-alive-interval', v)}
              placeholder="0"
              min={0}
            />
          </FieldWrapper>

          <FieldWrapper
            label="禁用 Keep Alive"
            help="关闭 TCP Keep Alive；启用后可能影响长连接的存活检测。"
            yamlKey="disable-keep-alive"
            defaultValue={false}
          >
            <BoolField value={config['disable-keep-alive'] || false} onChange={(value) => set('disable-keep-alive', value)} ariaLabel="禁用 Keep Alive" />
          </FieldWrapper>

          <FieldWrapper
            label="TCP 并发连接"
            help="允许并发尝试多个 TCP 连接，以更快选择可用连接。"
            yamlKey="tcp-concurrent"
            defaultValue={false}
          >
            <BoolField value={config['tcp-concurrent'] || false} onChange={(value) => set('tcp-concurrent', value)} ariaLabel="TCP 并发连接" />
          </FieldWrapper>

          <FieldWrapper
            label="统一延迟"
            help="统一延迟测试的计算方式，减少不同代理协议之间的测量差异。"
            yamlKey="unified-delay"
            defaultValue={false}
          >
            <BoolField value={config['unified-delay'] || false} onChange={(value) => set('unified-delay', value)} ariaLabel="统一延迟" />
          </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection
        title="外部控制"
        description="配置 RESTful API 与外部控制面板的访问入口。"
        collapsible
        defaultOpen={false}
        stashSupport={false}
      >
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper
            label="API 监听地址"
            help="设置 RESTful API 的监听地址，供控制面板或外部工具连接。"
            yamlKey="external-controller"
            example="127.0.0.1:9090"
          >
            <TextField
              value={config['external-controller'] || ''}
              onChange={(v) => set('external-controller', v)}
              placeholder="127.0.0.1:9090"
            />
          </FieldWrapper>

          <FieldWrapper
            label="API 密钥"
            help="为 RESTful API 设置访问密钥；暴露到非本机地址时应配置。"
            yamlKey="secret"
            sensitive
          >
            <SensitiveField
              value={config.secret || ''}
              onChange={(v) => set('secret', v)}
              label="API 密钥"
              placeholder="输入密钥"
            />
          </FieldWrapper>

          <FieldWrapper
            label="HTTPS API 地址"
            help="设置启用 TLS 的 API 监听地址，需要同时提供有效的 TLS 证书配置。"
            yamlKey="external-controller-tls"
            example="127.0.0.1:9443"
          >
            <TextField
              value={config['external-controller-tls'] || ''}
              onChange={(v) => set('external-controller-tls', v)}
              placeholder="127.0.0.1:9443"
            />
          </FieldWrapper>

          <FieldWrapper
            label="外部 UI 路径"
            help="指定外部控制面板的静态文件目录，供 API 服务托管。"
            yamlKey="external-ui"
            example="/path/to/ui"
          >
            <TextField
              value={config['external-ui'] || ''}
              onChange={(v) => set('external-ui', v)}
              placeholder="/path/to/ui"
            />
          </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection
        title="GEO 数据管理"
        description="管理 GeoIP 与 GeoSite 数据格式、加载方式和更新周期。"
        collapsible
        defaultOpen={false}
        stashSupport={false}
      >
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper
            label="GeoData 格式"
            help="选择 GEO 数据文件格式；启用时使用 dat，关闭时使用 mmdb。"
            yamlKey="geodata-mode"
            defaultValue={false}
          >
            <div className="flex items-center gap-2">
              <BoolField value={config['geodata-mode'] || false} onChange={(value) => set('geodata-mode', value)} ariaLabel="GeoData 格式" />
              <span className="text-xs text-muted-foreground">{config['geodata-mode'] ? 'dat 格式' : 'mmdb 格式'}</span>
            </div>
          </FieldWrapper>

          <FieldWrapper
            label="GeoData 加载器"
            help="选择 GEO 数据加载方式；memconservative 更节省内存，standard 更偏向读取性能。"
            yamlKey="geodata-loader"
            defaultValue="memconservative"
          >
            <SelectField
              value={config['geodata-loader'] || ''}
              onChange={(v) => set('geodata-loader', v)}
              options={GEODATA_LOADERS}
              emptyPlaceholder="未设置"
            />
          </FieldWrapper>

          <FieldWrapper
            label="自动更新 GEO"
            help="允许内核按计划自动更新 GEO 数据文件。"
            yamlKey="geo-auto-update"
            defaultValue={false}
          >
            <BoolField value={config['geo-auto-update'] || false} onChange={(value) => set('geo-auto-update', value)} ariaLabel="自动更新 GEO" />
          </FieldWrapper>

          <FieldWrapper
            label="GEO 更新间隔"
            help="设置自动更新 GEO 数据的时间间隔，仅在自动更新开启时生效。单位：小时。"
            yamlKey="geo-update-interval"
            defaultValue={24}
          >
            <NumberField
              value={config['geo-update-interval']}
              onChange={(v) => set('geo-update-interval', v)}
              placeholder="24"
              min={1}
            />
          </FieldWrapper>
        </div>
      </EditorSection>

      <EditorSection
        title="状态持久化"
        description="控制重启后是否保留代理组选择和 Fake IP 映射。"
        collapsible
        defaultOpen={false}
        stashSupport={false}
      >
        <div className={FIELD_GRID_CLASS}>
          <FieldWrapper
            label="持久化选中组"
            help="保存代理组的最后选择，重启后继续使用。"
            yamlKey="profile.store-selected"
            defaultValue
          >
            <BoolField value={config.profile?.['store-selected'] ?? true} onChange={(value) => set('profile.store-selected', value)} ariaLabel="持久化选中组" />
          </FieldWrapper>

          <FieldWrapper
            label="持久化 Fake IP"
            help="保存 Fake IP 映射，重启后尽量保持域名与 Fake IP 的对应关系。"
            yamlKey="profile.store-fake-ip"
            defaultValue={false}
          >
            <BoolField value={config.profile?.['store-fake-ip'] || false} onChange={(value) => set('profile.store-fake-ip', value)} ariaLabel="持久化 Fake IP" />
          </FieldWrapper>
        </div>
      </EditorSection>
    </div>
  )
}
