import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { YamlPreview } from '@/components/preview/YamlPreview'
import { useConfigStore } from '@/store/config-store'
import { useUiStore } from '@/store/ui-store'

describe('YamlPreview component', () => {
  beforeEach(() => {
    useUiStore.setState({ previewMode: 'yaml', theme: 'light' })
    useConfigStore.setState({
      configYaml: '',
      integrityReport: null,
      derivationPending: false,
    })
  })

  it('should use bounded virtual rows for very large YAML documents', () => {
    const yaml = Array.from({ length: 6_000 }, (_, index) => `rule-${index}: DIRECT`).join('\n')
    useConfigStore.setState({ configYaml: yaml })

    const { container } = render(<YamlPreview />)

    expect(container.querySelector('.cm-editor')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('yaml-virtual-row').length).toBeLessThan(100)
    expect(screen.getByText('6000 行')).toBeInTheDocument()
  })

  it('should virtualize long integrity issue lists', () => {
    useUiStore.setState({ previewMode: 'issues' })
    useConfigStore.setState({
      integrityReport: {
        valid: false,
        issues: Array.from({ length: 1_000 }, (_, index) => ({
          type: 'test-issue',
          message: `issue-${index}`,
          severity: 'error' as const,
        })),
        references: {
          allProxyNames: new Set(),
          allGroupNames: new Set(),
          allProviderNames: new Set(),
          allRuleProviderNames: new Set(),
          allListenerNames: new Set(),
          danglingProxyRefs: [],
          danglingGroupRefs: [],
          danglingProviderRefs: [],
          danglingRuleProviderRefs: [],
          danglingRuleRefs: [],
        },
        cycles: { hasCycle: false, cycles: [], path: '' },
        chains: [],
        rules: [],
      },
    })

    render(<YamlPreview />)

    expect(screen.queryAllByTestId('integrity-issue').length).toBeLessThan(100)
  })
})
