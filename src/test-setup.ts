import '@testing-library/jest-dom'

window.matchMedia = window.matchMedia || ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
} as MediaQueryList))

window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
