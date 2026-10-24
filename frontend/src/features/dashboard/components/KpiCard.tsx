import type { LucideIcon } from 'lucide-react'
import { Button, Card, Skeleton } from '@/components/ui'
import { formatSignedPercent } from '@/lib/format'

interface KpiCardProps {
  label: string
  icon: LucideIcon
  /** Valor já formatado; `null` mostra um traço (sem dados para calcular). */
  value: string | null
  helper?: string
  /** Variação em % contra o período anterior; ausente quando não há base comparável. */
  delta?: number | null
  /** Indicadores de posição atual não variam com o período e são identificados como tal. */
  scope?: 'period' | 'current'
  loading?: boolean
  error?: boolean
  onRetry?: () => void
}

export function KpiCard({ label, icon: Icon, value, helper, delta, scope = 'period', loading, error, onRetry }: KpiCardProps) {
  return (
    <Card className="sf-kpi" aria-label={label}>
      <div className="sf-kpi__head">
        <span className="sf-kpi__label">{label}</span>
        <Icon size={18} aria-hidden="true" className="sf-kpi__icon" />
      </div>

      {loading ? (
        <div aria-busy="true" className="sf-kpi__skeleton">
          <span className="sf-visually-hidden">Carregando {label}…</span>
          <Skeleton width="60%" height={34} />
          <Skeleton variant="text" width="80%" />
        </div>
      ) : error ? (
        <div className="sf-kpi__error" role="alert">
          <span>Não foi possível carregar.</span>
          {onRetry && (
            <Button size="sm" variant="ghost" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="sf-kpi__value">{value ?? '—'}</div>
          {delta !== undefined && delta !== null && (
            <div className={`sf-kpi__delta sf-kpi__delta--${delta >= 0 ? 'up' : 'down'}`}>
              <span aria-hidden="true">{delta >= 0 ? '▲' : '▼'}</span> {formatSignedPercent(delta)}{' '}
              <span className="sf-muted">vs. período anterior</span>
            </div>
          )}
          <div className="sf-kpi__helper">
            {scope === 'current' && <span className="sf-kpi__scope">Posição atual</span>}
            {helper}
          </div>
        </>
      )}
    </Card>
  )
}
