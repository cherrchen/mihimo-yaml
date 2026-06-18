import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RuleProvidersEditor } from '@/components/editors/rule-providers/RuleProvidersEditor'
import { useConfigStore } from '@/store/config-store'

describe('RuleProvidersEditor component', () => {
  beforeEach(() => {
    useConfigStore.setState({
      config: { mode: 'rule', proxies: [], rules: ['MATCH,DIRECT'] },
      history: [],
      historyIndex: -1,
      integrityReport: null,
      compatibilityReport: null,
    })
  })

  it('should create providers with mrs as the default format', async () => {
    const user = userEvent.setup()
    render(<RuleProvidersEditor />)

    await user.click(screen.getByRole('button', { name: '添加 Provider' }))

    expect(useConfigStore.getState().config['rule-providers']?.['ruleset-1']).toMatchObject({
      type: 'http',
      behavior: 'domain',
      format: 'mrs',
    })
  })
})
