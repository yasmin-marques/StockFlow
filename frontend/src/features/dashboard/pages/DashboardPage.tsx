import { DemoDataNotice } from '../components/DemoDataNotice'
import { RevenueChartCard, SalesChartCard } from '../components/ChartCards'
import { KpiGrid } from '../components/KpiGrid'
import { LowStockCard } from '../components/LowStockCard'
import { PeriodFilter } from '../components/PeriodFilter'
import { RecentActivitiesCard } from '../components/RecentActivitiesCard'
import { RecentOrdersCard } from '../components/RecentOrdersCard'
import { TopProductsCard } from '../components/TopProductsCard'
import { usePeriodFilter } from '../hooks/usePeriodFilter'
import { dashboardSource } from '../services'
import '../dashboard.css'

export function DashboardPage() {
  const { period, today, error, setPreset, setCustomRange } = usePeriodFilter()

  return (
    <div className="sf-page">
      <div className="sf-dash-toolbar">
        <PeriodFilter
          period={period}
          today={today}
          urlError={error}
          onPreset={setPreset}
          onCustomRange={setCustomRange}
        />
        <p className="sf-dash-toolbar__hint">
          O período afeta faturamento, vendas, ticket médio e gráficos. Estoque, produtos e pedidos pendentes mostram a
          posição atual.
        </p>
      </div>

      {dashboardSource.isDemo && <DemoDataNotice />}

      <KpiGrid period={period} />

      <div className="sf-dash-row sf-dash-row--even">
        <RevenueChartCard period={period} />
        <SalesChartCard period={period} />
      </div>

      <div className="sf-dash-row sf-dash-row--even">
        <TopProductsCard period={period} />
        <LowStockCard />
      </div>

      <div className="sf-dash-row sf-dash-row--wide-left">
        <RecentOrdersCard />
        <RecentActivitiesCard />
      </div>
    </div>
  )
}
