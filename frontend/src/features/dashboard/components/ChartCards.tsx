import { ChartNoAxesColumn } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Badge, Card, CardBody, CardHeader, EmptyState, QueryBoundary, Skeleton } from '@/components/ui'
import type { Period } from '@/lib/period'
import { useRevenueSeries, useSalesSeries } from '../hooks/useDashboardData'
import { GRANULARITY_LABEL } from './charts/chartFormat'

const RevenueChart = lazy(() => import('./charts/RevenueChart'))
const SalesChart = lazy(() => import('./charts/SalesChart'))

const chartFallback = <Skeleton height={260} />
const noData = (
  <EmptyState
    icon={<ChartNoAxesColumn size={22} aria-hidden="true" />}
    title="Sem vendas no período"
    description="Ajuste o período para ver a evolução."
  />
)

export function RevenueChartCard({ period }: { period: Period }) {
  const query = useRevenueSeries(period)
  return (
    <Card>
      <CardHeader
        title="Faturamento"
        kicker="Evolução no período"
        action={query.data && <Badge tone="neutral" hideIcon>{GRANULARITY_LABEL[query.data.granularity]}</Badge>}
      />
      <CardBody>
        <QueryBoundary
          query={query}
          loading={chartFallback}
          isEmpty={(series) => series.points.every((point) => point.revenueCents === 0)}
          empty={noData}
          errorTitle="Não foi possível carregar o faturamento"
        >
          {(series) => (
            <Suspense fallback={chartFallback}>
              <RevenueChart series={series} />
            </Suspense>
          )}
        </QueryBoundary>
      </CardBody>
    </Card>
  )
}

export function SalesChartCard({ period }: { period: Period }) {
  const query = useSalesSeries(period)
  return (
    <Card>
      <CardHeader
        title="Vendas"
        kicker="Quantidade no período"
        action={query.data && <Badge tone="neutral" hideIcon>{GRANULARITY_LABEL[query.data.granularity]}</Badge>}
      />
      <CardBody>
        <QueryBoundary
          query={query}
          loading={chartFallback}
          isEmpty={(series) => series.points.every((point) => point.salesCount === 0)}
          empty={noData}
          errorTitle="Não foi possível carregar as vendas"
        >
          {(series) => (
            <Suspense fallback={chartFallback}>
              <SalesChart series={series} />
            </Suspense>
          )}
        </QueryBoundary>
      </CardBody>
    </Card>
  )
}
