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
import { ProxyProvidersEditor } from '@/components/editors/proxy-providers/ProxyProvidersEditor'
import { InboundsEditor } from '@/components/editors/inbounds/InboundsEditor'
import { TunEditor } from '@/components/editors/tun/TunEditor'
import { SnifferEditor } from '@/components/editors/sniffer/SnifferEditor'
import { SubRulesEditor } from '@/components/editors/sub-rules/SubRulesEditor'
import { TunnelsEditor } from '@/components/editors/tunnels/TunnelsEditor'
import { NtpEditor } from '@/components/editors/ntp/NtpEditor'
import { ExperimentalEditor } from '@/components/editors/experimental/ExperimentalEditor'
import { ChainBuilderEditor } from '@/components/editors/chain-builder/ChainBuilderEditor'
import { AboutPage } from '@/pages/About'
import { SettingsPage } from '@/pages/Settings'

export default function App() {
  const { activeSection, sidebarWidth, sidebarOpen } = useUiStore()

  useAutoSave()

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
      case 'inbounds': return <InboundsEditor />
      case 'tun': return <TunEditor />
      case 'sniffer': return <SnifferEditor />
      case 'proxies': return <ProxiesEditor />
      case 'proxy-providers': return <ProxyProvidersEditor />
      case 'proxy-groups': return <ProxyGroupsEditor />
      case 'chain-builder': return <ChainBuilderEditor />
      case 'rule-providers': return <RuleProvidersEditor />
      case 'rules': return <RulesEditor />
      case 'sub-rules': return <SubRulesEditor />
      case 'tunnels': return <TunnelsEditor />
      case 'ntp': return <NtpEditor />
      case 'experimental': return <ExperimentalEditor />
      case 'about': return <AboutPage />
      case 'settings': return <SettingsPage />
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
