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
})
