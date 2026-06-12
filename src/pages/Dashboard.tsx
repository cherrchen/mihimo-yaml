import { FileUp, Link, Clipboard, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'
import { MINIMAL_CONFIG, FAKE_IP_TEMPLATE, STASH_TEMPLATE, CN_DIRECT_TEMPLATE, CHAIN_PROXY_TEMPLATE } from '@/schema/defaults'
import type { MihomoConfig } from '@/schema/model'

export function DashboardPage() {
  const { setConfig, setConfigName, resetConfig } = useConfigStore()
  const { setActiveSection } = useUiStore()

  const handleNew = () => {
    resetConfig()
    setActiveSection('general')
  }

  const handleTemplate = (name: string, config: MihomoConfig) => {
    setConfig(config)
    setConfigName(`${name} - 副本`)
    setActiveSection('general')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">配置工作台</h2>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">快速开始</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleNew} className="h-auto py-4 justify-start gap-3">
            <Plus className="size-5 text-primary" />
            <div className="text-left">
              <div className="text-sm font-medium">新建配置</div>
              <div className="text-xs text-muted-foreground">从最小模板开始</div>
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-4 justify-start gap-3">
            <FileUp className="size-5" />
            <div className="text-left">
              <div className="text-sm font-medium">导入 YAML 文件</div>
              <div className="text-xs text-muted-foreground">从本地文件导入</div>
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-4 justify-start gap-3">
            <Link className="size-5" />
            <div className="text-left">
              <div className="text-sm font-medium">从 URL 拉取</div>
              <div className="text-xs text-muted-foreground">输入订阅链接或配置 URL</div>
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-4 justify-start gap-3">
            <Clipboard className="size-5" />
            <div className="text-left">
              <div className="text-sm font-medium">粘贴 YAML</div>
              <div className="text-xs text-muted-foreground">从剪贴板导入</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Templates */}
      <div className="mb-8">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">模板库</h3>
        <div className="space-y-2">
          {[
            { name: '最小配置', desc: '最小 mihomo 配置，开箱即用', config: MINIMAL_CONFIG },
            { name: 'Fake-IP 配置', desc: '启用 Fake-IP 增强模式的 DNS 配置', config: FAKE_IP_TEMPLATE },
            { name: 'Stash 兼容配置', desc: '兼容 Stash 的基础配置模板', config: STASH_TEMPLATE },
            { name: '国内直连模板', desc: '基于 MetaCubeX 规则集的国内直连规则', config: CN_DIRECT_TEMPLATE },
            { name: '链式代理示例', desc: '通过 dialer-proxy 和 relay 构建链路', config: CHAIN_PROXY_TEMPLATE },
          ].map((tpl) => (
            <div
              key={tpl.name}
              onClick={() => handleTemplate(tpl.name, tpl.config)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border hover:bg-accent cursor-pointer transition-colors"
            >
              <div>
                <div className="text-sm font-medium">{tpl.name}</div>
                <div className="text-xs text-muted-foreground">{tpl.desc}</div>
              </div>
              <FileText className="size-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">最近项目</h3>
        <p className="text-xs text-muted-foreground">暂无最近项目</p>
      </div>
    </div>
  )
}
