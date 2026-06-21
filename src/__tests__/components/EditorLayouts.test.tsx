import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DnsEditor } from '@/components/editors/dns/DnsEditor'
import { SubRulesEditor } from '@/components/editors/sub-rules/SubRulesEditor'
import { useConfigStore } from '@/store/config-store'

describe('Editor row layouts', () => {
  beforeEach(() => {
    useConfigStore.setState({
      config: {
        mode: 'rule',
        dns: {
          enable: true,
          'nameserver-policy': { 'geosite:cn': '223.5.5.5' },
        },
        'sub-rules': {
          local: ['DOMAIN-SUFFIX,example.com,DIRECT'],
        },
        proxies: [],
        rules: ['MATCH,DIRECT'],
      },
      history: [],
      historyIndex: -1,
      integrityReport: null,
      compatibilityReport: null,
    })
  })

  it('should give both NameServer Policy inputs equal flexible columns', () => {
    const user = userEvent.setup()
    render(<DnsEditor />)

    return user.click(screen.getByRole('button', { name: /域名策略/ })).then(() => {
      const domainInput = screen.getByDisplayValue('geosite:cn')
      const row = domainInput.parentElement

      expect(row).toHaveClass('grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]')
      expect(domainInput).not.toHaveClass('w-32')
    })
  })

  it('should give all three sub-rule controls equal flexible columns', async () => {
    const user = userEvent.setup()
    render(<SubRulesEditor />)

    await user.click(screen.getByText('local'))
    const payloadInput = screen.getByDisplayValue('example.com')
    const row = payloadInput.parentElement

    expect(row).toHaveClass('grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]')
    expect(payloadInput).not.toHaveClass('w-24')
  })
})
