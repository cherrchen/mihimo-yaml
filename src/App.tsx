import { useEffect, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { NavTree } from '@/components/layout/NavTree'
import { YamlPreview } from '@/components/preview/YamlPreview'
import { useUiStore } from '@/store/ui-store'
import { useConfigStore } from '@/store/config-store'
import { useAutoSave } from '@/hooks/useAutoSave'
import { DashboardPage } from '@/pages/Dashboard'
import { GeneralEditor } from '@/components/editors/general/GeneralEditor'
import { DnsEditor } from '@/components/editors/dns/DnsEditor'
import { HostsEditor } from '@/components/editors/hosts/HostsEditor'
import { ProxiesEditor } from '@/components/editors/proxies/ProxiesEditor'
import { ProxyGroupsEditor } from '@/components/editors/proxy-groups/ProxyGroupsEditor'
import { RulesEditor } from '@/components/editors/rules/RulesEditor'
import { RuleProvidersEditor } from '@/components/editors/rule-providers/RuleProvidersEditor'
import { PlaceholderEditor } from '@/components/editors/shared/PlaceholderEditor'

export default function App() {
  const { activeSection, sidebarWidth, sidebarOpen } = useUiStore()

  // Auto-save
  useAutoSave()

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      useConfigStore.getState().undo()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Z') {
      e.preventDefault()
      useConfigStore.getState().redo()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      const store = useConfigStore.getState()
      store.setConfigYaml('')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const renderEditor = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardPage />
      case 'general': return <GeneralEditor />
      case 'dns': return <DnsEditor />
      case 'hosts': return <HostsEditor />
      case 'inbounds': return <PlaceholderEditor title="Inbounds / 入站配置" />
      case 'tun': return <PlaceholderEditor title="TUN 配置" />
      case 'sniffer': return <PlaceholderEditor title="Sniffer / 域名嗅探" />
      case 'proxies': return <ProxiesEditor />
      case 'proxy-providers': return <PlaceholderEditor title="Proxy Providers" />
      case 'proxy-groups': return <ProxyGroupsEditor />
      case 'chain-builder': return <PlaceholderEditor title="链路构建器" />
      case 'rule-providers': return <RuleProvidersEditor />
      case 'rules': return <RulesEditor />
      case 'sub-rules': return <PlaceholderEditor title="Sub-rules" />
      case 'tunnels': return <PlaceholderEditor title="Tunnels" />
      case 'ntp': return <PlaceholderEditor title="NTP 配置" />
      case 'experimental': return <PlaceholderEditor title="Experimental 配置" />
      default: return <DashboardPage />
    }
  }

  return (
    <AppShell
      header={<Header />}
      sidebar={<NavTree />}
      sidebarWidth={sidebarWidth}
      sidebarOpen={sidebarOpen}
      previewPanel={<YamlPreview />}
    >
      {renderEditor()}
    </AppShell>
  )
}
