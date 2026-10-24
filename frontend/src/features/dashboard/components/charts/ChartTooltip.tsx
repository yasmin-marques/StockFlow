interface ChartTooltipProps {
  active?: boolean
  label: string
  value: string
  seriesName: string
}

export function ChartTooltip({ active, label, value, seriesName }: ChartTooltipProps) {
  if (!active) return null
  return (
    <div className="sf-chart-tooltip">
      <div className="sf-chart-tooltip__label">{label}</div>
      <div>
        {seriesName}: <strong>{value}</strong>
      </div>
    </div>
  )
}
