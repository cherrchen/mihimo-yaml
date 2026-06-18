import { describe, expect, it } from 'vitest'
import { buildChainTopology } from '@/components/editors/chain-builder/topology'

describe('ChainBuilder topology', () => {
  it('should create dialer-proxy edges when the target appears later in the proxy list', () => {
    const topology = buildChainTopology({
      mode: 'rule',
      proxies: [
        {
          name: 'A',
          type: 'ss',
          server: 'a.example.com',
          port: 8388,
          cipher: 'aes-256-gcm',
          password: 'p',
          'dialer-proxy': 'B',
        },
        {
          name: 'B',
          type: 'ss',
          server: 'b.example.com',
          port: 8388,
          cipher: 'aes-256-gcm',
          password: 'p',
        },
      ],
      rules: ['MATCH,DIRECT'],
    })

    expect(topology.initialNodes.map((node) => node.id)).toEqual(['A', 'B'])
    expect(topology.initialEdges).toEqual([
      expect.objectContaining({ source: 'A', target: 'B', label: 'dialer' }),
    ])
  })

  it('should omit unrelated proxies and include every upstream dialer proxy', () => {
    const topology = buildChainTopology({
      mode: 'rule',
      proxies: [
        { name: 'unused', type: 'direct' },
        { name: 'entry', type: 'direct', 'dialer-proxy': 'middle' },
        { name: 'middle', type: 'direct', 'dialer-proxy': 'exit' },
        { name: 'exit', type: 'direct' },
      ],
      rules: ['MATCH,DIRECT'],
    })

    expect(topology.initialNodes.map((node) => node.id)).toEqual(['entry', 'middle', 'exit'])
    expect(topology.initialEdges).toEqual([
      expect.objectContaining({ source: 'entry', target: 'middle', label: 'dialer' }),
      expect.objectContaining({ source: 'middle', target: 'exit', label: 'dialer' }),
    ])
  })

  it('should include relay members without creating a relay group node', () => {
    const topology = buildChainTopology({
      mode: 'rule',
      proxies: [
        { name: 'relay-a', type: 'direct' },
        { name: 'relay-b', type: 'direct' },
        { name: 'unused', type: 'direct' },
      ],
      'proxy-groups': [
        { name: 'relay-chain', type: 'relay', proxies: ['relay-a', 'relay-b'] },
      ],
      rules: ['MATCH,DIRECT'],
    })

    expect(topology.initialNodes.map((node) => node.id)).toEqual(['relay-a', 'relay-b'])
    expect(topology.initialEdges).toEqual([
      expect.objectContaining({ source: 'relay-a', target: 'relay-b', label: 'relay:relay-chain' }),
    ])
  })
})
