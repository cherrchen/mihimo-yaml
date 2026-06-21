import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentType } from 'react'
import { DnsEditor } from '@/components/editors/dns/DnsEditor'
import { HostsEditor } from '@/components/editors/hosts/HostsEditor'
import { TunEditor } from '@/components/editors/tun/TunEditor'
import { SnifferEditor } from '@/components/editors/sniffer/SnifferEditor'
import { RuleProvidersEditor } from '@/components/editors/rule-providers/RuleProvidersEditor'
import { TunnelsEditor } from '@/components/editors/tunnels/TunnelsEditor'
import { NtpEditor } from '@/components/editors/ntp/NtpEditor'
import { ExperimentalEditor } from '@/components/editors/experimental/ExperimentalEditor'
import { IptablesEditor } from '@/components/editors/iptables/IptablesEditor'
import { EbpfEditor } from '@/components/editors/ebpf/EbpfEditor'
import { ClashForAndroidEditor } from '@/components/editors/clash-for-android/ClashForAndroidEditor'
import { useConfigStore } from '@/store/config-store'

const EDITORS: Array<[string, ComponentType, string]> = [
  ['DNS', DnsEditor, '解析与上游'],
  ['Hosts', HostsEditor, '静态解析'],
  ['TUN', TunEditor, '启用与路由'],
  ['Sniffer', SnifferEditor, '基本嗅探'],
  ['规则 Provider', RuleProvidersEditor, 'Provider 列表'],
  ['隧道', TunnelsEditor, '端口转发'],
  ['NTP', NtpEditor, '同步服务'],
  ['Experimental', ExperimentalEditor, '实验性网络选项'],
  ['iptables', IptablesEditor, '透明代理转发'],
  ['ebpf', EbpfEditor, 'eBPF 转发'],
  ['Clash for Android', ClashForAndroidEditor, 'Android 客户端行为'],
]

describe('migrated editor UX', () => {
  beforeEach(() => {
    useConfigStore.setState({
      config: { mode: 'rule', proxies: [], rules: ['MATCH,DIRECT'] },
      history: [],
      historyIndex: -1,
      integrityReport: null,
      compatibilityReport: null,
    })
  })

  it.each(EDITORS)('renders the NavTree title and core section for %s', (title, Editor, section) => {
    render(<Editor />)

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByText(section)).toBeInTheDocument()
  })

  it.each([
    [TunEditor, 'DNS 与路由范围', 'DNS 劫持'],
    [SnifferEditor, '协议与端口', '嗅探协议'],
    [NtpEditor, '系统与路由', '写入系统时钟'],
    [EbpfEditor, '接口映射', '自动重定向接口'],
  ] as Array<[ComponentType, string, string]>)('keeps non-core fields collapsed by default', async (Editor, section, field) => {
    const user = userEvent.setup()
    render(<Editor />)

    const trigger = screen.getByRole('button', { name: new RegExp(section) })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText(field)).not.toBeInTheDocument()

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it('shows DNS conditional sections and hidden select placeholders without changing defaults', () => {
    useConfigStore.setState({
      config: {
        mode: 'rule',
        dns: { 'enhanced-mode': 'fake-ip', fallback: ['1.1.1.1'] },
        proxies: [],
        rules: ['MATCH,DIRECT'],
      },
    })
    render(<DnsEditor />)

    expect(screen.getByRole('button', { name: /Fake IP/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /Fallback 过滤/ })).toHaveAttribute('aria-expanded', 'false')

    const modeSelect = screen.getAllByRole('combobox')[0] as HTMLSelectElement
    const emptyOption = modeSelect.querySelector('option[value=""]') as HTMLOptionElement
    expect(emptyOption).toHaveTextContent('未设置')
    expect(emptyOption.disabled).toBe(true)
    expect(emptyOption.hidden).toBe(true)
  })

  it('provides Chinese field help with YAML metadata', async () => {
    const user = userEvent.setup()
    render(<TunEditor />)

    await user.hover(screen.getByRole('button', { name: '查看协议栈说明' }))

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('选择 TUN 使用的网络协议栈')
    expect(tooltip).toHaveTextContent('YAML 字段：tun.stack')
    expect(tooltip).toHaveTextContent('默认值：gvisor')
  })

  it('uses responsive one-to-two column field grids', () => {
    render(<NtpEditor />)

    const grid = screen.getByText('启用时间同步').closest('section')?.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2')
  })

  it('adds and removes a Hosts entry from the empty state', async () => {
    const user = userEvent.setup()
    render(<HostsEditor />)

    await user.click(screen.getByRole('button', { name: '添加第一条记录' }))
    expect(useConfigStore.getState().config.hosts).toEqual({ '': '' })

    await user.click(screen.getByRole('button', { name: '删除 Hosts 条目 1' }))
    expect(useConfigStore.getState().config.hosts).toEqual({})
  })

  it('adds and removes a responsive tunnel card', async () => {
    const user = userEvent.setup()
    render(<TunnelsEditor />)

    await user.click(screen.getByRole('button', { name: '添加第一条隧道' }))
    expect(useConfigStore.getState().config.tunnels).toHaveLength(1)
    expect(screen.getByText('网络类型').closest('.grid')).toHaveClass('grid-cols-1', 'md:grid-cols-2')

    await user.click(screen.getByRole('button', { name: '删除隧道 1' }))
    expect(useConfigStore.getState().config.tunnels).toEqual([])
  })

  it('keeps the rule template card visible above the provider list and applies a template', async () => {
    const user = userEvent.setup()
    render(<RuleProvidersEditor />)

    const templateHeading = screen.getByRole('heading', { name: 'MetaCubeX 规则集模板' })
    const providerHeading = screen.getByText('Provider 列表')
    expect(templateHeading.compareDocumentPosition(providerHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'cn domain' }))

    expect(useConfigStore.getState().config['rule-providers']?.cn).toMatchObject({
      type: 'http',
      behavior: 'domain',
      format: 'mrs',
    })
  })
})
