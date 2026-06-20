import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavTree } from '@/components/layout/NavTree'
import { useUiStore } from '@/store/ui-store'

describe('NavTree component', () => {
  beforeEach(() => {
    useUiStore.setState({ activeSection: 'dashboard', sidebarOpen: true })
  })

  it('should render dashboard link', () => {
    render(<NavTree />)
    expect(screen.getByText('工作台')).toBeInTheDocument()
  })

  it('should render general section', () => {
    render(<NavTree />)
    expect(screen.getByText('通用')).toBeInTheDocument()
  })

  it('should use the global settings label for the general child page', () => {
    useUiStore.setState({ activeSection: 'general' })
    render(<NavTree />)

    expect(screen.getByText('全局设置')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<NavTree />)
    const input = screen.getByPlaceholderText('搜索配置项...')
    expect(input).toBeInTheDocument()
  })

  it('should filter nav items when typing in search field', async () => {
    const user = userEvent.setup()
    render(<NavTree />)

    const input = screen.getByPlaceholderText('搜索配置项...') as HTMLInputElement
    await user.type(input, '代理')

    expect(input.value).toBe('代理')
    expect(screen.getByText('代理节点')).toBeInTheDocument()
    expect(screen.getByText('代理 Provider')).toBeInTheDocument()
    expect(screen.queryByText('工作台')).not.toBeInTheDocument()
  })

  it('should show all items when search is empty', async () => {
    const user = userEvent.setup()
    render(<NavTree />)

    const input = screen.getByPlaceholderText('搜索配置项...') as HTMLInputElement
    await user.type(input, '代理')
    await user.clear(input)

    expect(screen.getByText('工作台')).toBeInTheDocument()
    expect(screen.getByText('代理节点')).toBeInTheDocument()
  })

  it('should render settings link', () => {
    render(<NavTree />)
    expect(screen.getByText('设置')).toBeInTheDocument()
  })

  it('should group platform-specific editors under Advanced', async () => {
    const user = userEvent.setup()
    render(<NavTree />)

    expect(screen.queryByText('iptables')).not.toBeInTheDocument()
    await user.click(screen.getByText('高级'))

    expect(useUiStore.getState().activeSection).toBe('experimental')
    expect(screen.getByText('iptables')).toBeInTheDocument()
    expect(screen.getByText('ebpf')).toBeInTheDocument()
    expect(screen.getByText('Experimental')).toBeInTheDocument()
    expect(screen.getByText('Clash for Android')).toBeInTheDocument()
  })

  it('should expose matching advanced children through search', async () => {
    const user = userEvent.setup()
    render(<NavTree />)

    await user.type(screen.getByPlaceholderText('搜索配置项...'), 'iptables')

    expect(screen.getByText('高级')).toBeInTheDocument()
    expect(screen.getByText('iptables')).toBeInTheDocument()
    expect(screen.queryByText('ebpf')).not.toBeInTheDocument()
  })
})
