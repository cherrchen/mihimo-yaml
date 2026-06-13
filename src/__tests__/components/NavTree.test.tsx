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

  it('should render search input', () => {
    render(<NavTree />)
    const input = screen.getByPlaceholderText('搜索配置项...')
    expect(input).toBeInTheDocument()
  })

  it('should accept text input in search field', async () => {
    const user = userEvent.setup()
    render(<NavTree />)

    const input = screen.getByPlaceholderText('搜索配置项...') as HTMLInputElement
    await user.type(input, 'DNS')
    expect(input.value).toBe('DNS')
  })

  it('should render settings link', () => {
    render(<NavTree />)
    expect(screen.getByText('设置')).toBeInTheDocument()
  })
})
