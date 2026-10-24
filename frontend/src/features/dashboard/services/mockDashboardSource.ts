import { previousPeriod, todayInAppZone, type Period } from '@/lib/period'
import {
  demoLowStockAlerts,
  demoRecentActivities,
  demoRecentOrders,
  demoRevenueSeries,
  demoSalesSeries,
  demoSummary,
  demoTopProducts,
} from '../mocks/demoData'
import type { DashboardDataSource } from './dashboardSource'

interface MockOptions {
  /** Latência simulada, só para a interface exibir estados de carregamento. */
  delayMs?: number
  today?: () => string
}

export function createMockDashboardSource({ delayMs = 0, today = () => todayInAppZone() }: MockOptions = {}): DashboardDataSource {
  const respond = <T>(produce: () => T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(produce()), delayMs))

  return {
    isDemo: true,
    getSummary: (period: Period) => respond(() => demoSummary(period, previousPeriod(period))),
    getRevenueSeries: (period) => respond(() => demoRevenueSeries(period)),
    getSalesSeries: (period) => respond(() => demoSalesSeries(period)),
    getTopProducts: (period) => respond(() => demoTopProducts(period)),
    getLowStockAlerts: () => respond(demoLowStockAlerts),
    getRecentOrders: () => respond(() => demoRecentOrders(today())),
    getRecentActivities: () => respond(() => demoRecentActivities(today())),
  }
}
