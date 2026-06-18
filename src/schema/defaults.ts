import type { MihomoConfig } from './model'

export const MINIMAL_CONFIG: MihomoConfig = {
  mode: 'rule',
  'log-level': 'info',
  ipv6: true,
  dns: {
    enable: true,
    'enhanced-mode': 'fake-ip',
    nameserver: ['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query'],
    'fallback-filter': { geoip: true, 'geoip-code': 'CN' },
  },
  proxies: [],
  'proxy-groups': [
    {
      name: 'PROXY',
      type: 'select',
      proxies: ['DIRECT'],
    },
  ],
  rules: ['MATCH,PROXY'],
}

export const FAKE_IP_TEMPLATE: MihomoConfig = {
  mode: 'rule',
  'log-level': 'info',
  ipv6: true,
  dns: {
    enable: true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/16',
    'fake-ip-filter': [
      '*.lan',
      'localhost.ptlogin2.qq.com',
    ],
    'default-nameserver': ['223.5.5.5', '119.29.29.29'],
    nameserver: ['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query'],
    'fallback-filter': { geoip: true, 'geoip-code': 'CN' },
  },
  proxies: [],
  'proxy-groups': [
    { name: 'PROXY', type: 'select', proxies: ['DIRECT'] },
  ],
  rules: ['MATCH,PROXY'],
}

export const STASH_TEMPLATE: MihomoConfig = {
  mode: 'rule',
  'log-level': 'info',
  dns: {
    enable: true,
    'default-nameserver': ['223.5.5.5', '119.29.29.29'],
    nameserver: ['https://doh.pub/dns-query'],
    'fake-ip-filter': ['*.lan'],
  },
  proxies: [],
  'proxy-groups': [
    { name: 'PROXY', type: 'select', proxies: ['DIRECT'] },
  ],
  rules: ['MATCH,PROXY'],
}

export const CN_DIRECT_TEMPLATE: MihomoConfig = {
  mode: 'rule',
  'log-level': 'info',
  dns: {
    enable: true,
    'enhanced-mode': 'fake-ip',
    'default-nameserver': ['223.5.5.5'],
    nameserver: ['https://doh.pub/dns-query'],
    'nameserver-policy': {
      'geosite:cn': ['223.5.5.5', '119.29.29.29'],
    },
  },
  'rule-providers': {
    cn: {
      type: 'http',
      behavior: 'domain',
      format: 'mrs',
      url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/cn.mrs',
      path: './ruleset/cn.mrs',
      interval: 86400,
    },
  },
  proxies: [],
  'proxy-groups': [
    { name: 'PROXY', type: 'select', proxies: ['DIRECT'] },
  ],
  rules: [
    'RULE-SET,cn,DIRECT',
    'MATCH,PROXY',
  ],
}

export const CHAIN_PROXY_TEMPLATE: MihomoConfig = {
  mode: 'rule',
  'log-level': 'info',
  proxies: [
    {
      name: '入口节点',
      type: 'ss',
      server: 'server-a.example.com',
      port: 8388,
      cipher: 'aes-256-gcm',
      password: '',
    },
    {
      name: '中转节点',
      type: 'ss',
      server: 'server-b.example.com',
      port: 8388,
      cipher: 'aes-256-gcm',
      password: '',
      'dialer-proxy': '入口节点',
    },
    {
      name: '出口节点',
      type: 'ss',
      server: 'server-c.example.com',
      port: 8388,
      cipher: 'aes-256-gcm',
      password: '',
      'dialer-proxy': '中转节点',
    },
  ],
  'proxy-groups': [
    {
      name: 'PROXY',
      type: 'select',
      proxies: ['出口节点', '中转节点', '入口节点'],
    },
    {
      name: 'RELAY-CHAIN',
      type: 'relay',
      proxies: ['入口节点', '中转节点', '出口节点'],
    },
  ],
  rules: ['MATCH,PROXY'],
}
