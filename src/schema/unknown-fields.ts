/**
 * Extracts unknown fields from a raw parsed YAML object.
 * Returns known fields and unknown fields separately.
 */
export function extractUnknownFields(
  raw: Record<string, unknown>,
  knownKeys: Set<string>,
): { known: Record<string, unknown>; unknown: Record<string, unknown> } {
  const known: Record<string, unknown> = {}
  const unknown: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (knownKeys.has(key)) {
      known[key] = value
    } else {
      unknown[key] = value
    }
  }

  return { known, unknown }
}

/**
 * Injects unknown fields back into the output object.
 * Unknown fields are appended after all known fields.
 */
export function injectUnknownFields(
  output: Record<string, unknown>,
  unknown: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(unknown)) {
    output[key] = value
  }
}

/**
 * Deep merges known and unknown fields for nested objects.
 * This handles cases where a known config section (like dns) contains
 * both modeled and unmodeled sub-fields.
 */
export function extractNestedUnknown(
  raw: Record<string, unknown> | undefined,
  knownKeys: Set<string>,
): { known: Record<string, unknown>; unknown: Record<string, unknown> } {
  if (!raw || typeof raw !== 'object') {
    return { known: {}, unknown: {} }
  }

  const known: Record<string, unknown> = {}
  const unknown: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (knownKeys.has(key)) {
      known[key] = value
    } else {
      unknown[key] = value
    }
  }

  return { known, unknown }
}
