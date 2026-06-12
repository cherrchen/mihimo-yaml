export type FieldType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'object' | 'object[]' | 'map' | 'enum' | 'enum[]'

export interface FieldMeta {
  /** YAML key name */
  key: string
  /** Full YAML dot-path, e.g., 'dns.fallback-filter.geoip' */
  path: string
  /** TypeScript type */
  type: FieldType
  /** Default value (as YAML value) */
  defaultValue?: unknown
  /** Whether this field is required */
  required: boolean
  /** Whether mihomo supports this field */
  mihomo: boolean
  /** Whether Stash supports this field */
  stash: boolean
  /** For enum fields: allowed values */
  enumValues?: readonly string[]
  /** Human-readable description */
  description: string
  /** Example value */
  example?: unknown
  /** Category in the nav tree */
  category: string
  /** Whether this is an advanced field (collapsed by default) */
  advanced: boolean
  /** Whether this field is deprecated */
  deprecated: boolean
  /** Whether this is a sensitive field (password, key, token) */
  sensitive: boolean
  /** Stash export action when not supported: 'remove' | 'warn' | 'transform' | 'block' */
  stashAction?: 'remove' | 'warn' | 'transform' | 'block'
  /** Transform function name for Stash export */
  stashTransform?: string
}

export type FieldMetaCategory =
  | 'general'
  | 'dns'
  | 'hosts'
  | 'inbounds'
  | 'tun'
  | 'sniffer'
  | 'proxies'
  | 'proxy-providers'
  | 'proxy-groups'
  | 'rule-providers'
  | 'rules'
  | 'sub-rules'
  | 'tunnels'
  | 'ntp'
  | 'experimental'
