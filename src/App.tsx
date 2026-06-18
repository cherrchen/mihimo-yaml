import { Suspense, lazy, useEffect, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { NavTree } from '@/components/layout/NavTree'
import { useUiStore } from '@/store/ui-store'
import { useConfigStore } from '@/store/config-store'
import { DashboardPage } from '@/pages/Dashboard'
import { ConfigBackgroundTasks } from '@/components/ConfigBackgroundTasks'

const YamlPreview = lazy(() => import('@/components/preview/YamlPreview').then((m) => ({ default: m.YamlPreview })))
const GeneralEditor = lazy(() => import('@/components/editors/general/GeneralEditor').then((m) => ({ default: m.GeneralEditor })))
const DnsEditor = lazy(() => import('@/components/editors/dns/DnsEditor').then((m) => ({ default: m.DnsEditor })))
const HostsEditor = lazy(() => import('@/components/editors/hosts/HostsEditor').then((m) => ({ default: m.HostsEditor })))
const ProxiesEditor = lazy(() => import('@/components/editors/proxies/ProxiesEditor').then((m) => ({ default: m.ProxiesEditor })))
const ProxyGroupsEditor = lazy(() => import('@/components/editors/proxy-groups/ProxyGroupsEditor').then((m) => ({ default: m.ProxyGroupsEditor })))
const RulesEditor = lazy(() => import('@/components/editors/rules/RulesEditor').then((m) => ({ default: m.RulesEditor })))
const RuleProvidersEditor = lazy(() => import('@/components/editors/rule-providers/RuleProvidersEditor').then((m) => ({ default: m.RuleProvidersEditor })))
const ProxyProvidersEditor = lazy(() => import('@/components/editors/proxy-providers/ProxyProvidersEditor').then((m) => ({ default: m.ProxyProvidersEditor })))
const InboundsEditor = lazy(() => import('@/components/editors/inbounds/InboundsEditor').then((m) => ({ default: m.InboundsEditor })))
const TunEditor = lazy(() => import('@/components/editors/tun/TunEditor').then((m) => ({ default: m.TunEditor })))
const SnifferEditor = lazy(() => import('@/components/editors/sniffer/SnifferEditor').then((m) => ({ default: m.SnifferEditor })))
const SubRulesEditor = lazy(() => import('@/components/editors/sub-rules/SubRulesEditor').then((m) => ({ default: m.SubRulesEditor })))
const TunnelsEditor = lazy(() => import('@/components/editors/tunnels/TunnelsEditor').then((m) => ({ default: m.TunnelsEditor })))
const NtpEditor = lazy(() => import('@/components/editors/ntp/NtpEditor').then((m) => ({ default: m.NtpEditor })))
const ExperimentalEditor = lazy(() => import('@/components/editors/experimental/ExperimentalEditor').then((m) => ({ default: m.ExperimentalEditor })))
const ChainBuilderEditor = lazy(() => import('@/components/editors/chain-builder/ChainBuilderEditor').then((m) => ({ default: m.ChainBuilderEditor })))
const IptablesEditor = lazy(() => import('@/components/editors/iptables/IptablesEditor').then((m) => ({ default: m.IptablesEditor })))
const EbpfEditor = lazy(() => import('@/components/editors/ebpf/EbpfEditor').then((m) => ({ default: m.EbpfEditor })))
const ClashForAndroidEditor = lazy(() => import('@/components/editors/clash-for-android/ClashForAndroidEditor').then((m) => ({ default: m.ClashForAndroidEditor })))
const AboutPage = lazy(() => import('@/pages/About').then((m) => ({ default: m.AboutPage })))
const SettingsPage = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.SettingsPage })))

function LoadingPanel() {
  return (
    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
      加载中...
    </div>
  )
}

export default function App() {
  const activeSection = useUiStore((state) => state.activeSection)
  const sidebarWidth = useUiStore((state) => state.sidebarWidth)
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)

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
      case 'iptables': return <IptablesEditor />
      case 'ebpf': return <EbpfEditor />
      case 'clash-for-android': return <ClashForAndroidEditor />
      case 'about': return <AboutPage />
      case 'settings': return <SettingsPage />
      default: return <DashboardPage />
    }
  }

  return (
    <>
      <ConfigBackgroundTasks />
      <AppShell
        header={<Header />}
        sidebar={<NavTree />}
        sidebarWidth={sidebarWidth}
        sidebarOpen={sidebarOpen}
        previewPanel={(
          <Suspense fallback={<LoadingPanel />}>
            <YamlPreview />
          </Suspense>
        )}
      >
        <Suspense fallback={<LoadingPanel />}>
          {renderEditor()}
        </Suspense>
      </AppShell>
    </>
  )
}
