import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GeneralEditor } from '@/components/editors/general/GeneralEditor'
import { useConfigStore } from '@/store/config-store'

describe('GeneralEditor component', () => {
  beforeEach(() => {
    useConfigStore.getState().resetConfig()
    useConfigStore.setState({ hasUnsavedChanges: false })
  })

  it('should render the unified title and five task-based sections', () => {
    render(<GeneralEditor />)

    expect(screen.getByRole('heading', { name: '全局设置' })).toBeInTheDocument()
    expect(screen.getByText('核心运行')).toBeInTheDocument()
    expect(screen.getByText('进程与连接优化')).toBeInTheDocument()
    expect(screen.getByText('外部控制')).toBeInTheDocument()
    expect(screen.getByText('GEO 数据管理')).toBeInTheDocument()
    expect(screen.getByText('状态持久化')).toBeInTheDocument()
    expect(screen.getByText('代理模式')).toBeInTheDocument()
    expect(screen.queryByText('进程匹配模式')).not.toBeInTheDocument()
    expect(screen.queryByText('API 监听地址')).not.toBeInTheDocument()
    expect(screen.queryByText('GeoData 格式')).not.toBeInTheDocument()
    expect(screen.queryByText('持久化选中组')).not.toBeInTheDocument()

    for (const section of ['进程与连接优化', '外部控制', 'GEO 数据管理', '状态持久化']) {
      expect(screen.getByRole('button', { name: new RegExp(section) })).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('should expand advanced settings as a whole section', async () => {
    const user = userEvent.setup()
    render(<GeneralEditor />)

    const trigger = screen.getByRole('button', { name: /进程与连接优化/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('进程匹配模式')).toBeInTheDocument()
    expect(screen.getByText('TCP Keep Alive 间隔')).toBeInTheDocument()
    expect(screen.getByText('统一延迟')).toBeInTheDocument()
  })

  it('should show Chinese field help on hover', async () => {
    const user = userEvent.setup()
    render(<GeneralEditor />)

    await user.hover(screen.getByRole('button', { name: '查看日志级别说明' }))

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('控制内核日志详细程度')
    expect(tooltip).toHaveTextContent('YAML 字段：log-level')
    expect(tooltip).toHaveTextContent('默认值：info')
  })

  it('should show field help on keyboard focus and close it with Escape', async () => {
    const user = userEvent.setup()
    render(<GeneralEditor />)

    const trigger = screen.getByRole('button', { name: '查看代理模式说明' })
    trigger.focus()

    expect(await screen.findByRole('tooltip')).toHaveTextContent('决定流量按规则分流')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('should only show the empty placeholder when a select is unset', () => {
    useConfigStore.setState({ config: {} })
    render(<GeneralEditor />)

    const modeSelect = screen.getAllByRole('combobox')[0] as HTMLSelectElement
    const emptyOption = modeSelect.querySelector('option[value=""]') as HTMLOptionElement

    expect(modeSelect).toHaveValue('')
    expect(emptyOption).toHaveTextContent('未设置')
    expect(emptyOption.disabled).toBe(true)
    expect(emptyOption.hidden).toBe(true)
  })

  it('should update mode in the store when selected', async () => {
    const user = userEvent.setup()
    render(<GeneralEditor />)

    await user.selectOptions(screen.getAllByRole('combobox')[0], 'global')

    expect(useConfigStore.getState().config.mode).toBe('global')
  })

  it('should render and update boolean settings through switches', async () => {
    const user = userEvent.setup()
    render(<GeneralEditor />)

    const ipv6 = screen.getByRole('switch', { name: 'IPv6' })
    expect(ipv6).toBeChecked()
    expect(document.querySelector('input[type="checkbox"]')).not.toBeInTheDocument()

    await user.click(ipv6)
    expect(useConfigStore.getState().config.ipv6).toBe(false)
  })

  it('should use a responsive one-to-two column field grid', () => {
    render(<GeneralEditor />)

    const modeSelect = screen.getAllByRole('combobox')[0]
    const grid = modeSelect.closest('.grid')

    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2')
  })
})
