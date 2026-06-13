import { describe, it, expect } from 'vitest'
import { diffLines } from 'diff'

describe('YAML diff utility', () => {
  it('should detect no changes for identical text', () => {
    const changes = diffLines('mode: rule\n', 'mode: rule\n')
    const hasChanges = changes.some((c) => c.added || c.removed)
    expect(hasChanges).toBe(false)
  })

  it('should detect added lines', () => {
    const oldText = 'mode: rule\n'
    const newText = 'mode: rule\nlog-level: info\n'
    const changes = diffLines(oldText, newText)
    const added = changes.filter((c) => c.added)
    expect(added.length).toBeGreaterThan(0)
    expect(added[0].value).toContain('log-level')
  })

  it('should detect removed lines', () => {
    const oldText = 'mode: rule\nlog-level: info\n'
    const newText = 'mode: rule\n'
    const changes = diffLines(oldText, newText)
    const removed = changes.filter((c) => c.removed)
    expect(removed.length).toBeGreaterThan(0)
    expect(removed[0].value).toContain('log-level')
  })

  it('should detect modified lines', () => {
    const oldText = 'mode: rule\nport: 7890\n'
    const newText = 'mode: global\nport: 9090\n'
    const changes = diffLines(oldText, newText)

    const added = changes.filter((c) => c.added)
    const removed = changes.filter((c) => c.removed)
    expect(added.length).toBeGreaterThan(0)
    expect(removed.length).toBeGreaterThan(0)
  })

  it('should handle empty old text', () => {
    const oldText = ''
    const newText = 'mode: rule\ndns:\n  enable: true\n'
    const changes = diffLines(oldText, newText)
    const added = changes.filter((c) => c.added)
    expect(added.length).toBeGreaterThan(0)
    expect(added[0].value).toContain('mode: rule')
  })

  it('should handle empty new text', () => {
    const oldText = 'mode: rule\n'
    const newText = ''
    const changes = diffLines(oldText, newText)
    const removed = changes.filter((c) => c.removed)
    expect(removed.length).toBeGreaterThan(0)
  })

  it('should handle multi-section YAML diff', () => {
    const oldText = `mode: rule
dns:
  enable: true
  nameserver:
    - 8.8.8.8
proxies: []
`
    const newText = `mode: rule
dns:
  enable: true
  nameserver:
    - 1.1.1.1
    - 8.8.8.8
proxies:
  - name: node
    type: ss
`
    const changes = diffLines(oldText, newText)

    const added = changes.filter((c) => c.added)
    const removed = changes.filter((c) => c.removed)

    expect(added.length).toBeGreaterThan(0)
    expect(removed.length).toBeGreaterThan(0)
  })
})
