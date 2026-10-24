import type { Period } from '@/lib/period'
import type {
  DashboardSummary,
  LowStockAlert,
  RecentActivity,
  RecentOrder,
  RevenueSeries,
  SalesSeries,
  TopSellingProducts,
} from '../types'

/** Contrato de acesso aos dados do dashboard; implementado por `mock` e por `api`. */
export interface DashboardDataSource {
  /** `true` quando os dados são demonstrativos (a interface precisa avisar). */
  readonly isDemo: boolean
  getSummary(period: Period): Promise<DashboardSummary>
  getRevenueSeries(period: Period): Promise<RevenueSeries>
  getSalesSeries(period: Period): Promise<SalesSeries>
  getTopProducts(period: Period): Promise<TopSellingProducts>
  getLowStockAlerts(): Promise<LowStockAlert[]>
  getRecentOrders(): Promise<RecentOrder[]>
  getRecentActivities(): Promise<RecentActivity[]>
}
