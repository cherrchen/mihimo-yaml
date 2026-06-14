import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ProxyGroupTopology } from '@/components/editors/proxy-groups/ProxyGroupTopology'
import { buildProxyGroupTopology } from '@/components/editors/proxy-groups/topology'
import { useConfigStore } from '@/store/config-store'

function setupConfig() {
  useConfigStore.setState({
    config: {
      mode: 'rule',
      'proxy-groups': [
        { name: 'PROXY', type: 'select', proxies: ['DIRECT', 'node1'] },
        { name: 'AUTO', type: 'url-test', proxies: ['node1', 'PROXY'], url: 'https://example.com', interval: 300 },
      ],
      proxies: [
        { name: 'node1', type: 'ss', server: 'srv.com', port: 8388, cipher: 'aes-256-gcm', password: 'p' },
      ],
      rules: ['MATCH,PROXY'],
    },
    configYaml: '',
    configName: 'test',
    history: [{ config: { mode: 'rule', 'proxy-groups': [], proxies: [], rules: [] } }],
    historyIndex: 0,
    integrityReport: null,
    compatibilityReport: null,
  })
}

describe('ProxyGroupTopology component', () => {
  beforeEach(() => {
    setupConfig()
  })

  it('should render ReactFlow wrapper', () => {
    render(<ProxyGroupTopology />)

    expect(screen.getByTestId('rf__wrapper')).toBeInTheDocument()
  })

  it('should render node/edge count in header', () => {
    render(<ProxyGroupTopology />)

    expect(screen.getByText('4 节点 · 4 边')).toBeInTheDocument()
  })

  it('should render the normal / self-ref / cycle legend', () => {
    render(<ProxyGroupTopology />)

    expect(screen.getByText('正常')).toBeInTheDocument()
    expect(screen.getByText('自引用')).toBeInTheDocument()
    expect(screen.getByText('循环')).toBeInTheDocument()
  })

  it('should show empty message when no proxy groups exist', () => {
    act(() => {
      useConfigStore.setState({
        config: { mode: 'rule', proxies: [], rules: [] },
      })
    })

    render(<ProxyGroupTopology />)

    expect(screen.getByText('暂无代理组数据')).toBeInTheDocument()
  })

  it('should highlight self-referencing groups', () => {
    act(() => {
      useConfigStore.setState({
        config: {
          mode: 'rule',
          'proxy-groups': [
            { name: 'LOOP', type: 'select', proxies: ['LOOP', 'DIRECT'] },
          ],
          proxies: [],
          rules: ['MATCH,DIRECT'],
        },
      })
    })

    render(<ProxyGroupTopology />)

    expect(screen.getByText(/引用了自身/)).toBeInTheDocument()
  })

  it('should re-render ReactFlow after config change without crashing', () => {
    const { rerender } = render(<ProxyGroupTopology />)

    expect(screen.getByTestId('rf__wrapper')).toBeInTheDocument()

    act(() => {
      useConfigStore.setState({
        config: {
          mode: 'rule',
          'proxy-groups': [
            { name: 'NEW', type: 'select', proxies: ['DIRECT'] },
          ],
          proxies: [],
          rules: ['MATCH,DIRECT'],
        },
      })
    })

    rerender(<ProxyGroupTopology />)

    expect(screen.getByTestId('rf__wrapper')).toBeInTheDocument()
  })

  it('should create visible nodes for every edge endpoint', () => {
    const topology = buildProxyGroupTopology({
      mode: 'rule',
      proxies: [
        { name: 'node1', type: 'ss', server: 'srv.com', port: 8388, cipher: 'aes-256-gcm', password: 'p' },
      ],
      'proxy-providers': {
        remote: { type: 'http', url: 'https://example.com/proxies.yaml', path: './providers/remote.yaml' },
      },
      'proxy-groups': [
        { name: 'PROXY', type: 'select', proxies: ['DIRECT', 'node1'], use: ['remote'] },
      ],
      rules: ['MATCH,PROXY'],
    })
    const nodeIds = new Set(topology.initialNodes.map((node) => node.id))

    expect(nodeIds).toEqual(new Set(['PROXY', 'node1', 'remote', 'DIRECT']))
    expect(topology.initialEdges).toHaveLength(3)
    expect(topology.initialEdges.every((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))).toBe(true)
  })
})
