/**
 * DADOS DEMONSTRATIVOS DO DASHBOARD.
 *
 * Tudo aqui é fictício, determinístico (nenhum Math.random: a mesma data sempre gera os mesmos
 * números) e centralizado neste diretório. Nenhum componente guarda valores comerciais.
 * A interface sinaliza "dados demonstrativos" sempre que esta fonte está ativa.
 */
import { addDays, dayOfWeek, diffDays, startOfMonth, startOfWeek, type Granularity, type Period } from '@/lib/period'
import { isPendingOrder } from '../lib/metrics'
import type {
  DashboardSummary,
  LowStockAlert,
  PeriodTotals,
  RecentActivity,
  RecentOrder,
  RevenueSeries,
  SalesSeries,
  TopSellingProducts,
} from '../types'

const EPOCH = '2024-01-01'
/** Fator por dia da semana (dom … sáb): fim de semana vende menos. */
const WEEKDAY_FACTOR = [0.4, 1, 1.1, 1.05, 1.15, 1.2, 0.6]
/** Distribuição do dia por hora (24 pesos; o comércio vende entre 8h e 20h). */
const HOUR_WEIGHTS = [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 9, 10, 8, 7, 8, 9, 9, 8, 6, 4, 2, 0, 0, 0]

export interface DayFigures {
  salesCount: number
  revenueCents: number
}

/** Vendas e faturamento de um dia — função pura da data. */
export function dailyFigures(iso: string): DayFigures {
  const ordinal = diffDays(EPOCH, iso)
  const base = 12 + ((ordinal * 5) % 7) + ((ordinal * 3) % 5)
  const salesCount = Math.round(base * (WEEKDAY_FACTOR[dayOfWeek(iso)] ?? 1))
  const averageTicketCents = 24_000 + ((ordinal * 37) % 9_000)
  return { salesCount, revenueCents: salesCount * averageTicketCents }
}

function eachDay(from: string, to: string): string[] {
  return Array.from({ length: diffDays(from, to) + 1 }, (_, index) => addDays(from, index))
}

export function totalsFor(from: string, to: string): PeriodTotals {
  return eachDay(from, to).reduce<PeriodTotals>(
    (total, day) => {
      const figures = dailyFigures(day)
      return { revenueCents: total.revenueCents + figures.revenueCents, salesCount: total.salesCount + figures.salesCount }
    },
    { revenueCents: 0, salesCount: 0 },
  )
}

function bucketKey(day: string, granularity: Granularity, from: string): string {
  if (granularity === 'month') return startOfMonth(day) < from ? from : startOfMonth(day)
  if (granularity === 'week') return startOfWeek(day) < from ? from : startOfWeek(day)
  return day
}

/** Distribui `total` por peso, preservando a soma exata (resto vai às maiores frações). */
function splitByWeight(total: number, weights: number[]): number[] {
  const weightSum = weights.reduce((sum, w) => sum + w, 0)
  const shares = weights.map((w) => Math.floor((total * w) / weightSum))
  let remainder = total - shares.reduce((sum, s) => sum + s, 0)
  for (let i = 0; remainder > 0; i = (i + 1) % weights.length) {
    if ((weights[i] ?? 0) > 0) {
      shares[i] = (shares[i] ?? 0) + 1
      remainder -= 1
    }
  }
  return shares
}

function bucketed(period: Period): { bucket: string; revenueCents: number; salesCount: number }[] {
  if (period.granularity === 'hour') {
    const figures = dailyFigures(period.from)
    const revenue = splitByWeight(figures.revenueCents, HOUR_WEIGHTS)
    const sales = splitByWeight(figures.salesCount, HOUR_WEIGHTS)
    return HOUR_WEIGHTS.map((_, hour) => ({
      bucket: `${period.from}T${String(hour).padStart(2, '0')}:00`,
      revenueCents: revenue[hour] ?? 0,
      salesCount: sales[hour] ?? 0,
    })).filter((_, hour) => (HOUR_WEIGHTS[hour] ?? 0) > 0)
  }

  const map = new Map<string, { revenueCents: number; salesCount: number }>()
  for (const day of eachDay(period.from, period.to)) {
    const key = bucketKey(day, period.granularity, period.from)
    const figures = dailyFigures(day)
    const current = map.get(key) ?? { revenueCents: 0, salesCount: 0 }
    map.set(key, {
      revenueCents: current.revenueCents + figures.revenueCents,
      salesCount: current.salesCount + figures.salesCount,
    })
  }
  return [...map.entries()].map(([bucket, value]) => ({ bucket, ...value }))
}

export function demoRevenueSeries(period: Period): RevenueSeries {
  return {
    granularity: period.granularity,
    points: bucketed(period).map(({ bucket, revenueCents }) => ({ bucket, revenueCents })),
  }
}

export function demoSalesSeries(period: Period): SalesSeries {
  return {
    granularity: period.granularity,
    points: bucketed(period).map(({ bucket, salesCount }) => ({ bucket, salesCount })),
  }
}

// ── Catálogo fictício ───────────────────────────────────────────────────────

