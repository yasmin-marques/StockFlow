import { formatIsoDate, formatIsoDayMonth, formatIsoMonthYear } from '@/lib/format'
import type { Granularity } from '@/lib/period'

export const GRANULARITY_LABEL: Record<Granularity, string> = {
  hour: 'por hora',
  day: 'por dia',
  week: 'por semana',
  month: 'por mês',
}

/** Rótulo curto para o eixo X. */
export function formatBucketTick(bucket: string, granularity: Granularity): string {
  if (granularity === 'hour') return `${bucket.slice(11, 13)}h`
  if (granularity === 'month') return formatIsoMonthYear(bucket)
  return formatIsoDayMonth(bucket)
}

/** Rótulo completo para o tooltip. */
export function formatBucketLabel(bucket: string, granularity: Granularity): string {
  switch (granularity) {
    case 'hour':
      return `${formatIsoDate(bucket.slice(0, 10))} · ${bucket.slice(11, 13)}h`
    case 'day':
      return formatIsoDate(bucket)
    case 'week':
      return `Semana de ${formatIsoDate(bucket)}`
    case 'month':
      return formatIsoMonthYear(bucket)
  }
}
