import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YamlDiff } from '@/components/preview/YamlDiff'

describe('YamlDiff component', () => {
  it('should show no differences for identical text', () => {
    render(<YamlDiff oldText="mode: rule\n" newText="mode: rule\n" />)
    expect(screen.getByText('没有差异')).toBeInTheDocument()
  })

  it('should show added lines with plus prefix', () => {
    render(<YamlDiff oldText="mode: rule\n" newText="mode: rule\nlog-level: info\n" />)
    expect(screen.getByText('+1 行新增')).toBeInTheDocument()
  })

  it('should show removed lines with minus prefix', () => {
    render(<YamlDiff oldText="mode: rule\nport: 8080\n" newText="mode: rule\n" />)
    expect(screen.getByText('-1 行删除')).toBeInTheDocument()
  })

  it('should show change count in footer', () => {
    render(<YamlDiff oldText="mode: rule\n" newText="mode: global\nlog-level: info\n" />)
    expect(screen.getByText(/处变更/)).toBeInTheDocument()
  })

  it('should handle empty old text gracefully', () => {
    render(<YamlDiff oldText="" newText="mode: rule\ndns:\n  enable: true\n" />)
    expect(screen.getByText(/行新增/)).toBeInTheDocument()
  })
})
