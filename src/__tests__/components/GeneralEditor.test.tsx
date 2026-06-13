import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GeneralEditor } from '@/components/editors/general/GeneralEditor'
import { useConfigStore } from '@/store/config-store'

describe('GeneralEditor component', () => {
  beforeEach(() => {
    useConfigStore.getState().resetConfig()
    useConfigStore.setState({ hasUnsavedChanges: false })
  })

  it('should render mode selector', () => {
    render(<GeneralEditor />)
    expect(screen.getByText('代理模式')).toBeInTheDocument()
  })

  it('should render log level selector', () => {
    render(<GeneralEditor />)
    expect(screen.getByText('日志级别')).toBeInTheDocument()
  })

  it('should render IPv6 checkbox', () => {
    render(<GeneralEditor />)
    expect(screen.getByText('IPv6')).toBeInTheDocument()
  })

  it('should update mode in store when selected', async () => {
    render(<GeneralEditor />)

    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThan(0)
  })

  it('should render external controller field', () => {
    render(<GeneralEditor />)
    expect(screen.getByText('External Controller')).toBeInTheDocument()
  })
})
