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
  // geo/geosite (domain) — yaml
  { name: 'cn', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'cn', 'yaml') },
  { name: 'google', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'google', 'yaml') },
  { name: 'telegram', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'telegram', 'yaml') },
  { name: 'youtube', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'youtube', 'yaml') },
  { name: 'netflix', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'netflix', 'yaml') },
  { name: 'openai', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'openai', 'yaml') },
  { name: 'github', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'github', 'yaml') },
  { name: 'microsoft', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'microsoft', 'yaml') },
  { name: 'apple', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'apple', 'yaml') },
  { name: 'private', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'private', 'yaml') },
  { name: 'category-ads-all', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'category-ads-all', 'yaml') },
  { name: 'geolocation-!cn', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'geolocation-!cn', 'yaml') },
  { name: 'gfw', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'gfw', 'yaml') },
  { name: 'proxy', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'proxy', 'yaml') },
  { name: 'twitter', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'twitter', 'yaml') },
  { name: 'spotify', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'spotify', 'yaml') },
  { name: 'tiktok', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'tiktok', 'yaml') },
  { name: 'steam', category: 'geo/geosite', behavior: 'domain', format: 'yaml', url: u('geo/geosite', 'steam', 'yaml') },

  // geo/geoip (ipcidr) — yaml
  { name: 'cn-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'yaml', url: u('geo/geoip', 'cn', 'yaml') },
  { name: 'private-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'yaml', url: u('geo/geoip', 'private', 'yaml') },
  { name: 'cloudflare-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'yaml', url: u('geo/geoip', 'cloudflare', 'yaml') },
  { name: 'google-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'yaml', url: u('geo/geoip', 'google', 'yaml') },
  { name: 'telegram-ip', category: 'geo/geoip', behavior: 'ipcidr', format: 'yaml', url: u('geo/geoip', 'telegram', 'yaml') },

  // geo/geoip/classical (classical)
  { name: 'cn-classical', category: 'geo/geoip/classical', behavior: 'classical', format: 'yaml', url: u('geo/geoip/classical', 'cn', 'yaml') },

  // geo-lite/geosite (domain)
  { name: 'cn-lite', category: 'geo-lite/geosite', behavior: 'domain', format: 'yaml', url: u('geo-lite/geosite', 'cn', 'yaml') },
  { name: 'google-lite', category: 'geo-lite/geosite', behavior: 'domain', format: 'yaml', url: u('geo-lite/geosite', 'google', 'yaml') },
  { name: 'telegram-lite', category: 'geo-lite/geosite', behavior: 'domain', format: 'yaml', url: u('geo-lite/geosite', 'telegram', 'yaml') },

  // geo-lite/geoip (ipcidr)
  { name: 'cn-ip-lite', category: 'geo-lite/geoip', behavior: 'ipcidr', format: 'yaml', url: u('geo-lite/geoip', 'cn', 'yaml') },

  // asn (ipcidr) — text files with .list URLs
  { name: 'AS4134', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS4134', 'list') },
  { name: 'AS4837', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS4837', 'list') },
  { name: 'AS4809', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS4809', 'list') },
  { name: 'AS45102', category: 'asn', behavior: 'ipcidr', format: 'text', url: u('asn', 'AS45102', 'list') },
]
