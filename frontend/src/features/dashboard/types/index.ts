/**
 * Contratos de dados do dashboard (espelham o contrato HTTP documentado em docs/dashboard.md).
 *
 * Convenções: valores monetários em CENTAVOS inteiros; datas de dia como "AAAA-MM-DD";
 * instantes como ISO-8601 com offset.
 */
import type { Granularity } from '@/lib/period'

export interface PeriodTotals {
  revenueCents: number
  salesCount: number
}

export interface DashboardSummary {
  /** Faturamento e vendas dependem do período; os demais campos são a posição atual. */
  revenueCents: number
  salesCount: number
  activeProducts: number
  lowStockCount: number
  pendingOrders: number
  /** Totais do período imediatamente anterior; `null` quando não há base comparável. */
  previous: PeriodTotals | null
}

export interface RevenuePoint {
  /** Início do bucket: hora ISO ("AAAA-MM-DDTHH:00"), dia, segunda-feira da semana ou dia 1 do mês. */
  bucket: string
  revenueCents: number
}

export interface RevenueSeries {
  granularity: Granularity
  points: RevenuePoint[]
}

export interface SalesPoint {
  bucket: string
  salesCount: number
}

export interface SalesSeries {
  granularity: Granularity
  points: SalesPoint[]
}

export interface TopSellingProduct {
  productId: string
  name: string
  sku: string
  /** Unidades vendidas no período. */
  quantity: number
  /** Valor vendido no período, em centavos. */
  revenueCents: number
}

export interface TopSellingProducts {
  /** Total de unidades vendidas no período (base para a participação). */
  totalUnits: number
  items: TopSellingProduct[]
}

export interface LowStockAlert {
  productId: string
  name: string
  sku: string
  available: number
  minimum: number
}

export type OrderStatus = 'draft' | 'reserved' | 'confirmed' | 'invoiced' | 'cancelled'

export interface RecentOrder {
  id: string
  /** Número de exibição, ex.: "#1240". */
  number: string
  customerName: string
  createdAt: string
  totalCents: number
  status: OrderStatus
}

export type ActivityType =
  | 'stock_entry'
  | 'sale_confirmed'
  | 'order_cancelled'
  | 'stock_adjustment'
  | 'purchase_received'

export interface RecentActivity {
  id: string
  type: ActivityType
  message: string
  occurredAt: string
}
