import { Boxes, Clock, Receipt, ShoppingBag, TriangleAlert, Wallet } from 'lucide-react'
import { formatCurrencyCents, formatInteger } from '@/lib/format'
import type { Period } from '@/lib/period'
import { useDashboardSummary } from '../hooks/useDashboardData'
import { averageTicketCents, percentChange } from '../lib/metrics'
import { KpiCard } from './KpiCard'

export function KpiGrid({ period }: { period: Period }) {
  const query = useDashboardSummary(period)
  const summary = query.data
  const loading = query.isPending
  const error = query.isError
  const retry = () => void query.refetch()
  const shared = { loading, error, onRetry: retry }

  const ticket = summary ? averageTicketCents(summary.revenueCents, summary.salesCount) : null
  const previousTicket = summary?.previous
    ? averageTicketCents(summary.previous.revenueCents, summary.previous.salesCount)
    : null

  return (
    <section className="sf-kpi-grid" aria-label="Indicadores principais" aria-busy={query.isFetching}>
      <KpiCard
        {...shared}
        label="Faturamento do período"
        icon={Wallet}
        value={summary ? formatCurrencyCents(summary.revenueCents) : null}
        delta={percentChange(summary?.revenueCents ?? null, summary?.previous?.revenueCents ?? null)}
        helper="Soma das vendas no período"
      />
      <KpiCard
        {...shared}
        label="Vendas realizadas"
        icon={ShoppingBag}
        value={summary ? formatInteger(summary.salesCount) : null}
        delta={percentChange(summary?.salesCount ?? null, summary?.previous?.salesCount ?? null)}
        helper="Vendas no período"
      />
      <KpiCard
        {...shared}
        label="Ticket médio"
        icon={Receipt}
        value={ticket === null ? null : formatCurrencyCents(ticket)}
        delta={percentChange(ticket, previousTicket)}
        helper={summary && ticket === null ? 'Sem vendas no período' : 'Faturamento ÷ vendas'}
      />
      <KpiCard
        {...shared}
        label="Produtos ativos"
        icon={Boxes}
        scope="current"
        value={summary ? formatInteger(summary.activeProducts) : null}
        helper="No catálogo"
      />
      <KpiCard
        {...shared}
        label="Estoque abaixo do mínimo"
        icon={TriangleAlert}
        scope="current"
        value={summary ? formatInteger(summary.lowStockCount) : null}
        helper="Produtos para repor"
      />
      <KpiCard
        {...shared}
        label="Pedidos pendentes"
        icon={Clock}
        scope="current"
        value={summary ? formatInteger(summary.pendingOrders) : null}
        helper="Rascunho, reservado ou confirmado"
      />
    </section>
  )
}
