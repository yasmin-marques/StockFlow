import { APP_TIME_ZONE } from './period'

const LOCALE = 'pt-BR'

const currency = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'BRL' })
const currencyCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
const percent = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1, minimumFractionDigits: 1 })

/** Valores monetários trafegam em centavos inteiros; a conversão para reais acontece só aqui. */
export const formatCurrencyCents = (cents: number): string => currency.format(cents / 100)
export const formatCurrencyCompactCents = (cents: number): string => currencyCompact.format(cents / 100)
export const formatInteger = (value: number): string => integer.format(value)

/** `12.4` → "12,4%". */
export const formatPercent = (value: number): string => `${percent.format(value)}%`

/** `+12,4%` / `−2,1%` com sinal explícito (menos tipográfico). */
export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${percent.format(Math.abs(value))}%`
}

/** "2026-10-24" → "24/10/2026" (sem passar por Date, logo sem deslocamento de fuso). */
export function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** "2026-10-24" → "24/10". */
export function formatIsoDayMonth(iso: string): string {
  return formatIsoDate(iso).slice(0, 5)
}

const dateTime = new Intl.DateTimeFormat(LOCALE, {
  timeZone: APP_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Instante ISO-8601 → data e hora no fuso da aplicação. */
export const formatDateTime = (instant: string): string => dateTime.format(new Date(instant)).replace(',', '')

const monthYear = new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', month: 'short', year: '2-digit' })
export const formatIsoMonthYear = (iso: string): string =>
  monthYear.format(new Date(`${iso}T00:00:00Z`)).replace(' de ', '/').replace('.', '')
