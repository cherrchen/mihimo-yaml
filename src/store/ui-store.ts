import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'
export type NavSection = string

interface UiState {
  theme: Theme
  sidebarWidth: number
  sidebarOpen: boolean
  activeSection: NavSection
  previewMode: 'yaml' | 'issues' | 'report'
  showAdvancedFields: boolean
  showSensitiveFields: boolean
  exportMode: 'mihomo' | 'stash'

  setTheme: (theme: Theme) => void
  setSidebarWidth: (width: number) => void
  toggleSidebar: () => void
  setActiveSection: (section: NavSection) => void
  setPreviewMode: (mode: 'yaml' | 'issues' | 'report') => void
  toggleAdvancedFields: () => void
  toggleSensitiveFields: () => void
  setExportMode: (mode: 'mihomo' | 'stash') => void
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('mihomo-yaml-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'system'
}

function getInitialSidebar(): number {
  const stored = localStorage.getItem('mihomo-yaml-sidebar')
  if (stored) return parseInt(stored, 10) || 280
  return 280
}

export const useUiStore = create<UiState>((set) => ({
  theme: getInitialTheme(),
  sidebarWidth: getInitialSidebar(),
  sidebarOpen: true,
  activeSection: 'dashboard',
  previewMode: 'yaml',
  showAdvancedFields: false,
  showSensitiveFields: false,
  exportMode: 'mihomo',

  setTheme: (theme) => {
    localStorage.setItem('mihomo-yaml-theme', theme)
    set({ theme })
    applyTheme(theme)
  },
  setSidebarWidth: (width) => {
    localStorage.setItem('mihomo-yaml-sidebar', String(width))
    set({ sidebarWidth: width })
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActiveSection: (section) => set({ activeSection: section }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  toggleAdvancedFields: () => set((s) => ({ showAdvancedFields: !s.showAdvancedFields })),
  toggleSensitiveFields: () => set((s) => ({ showSensitiveFields: !s.showSensitiveFields })),
  setExportMode: (mode) => set({ exportMode: mode }),
}))

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

// Apply initial
applyTheme(getInitialTheme())
