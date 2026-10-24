interface SalesChartProps {
  current: number[]
  previous: number[]
}

const WIDTH = 600
const HEIGHT = 190
const PAD = { left: 34, right: 10, top: 12, bottom: 24 }
const Y_MAX = 3
const Y_TICKS = [0, 1, 2, 3]

function toPoints(values: number[]): [number, number][] {
  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const step = values.length > 1 ? innerW / (values.length - 1) : 0
  return values.map((v, i) => [PAD.left + i * step, PAD.top + innerH - (v / Y_MAX) * innerH])
}

const linePath = (points: [number, number][]) =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

/** Gráfico de linhas em SVG puro; a integração com biblioteca de gráficos vem na Entrega 5. */
export function SalesChart({ current, previous }: SalesChartProps) {
  const currentPoints = toPoints(current)
  const baseline = HEIGHT - PAD.bottom
  const last = currentPoints[currentPoints.length - 1]
  const first = currentPoints[0]
  const area =
    first && last ? `${linePath(currentPoints)} L${last[0]},${baseline} L${first[0]},${baseline} Z` : ''

  return (
    <>
      <svg
        className="sf-chart"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Faturamento diário demonstrativo, em milhares de reais, comparando o mês atual ao anterior"
      >
        {Y_TICKS.map((tick) => {
          const y = PAD.top + (HEIGHT - PAD.top - PAD.bottom) * (1 - tick / Y_MAX)
          return (
            <g key={tick}>
              <line className="sf-chart__grid" x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} />
              <text className="sf-chart__axis" x={PAD.left - 8} y={y + 4} textAnchor="end">
                {tick}
              </text>
            </g>
          )
        })}
        <path className="sf-chart__area" d={area} />
        <path className="sf-chart__previous" d={linePath(toPoints(previous))} />
        <path className="sf-chart__current" d={linePath(currentPoints)} />
        <text className="sf-chart__axis" x={PAD.left} y={HEIGHT - 6}>
          dia 1
        </text>
        <text className="sf-chart__axis" x={WIDTH - PAD.right} y={HEIGHT - 6} textAnchor="end">
          dia 12
        </text>
      </svg>
      <div className="sf-chart-legend">
        <span>Mês atual</span>
        <span>Mês anterior</span>
      </div>
    </>
  )
}
