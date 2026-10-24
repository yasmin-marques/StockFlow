import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { formatCurrencyCents, formatCurrencyCompactCents } from '@/lib/format'
import type { RevenueSeries } from '../../types'
import { ChartTooltip } from './ChartTooltip'
import { formatBucketLabel, formatBucketTick, GRANULARITY_LABEL } from './chartFormat'

/** Carregado sob demanda (lazy) para manter o Recharts fora do bundle inicial. */
export default function RevenueChart({ series }: { series: RevenueSeries }) {
  const reducedMotion = usePrefersReducedMotion()
  const total = series.points.reduce((sum, point) => sum + point.revenueCents, 0)

  return (
    <div
      className="sf-chart"
      role="img"
      aria-label={`Faturamento ${GRANULARITY_LABEL[series.granularity]}. Total no período: ${formatCurrencyCents(total)}.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series.points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
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
            tickFormatter={(cents: number) => formatCurrencyCompactCents(cents)}
            tick={{ fill: 'var(--sf-text-muted)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip
            cursor={{ stroke: 'var(--color-accent-600)', strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as { bucket: string; revenueCents: number } | undefined
              return point ? (
                <ChartTooltip
                  active={active}
                  label={formatBucketLabel(point.bucket, series.granularity)}
                  seriesName="Faturamento"
                  value={formatCurrencyCents(point.revenueCents)}
                />
              ) : null
            }}
          />
          <Area
            type="monotone"
            dataKey="revenueCents"
            stroke="var(--color-accent-600)"
            strokeWidth={2}
            fill="var(--color-accent-100)"
            fillOpacity={0.8}
            isAnimationActive={!reducedMotion}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
