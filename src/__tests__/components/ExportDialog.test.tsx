import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExportDialog } from '@/components/export/ExportDialog'
import { useConfigStore } from '@/store/config-store'

describe('ExportDialog component', () => {
  beforeEach(() => {
    useConfigStore.getState().resetConfig()
    useConfigStore.getState().updateConfig((draft) => {
      draft.mode = 'rule'
      draft.dns = {
        enable: true,
        nameserver: ['8.8.8.8'],
      }
      draft.proxies = [{ name: 'node', type: 'ss', server: 's.com', port: 8388 }]
      draft['proxy-groups'] = [{ name: 'PROXY', type: 'select', proxies: ['node'] }]
      draft.rules = ['MATCH,PROXY']
    })
    useConfigStore.setState({ hasUnsavedChanges: false, configName: 'test-config' })
  })

  it('should render mihomo export dialog', () => {
    render(<ExportDialog open mode="mihomo" onClose={() => {}} />)
    expect(screen.getByText('Mihomo 完整导出')).toBeInTheDocument()
  })

  it('should render Stash export dialog', () => {
    render(<ExportDialog open mode="stash" onClose={() => {}} />)
    expect(screen.getByText('Stash 兼容导出')).toBeInTheDocument()
  })

  it('should show compatibility report section', () => {
    render(<ExportDialog open mode="stash" onClose={() => {}} />)
    expect(screen.getByText('兼容性报告')).toBeInTheDocument()
  })

  it('should show download and copy buttons', () => {
    render(<ExportDialog open mode="mihomo" onClose={() => {}} />)
    expect(screen.getByText('下载 .yaml')).toBeInTheDocument()
    expect(screen.getByText('复制到剪贴板')).toBeInTheDocument()
  })

  it('should render nothing when closed', () => {
    const { container } = render(<ExportDialog open={false} mode="mihomo" onClose={() => {}} />)
    expect(container.innerHTML).toBe('')
  })
})
