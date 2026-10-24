/** Cálculos de apresentação do dashboard (puros e testáveis). */
import type { OrderStatus } from '../types'

/** Ticket médio em centavos; `null` quando não há vendas (evita divisão por zero e "R$ 0" enganoso). */
export function averageTicketCents(revenueCents: number, salesCount: number): number | null {
  if (salesCount <= 0) return null
  return Math.round(revenueCents / salesCount)
}

/**
 * Variação percentual entre períodos, com uma casa decimal.
 * Retorna `null` quando não há base comparável (anterior ausente ou zerado).
 */
export function percentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous <= 0) return null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

/** Participação percentual (0–100, uma casa); `null` se o total não permite o cálculo. */
export function sharePercent(part: number, total: number): number | null {
  if (total <= 0) return null
  return Math.round((part / total) * 1000) / 10
}

export type StockStatus = 'ok' | 'low' | 'out'

export function stockStatus(available: number, minimum: number): StockStatus {
  if (available <= 0) return 'out'
  if (available < minimum) return 'low'
  return 'ok'
}

/** Pedidos ainda em andamento (não faturados nem cancelados). */
export const PENDING_STATUSES: readonly OrderStatus[] = ['draft', 'reserved', 'confirmed']

export const isPendingOrder = (status: OrderStatus): boolean => PENDING_STATUSES.includes(status)
