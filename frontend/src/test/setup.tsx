import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

// jsdom não implementa estas APIs, usadas por Radix e pelo layout responsivo.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub)

window.matchMedia =
  window.matchMedia ??
  ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList)

window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView ?? (() => {})
window.HTMLElement.prototype.hasPointerCapture = window.HTMLElement.prototype.hasPointerCapture ?? (() => false)

// Recharts não calcula layout no jsdom: os gráficos viram stubs que expõem a quantidade de pontos.
vi.mock('@/features/dashboard/components/charts/RevenueChart', () => ({
  default: ({ series }: { series: { points: unknown[] } }) => (
    <div data-testid="revenue-chart" data-points={series.points.length} />
  ),
}))
vi.mock('@/features/dashboard/components/charts/SalesChart', () => ({
  default: ({ series }: { series: { points: unknown[] } }) => (
    <div data-testid="sales-chart" data-points={series.points.length} />
  ),
}))
