import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RulesEditor } from '@/components/editors/rules/RulesEditor'
import { useConfigStore } from '@/store/config-store'

describe('RulesEditor component', () => {
  beforeEach(() => {
    useConfigStore.setState({
      config: {
        mode: 'rule',
        proxies: [],
        'proxy-groups': [],
        rules: [
          'DOMAIN-SUFFIX,example.com,DIRECT',
          'DOMAIN-SUFFIX,google.com,PROXY',
          'IP-CIDR,10.0.0.0/8,DIRECT',
        ],
      },
      history: [],
      historyIndex: -1,
      integrityReport: null,
      compatibilityReport: null,
    })
  })

  it('should filter rules case-insensitively and disable dragging', async () => {
    const user = userEvent.setup()
    render(<RulesEditor />)

    await user.type(screen.getByPlaceholderText('搜索规则关键词...'), 'GOOGLE')

    expect(screen.getByText('google.com')).toBeInTheDocument()
    expect(screen.queryByText('example.com')).not.toBeInTheDocument()
    expect(screen.getByLabelText('搜索时不可排序')).toBeDisabled()
  })

  it('should delete the matching rule by its original index', async () => {
    const user = userEvent.setup()
    render(<RulesEditor />)

    await user.type(screen.getByPlaceholderText('搜索规则关键词...'), 'google')
    await user.click(screen.getByLabelText('删除规则 2'))

    expect(useConfigStore.getState().config.rules).toEqual([
      'DOMAIN-SUFFIX,example.com,DIRECT',
      'IP-CIDR,10.0.0.0/8,DIRECT',
    ])
  })

  it('should show a dedicated empty search state', async () => {
    const user = userEvent.setup()
    render(<RulesEditor />)

    await user.type(screen.getByPlaceholderText('搜索规则关键词...'), 'not-present')

    expect(screen.getByText('没有找到匹配“not-present”的规则。')).toBeInTheDocument()
  })
})
