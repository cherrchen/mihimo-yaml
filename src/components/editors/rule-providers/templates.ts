import type { RULE_PROVIDER_FORMATS } from '@/lib/constants'

type RuleProviderFormat = (typeof RULE_PROVIDER_FORMATS)[number]

export interface MetaRuleSetTemplate {
  name: string
  category: 'geo/geosite' | 'geo/geoip' | 'geo-lite/geosite' | 'geo-lite/geoip' | 'geo/geoip/classical' | 'asn'
  behavior: 'domain' | 'ipcidr' | 'classical'
  format: RuleProviderFormat
  url: string
}

const BASE = 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta'

function u(category: string, name: string, ext: string): string {
  return `${BASE}/${category}/${name}.${ext}`
}

export function getTemplatePath(tpl: MetaRuleSetTemplate): string {
  const extension = tpl.url.endsWith('.list') ? 'list' : tpl.format
  return `./ruleset/${tpl.name}.${extension}`
}

export const METACUBEX_TEMPLATES: MetaRuleSetTemplate[] = [
  // geo/geosite (domain) - mrs
  { name: 'cn', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'cn', 'mrs') },
  { name: 'google', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'google', 'mrs') },
  { name: 'telegram', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'telegram', 'mrs') },
  { name: 'youtube', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'youtube', 'mrs') },
  { name: 'netflix', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'netflix', 'mrs') },
  { name: 'openai', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'openai', 'mrs') },
  { name: 'github', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'github', 'mrs') },
  { name: 'microsoft', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'microsoft', 'mrs') },
  { name: 'apple', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'apple', 'mrs') },
  { name: 'private', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'private', 'mrs') },
  { name: 'category-ads-all', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'category-ads-all', 'mrs') },
  { name: 'geolocation-!cn', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'geolocation-!cn', 'mrs') },
  { name: 'gfw', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'gfw', 'mrs') },
  { name: 'proxy', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'proxy', 'mrs') },
  { name: 'twitter', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'twitter', 'mrs') },
  { name: 'spotify', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'spotify', 'mrs') },
  { name: 'tiktok', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'tiktok', 'mrs') },
  { name: 'steam', category: 'geo/geosite', behavior: 'domain', format: 'mrs', url: u('geo/geosite', 'steam', 'mrs') },

  // geo/geoip (ipcidr) - mrs
  { name: 'cn-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'mrs', url: u('geo/geoip', 'cn', 'mrs') },
  { name: 'private-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'mrs', url: u('geo/geoip', 'private', 'mrs') },
  { name: 'cloudflare-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'mrs', url: u('geo/geoip', 'cloudflare', 'mrs') },
  { name: 'google-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'mrs', url: u('geo/geoip', 'google', 'mrs') },
  { name: 'telegram-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'mrs', url: u('geo/geoip', 'telegram', 'mrs') },

  // geo/geoip/classical (classical)
  { name: 'cn-classical', category: 'geo/geoip/classical', behavior: 'classical', format: 'yaml', url: u('geo/geoip/classical', 'cn', 'yaml') },

  // geo-lite/geosite (domain)
  { name: 'cn-lite', category: 'geo-lite/geosite', behavior: 'domain', format: 'mrs', url: u('geo-lite/geosite', 'cn', 'mrs') },
  { name: 'google-lite', category: 'geo-lite/geosite', behavior: 'domain', format: 'mrs', url: u('geo-lite/geosite', 'google', 'mrs') },
  { name: 'telegram-lite', category: 'geo-lite/geosite', behavior: 'domain', format: 'mrs', url: u('geo-lite/geosite', 'telegram', 'mrs') },

  // geo-lite/geoip (ipcidr)
  { name: 'cn-ip-lite', category: 'geo-lite/geoip', behavior: 'ipcidr', format: 'mrs', url: u('geo-lite/geoip', 'cn', 'mrs') },

  // asn (ipcidr) — text files with .list URLs
  { name: 'AS4134', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS4134', 'list') },
  { name: 'AS4837', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS4837', 'list') },
  { name: 'AS4809', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS4809', 'list') },
  { name: 'AS45102', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS45102', 'list') },
]
