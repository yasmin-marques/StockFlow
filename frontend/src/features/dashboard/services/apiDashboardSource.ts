import { http } from '@/lib/http'
import type { Period } from '@/lib/period'
import type { DashboardDataSource } from './dashboardSource'
import type {
  DashboardSummary,
  LowStockAlert,
  RecentActivity,
  RecentOrder,
  RevenueSeries,
  SalesSeries,
  TopSellingProducts,
} from '../types'

const range = (period: Period) => ({ from: period.from, to: period.to })

/**
 * Fonte real: endpoints previstos em docs/dashboard.md (ainda não existem no backend).
 * Falhas propagam como erro — nunca há fallback silencioso para dados demonstrativos.
 */
export const apiDashboardSource: DashboardDataSource = {
  isDemo: false,
  getSummary: async (period) =>
    (await http.get<DashboardSummary>('/api/v1/dashboard/summary', { params: range(period) })).data,
  getRevenueSeries: async (period) =>
    (
      await http.get<RevenueSeries>('/api/v1/dashboard/revenue', {
        params: { ...range(period), granularity: period.granularity },
      })
    ).data,
  getSalesSeries: async (period) =>
    (
      await http.get<SalesSeries>('/api/v1/dashboard/sales', {
        params: { ...range(period), granularity: period.granularity },
      })
    ).data,
  getTopProducts: async (period) =>
    (await http.get<TopSellingProducts>('/api/v1/dashboard/top-products', { params: { ...range(period), limit: 5 } }))
      .data,
  getLowStockAlerts: async () => (await http.get<LowStockAlert[]>('/api/v1/dashboard/low-stock')).data,
  getRecentOrders: async () =>
    (await http.get<RecentOrder[]>('/api/v1/dashboard/recent-orders', { params: { limit: 6 } })).data,
  getRecentActivities: async () =>
    (await http.get<RecentActivity[]>('/api/v1/dashboard/recent-activities', { params: { limit: 5 } })).data,
}
