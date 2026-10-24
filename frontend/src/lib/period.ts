/**
 * Períodos do dashboard.
 *
 * Datas são strings "AAAA-MM-DD" (dia civil no fuso da aplicação) e ambos os limites são
 * INCLUSIVOS. A aritmética de dias roda em UTC para não sofrer com horário de verão.
 */
export const APP_TIME_ZONE = 'America/Sao_Paulo'

export type PeriodPreset = 'today' | '7d' | '30d' | 'month' | 'custom'
export type Granularity = 'hour' | 'day' | 'week' | 'month'

export const DEFAULT_PRESET: PeriodPreset = '30d'
export const MAX_CUSTOM_DAYS = 366

export const PRESET_LABELS: Record<PeriodPreset, string> = {
  today: 'Hoje',
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  month: 'Este mês',
  custom: 'Período personalizado',
}

export interface Period {
  preset: PeriodPreset
  /** Primeiro dia, inclusivo. */
  from: string
  /** Último dia, inclusivo. */
  to: string
  /** Quantidade de dias do intervalo. */
  days: number
  granularity: Granularity
}

export interface PeriodParams {
  periodo?: string | null
  de?: string | null
  ate?: string | null
}

export interface ResolvedPeriod {
  period: Period
  /** Preenchido quando os parâmetros da URL eram inválidos e o padrão foi aplicado. */
  error?: string
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function isValidIsoDate(value: string | null | undefined): value is string {
  if (!value) return false
  const match = ISO_DATE.exec(value)
  if (!match) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

/** Dia civil atual no fuso da aplicação. */
export function todayInAppZone(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function addDays(iso: string, amount: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

/** Dias de `from` até `to` (positivo quando `to` é posterior). */
export function diffDays(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000)
}

/** 0 = domingo … 6 = sábado. */
export const dayOfWeek = (iso: string): number => new Date(`${iso}T00:00:00Z`).getUTCDay()

/** Segunda-feira da semana de `iso` (semanas ISO). */
export function startOfWeek(iso: string): string {
  return addDays(iso, -((dayOfWeek(iso) + 6) % 7))
}

export const startOfMonth = (iso: string): string => `${iso.slice(0, 7)}-01`

export function granularityFor(days: number): Granularity {
  if (days <= 1) return 'hour'
  if (days <= 31) return 'day'
  if (days <= 180) return 'week'
  return 'month'
}

export function buildPeriod(preset: PeriodPreset, from: string, to: string): Period {
  const days = diffDays(from, to) + 1
  return { preset, from, to, days, granularity: granularityFor(days) }
}

function presetRange(preset: Exclude<PeriodPreset, 'custom'>, today: string): [string, string] {
  switch (preset) {
    case 'today':
      return [today, today]
    case '7d':
      return [addDays(today, -6), today]
    case '30d':
      return [addDays(today, -29), today]
    case 'month':
      return [startOfMonth(today), today]
  }
}

const isPreset = (value: string | null | undefined): value is PeriodPreset =>
  value === 'today' || value === '7d' || value === '30d' || value === 'month' || value === 'custom'

/** Interpreta os parâmetros da URL; entradas inválidas caem no padrão e geram `error`. */
export function resolvePeriod(params: PeriodParams, today: string): ResolvedPeriod {
  const fallback = (error?: string): ResolvedPeriod => {
    const [from, to] = presetRange(DEFAULT_PRESET as Exclude<PeriodPreset, 'custom'>, today)
    return { period: buildPeriod(DEFAULT_PRESET, from, to), error }
  }

  if (!isPreset(params.periodo)) return fallback()
  if (params.periodo !== 'custom') {
    const [from, to] = presetRange(params.periodo, today)
    return { period: buildPeriod(params.periodo, from, to) }
  }

  const error = validateCustomRange(params.de, params.ate, today)
  if (error) return fallback(error)
  return { period: buildPeriod('custom', params.de as string, params.ate as string) }
}

/** Mensagem de erro em português, ou `undefined` quando o intervalo é válido. */
export function validateCustomRange(
  from: string | null | undefined,
  to: string | null | undefined,
  today: string,
): string | undefined {
  if (!isValidIsoDate(from) || !isValidIsoDate(to)) return 'Informe datas válidas de início e fim.'
  if (from > to) return 'A data inicial não pode ser posterior à final.'
  if (to > today) return 'A data final não pode estar no futuro.'
  if (diffDays(from, to) + 1 > MAX_CUSTOM_DAYS) return `O período máximo é de ${MAX_CUSTOM_DAYS} dias.`
  return undefined
}

/** Período imediatamente anterior, com a mesma duração. */
export function previousPeriod(period: Period): Period {
  const to = addDays(period.from, -1)
  const from = addDays(to, -(period.days - 1))
  return buildPeriod(period.preset, from, to)
}

/** Parâmetros de URL canônicos; o padrão não precisa constar. */
export function toSearchParams(period: Period): Record<string, string> {
  if (period.preset === 'custom') return { periodo: 'custom', de: period.from, ate: period.to }
  return period.preset === DEFAULT_PRESET ? {} : { periodo: period.preset }
}
