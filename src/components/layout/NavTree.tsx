import { useState, useMemo } from 'react'
import {
  LayoutDashboard,
  Settings,
  Globe,
  Server,
  ShieldCheck,
  Share2,
  Rss,
  Network,
  ArrowLeftRight,
  Route,
  FolderTree,
  Workflow,
  Link,
  Clock,
  FlaskConical,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore, type NavSection } from '@/store/ui-store'
import { Badge } from '@/components/ui/badge'
import { useConfigStore } from '@/store/config-store'

interface NavItem {
  id: NavSection
  label: string
  icon: LucideIcon
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '工作台', icon: LayoutDashboard },
  {
    id: 'general',
    label: '通用',
    icon: Settings,
    children: [
      { id: 'general', label: '全局设置', icon: Globe },
      { id: 'dns', label: 'DNS', icon: Server },
      { id: 'hosts', label: 'Hosts', icon: Network },
    ],
  },
  {
    id: 'inbounds',
    label: '入站',
    icon: Network,
    children: [
      { id: 'inbounds', label: 'Inbounds', icon: ArrowLeftRight },
      { id: 'tun', label: 'TUN', icon: Network },
      { id: 'sniffer', label: 'Sniffer', icon: ShieldCheck },
    ],
  },
  { id: 'proxies', label: '代理节点', icon: Share2, badge: '0' },
  { id: 'proxy-providers', label: '代理 Provider', icon: Rss },
  { id: 'proxy-groups', label: '代理组', icon: FolderTree },
  { id: 'chain-builder', label: '链路构建器', icon: Link },
  { id: 'rule-providers', label: '规则 Provider', icon: Rss },
  { id: 'rules', label: '路由规则', icon: Route, badge: '0' },
  { id: 'sub-rules', label: '子规则', icon: Workflow },
  { id: 'tunnels', label: '隧道', icon: Network },
  { id: 'ntp', label: 'NTP', icon: Clock },
  {
    id: 'experimental',
    label: '高级',
    icon: SlidersHorizontal,
    children: [
      { id: 'iptables', label: 'iptables', icon: Network },
      { id: 'ebpf', label: 'ebpf', icon: Network },
      { id: 'experimental', label: 'Experimental', icon: FlaskConical },
      { id: 'clash-for-android', label: 'Clash for Android', icon: Settings },
    ],
  },
]

export function NavTree() {
  const { activeSection, setActiveSection } = useUiStore()
  const config = useConfigStore((s) => s.config)
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return NAV_ITEMS

    const matches = (label: string) => label.toLowerCase().includes(normalizedSearch)
    return NAV_ITEMS.flatMap((item) => {
      if (matches(item.label)) return [item]
      const matchingChildren = item.children?.filter((child) => matches(child.label)) || []
      return matchingChildren.length > 0 ? [{ ...item, children: matchingChildren }] : []
    })
  }, [search])

  const getBadge = (item: NavItem): string | undefined => {
    if (item.id === 'proxies') return String(config.proxies?.length || 0)
    if (item.id === 'rules') return String(config.rules?.length || 0)
    return item.badge
  }

  const isActive = (item: NavItem): boolean => {
    return activeSection === item.id || (item.children?.some((c) => c.id === activeSection) ?? false)
  }

  return (
    <div className="relative p-2 h-full">
      <div className="mb-3 px-2 py-1">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索配置项..."
          className="w-full px-2 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <nav className="space-y-0.5">
        {filteredItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setActiveSection(item.id)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors text-left',
                activeSection === item.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <item.icon className="size-3.5 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {getBadge(item) && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                  {getBadge(item)}
                </Badge>
              )}
            </button>

            {item.children && (isActive(item) || Boolean(search.trim())) && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setActiveSection(child.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1 text-xs rounded-md transition-colors text-left',
                      activeSection === child.id
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )}
                  >
                    <child.icon className="size-3 shrink-0" />
                    <span className="truncate">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="pt-2 px-2 space-y-0.5">
          <button
            onClick={() => setActiveSection('settings')}
            className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground block"
          >
            设置
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground block"
          >
            About / 关于 · CC BY-NC 4.0
          </button>
        </div>
      </div>
    </div>
  )
}