const CATALOG = [
  { productId: 'p-001', name: 'Café Premium 500g', sku: 'CAF-001', priceCents: 2890, weight: 18 },
  { productId: 'p-002', name: 'Açúcar Cristal 5kg', sku: 'ACU-005', priceCents: 2150, weight: 14 },
  { productId: 'p-003', name: 'Papel A4 75g (resma)', sku: 'PAP-410', priceCents: 2690, weight: 12 },
  { productId: 'p-004', name: 'Detergente Neutro 5L', sku: 'LIM-120', priceCents: 1890, weight: 9 },
  { productId: 'p-005', name: 'Mouse sem fio', sku: 'INF-077', priceCents: 5490, weight: 7 },
  { productId: 'p-006', name: 'Caneta Esferográfica (cx 50)', sku: 'PAP-022', priceCents: 3290, weight: 6 },
  { productId: 'p-007', name: 'Álcool 70% 1L', sku: 'LIM-045', priceCents: 1190, weight: 5 },
  { productId: 'p-008', name: 'Teclado USB', sku: 'INF-031', priceCents: 7990, weight: 3 },
]
const UNITS_PER_SALE = 3
const TOP_LIMIT = 5

export function demoTopProducts(period: Period): TopSellingProducts {
  const { salesCount } = totalsFor(period.from, period.to)
  const totalUnits = salesCount * UNITS_PER_SALE
  const quantities = splitByWeight(totalUnits, CATALOG.map((p) => p.weight))
  const items = CATALOG.map((product, index) => ({
    productId: product.productId,
    name: product.name,
    sku: product.sku,
    quantity: quantities[index] ?? 0,
    revenueCents: (quantities[index] ?? 0) * product.priceCents,
  }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, TOP_LIMIT)
  return { totalUnits, items }
}

const LOW_STOCK: LowStockAlert[] = [
  { productId: 'p-004', name: 'Detergente Neutro 5L', sku: 'LIM-120', available: 0, minimum: 15 },
  { productId: 'p-003', name: 'Papel A4 75g (resma)', sku: 'PAP-410', available: 3, minimum: 20 },
  { productId: 'p-005', name: 'Mouse sem fio', sku: 'INF-077', available: 4, minimum: 6 },
  { productId: 'p-001', name: 'Café Premium 500g', sku: 'CAF-001', available: 10, minimum: 12 },
  { productId: 'p-007', name: 'Álcool 70% 1L', sku: 'LIM-045', available: 18, minimum: 24 },
]
const ACTIVE_PRODUCTS = 248

export const demoLowStockAlerts = (): LowStockAlert[] => LOW_STOCK

// ── Pedidos e atividades (datas relativas a "hoje") ─────────────────────────

const ORDERS = [
  { n: 1240, customer: 'Padaria Pão Dourado', daysAgo: 0, time: '14:02', cents: 231_000, status: 'confirmed' },
  { n: 1239, customer: 'Mercado Boa Vista Ltda', daysAgo: 0, time: '10:41', cents: 384_200, status: 'reserved' },
  { n: 1238, customer: 'TechPonto Informática', daysAgo: 1, time: '16:20', cents: 613_000, status: 'invoiced' },
  { n: 1237, customer: 'Escola Nova Era', daysAgo: 1, time: '09:15', cents: 78_000, status: 'invoiced' },
  { n: 1236, customer: 'Café do Largo', daysAgo: 2, time: '17:48', cents: 34_000, status: 'cancelled' },
  { n: 1235, customer: 'Padaria Pão Dourado', daysAgo: 3, time: '11:30', cents: 92_100, status: 'draft' },
  { n: 1234, customer: 'Mercado Boa Vista Ltda', daysAgo: 4, time: '15:05', cents: 421_500, status: 'invoiced' },
  { n: 1233, customer: 'Escola Nova Era', daysAgo: 5, time: '08:50', cents: 56_400, status: 'invoiced' },
] as const
const RECENT_ORDERS_LIMIT = 6

const instant = (today: string, daysAgo: number, time: string) => `${addDays(today, -daysAgo)}T${time}:00-03:00`

export function demoRecentOrders(today: string): RecentOrder[] {
  return ORDERS.slice(0, RECENT_ORDERS_LIMIT).map((order) => ({
    id: `demo-order-${order.n}`,
    number: `#${order.n}`,
    customerName: order.customer,
    createdAt: instant(today, order.daysAgo, order.time),
    totalCents: order.cents,
    status: order.status,
  }))
}

export function demoSummary(period: Period, previous: Period | null): DashboardSummary {
  const totals = totalsFor(period.from, period.to)
  return {
    revenueCents: totals.revenueCents,
    salesCount: totals.salesCount,
    activeProducts: ACTIVE_PRODUCTS,
    lowStockCount: LOW_STOCK.length,
    pendingOrders: ORDERS.filter((order) => isPendingOrder(order.status)).length,
    previous: previous ? totalsFor(previous.from, previous.to) : null,
  }
}

export function demoRecentActivities(today: string): RecentActivity[] {
  return [
    { id: 'demo-act-1', type: 'sale_confirmed', message: 'Venda #1240 confirmada', occurredAt: instant(today, 0, '14:05') },
    { id: 'demo-act-2', type: 'purchase_received', message: 'Pedido de compra PC-0090 recebido', occurredAt: instant(today, 0, '11:20') },
    { id: 'demo-act-3', type: 'stock_entry', message: 'Entrada de 40 un. de Café Premium 500g', occurredAt: instant(today, 1, '16:40') },
    { id: 'demo-act-4', type: 'order_cancelled', message: 'Pedido #1236 cancelado', occurredAt: instant(today, 2, '17:55') },
    { id: 'demo-act-5', type: 'stock_adjustment', message: 'Ajuste de inventário em Papel A4 75g', occurredAt: instant(today, 3, '09:10') },
  ]
}
