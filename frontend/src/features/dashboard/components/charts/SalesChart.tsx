import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { formatInteger } from '@/lib/format'
import type { SalesSeries } from '../../types'
import { ChartTooltip } from './ChartTooltip'
import { formatBucketLabel, formatBucketTick, GRANULARITY_LABEL } from './chartFormat'

/** Carregado sob demanda (lazy) para manter o Recharts fora do bundle inicial. */
export default function SalesChart({ series }: { series: SalesSeries }) {
  const reducedMotion = usePrefersReducedMotion()
  const total = series.points.reduce((sum, point) => sum + point.salesCount, 0)

  return (
    <div
      className="sf-chart"
      role="img"
      aria-label={`Vendas ${GRANULARITY_LABEL[series.granularity]}. Total no período: ${formatInteger(total)} vendas.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series.points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--sf-border)" />
          <XAxis
            dataKey="bucket"
            tickFormatter={(bucket: string) => formatBucketTick(bucket, series.granularity)}
            tick={{ fill: 'var(--sf-text-muted)', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--sf-border)' }}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--sf-text-muted)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: 'var(--sf-hover-accent)' }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as { bucket: string; salesCount: number } | undefined
              return point ? (
                <ChartTooltip
                  active={active}
                  label={formatBucketLabel(point.bucket, series.granularity)}
                  seriesName="Vendas"
                  value={formatInteger(point.salesCount)}
                />
              ) : null
            }}
          />
          <Bar
            dataKey="salesCount"
            fill="var(--color-accent-500)"
            radius={[3, 3, 0, 0]}
            maxBarSize={36}
            isAnimationActive={!reducedMotion}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
