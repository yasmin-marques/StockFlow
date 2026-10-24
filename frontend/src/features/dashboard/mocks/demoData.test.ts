import { buildPeriod, previousPeriod, resolvePeriod } from '@/lib/period'
import { averageTicketCents } from '../lib/metrics'
import {
  dailyFigures,
  demoRecentOrders,
  demoRevenueSeries,
  demoSalesSeries,
  demoSummary,
  demoTopProducts,
  totalsFor,
} from './demoData'

const TODAY = '2026-10-24'
const period = (preset: string) => resolvePeriod({ periodo: preset }, TODAY).period

describe('dados demonstrativos', () => {
  it('são determinísticos: a mesma data sempre gera os mesmos números', () => {
    expect(dailyFigures('2026-10-20')).toEqual(dailyFigures('2026-10-20'))
    expect(demoSummary(period('30d'), null)).toEqual(demoSummary(period('30d'), null))
  })

  it('o total do período é a soma dos dias', () => {
    const expected = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24']
      .map(dailyFigures)
      .reduce((sum, day) => sum + day.revenueCents, 0)
    expect(totalsFor('2026-10-18', '2026-10-24').revenueCents).toBe(expected)
  })

  it.each(['today', '7d', '30d', 'month'])('as séries somam exatamente o resumo (%s)', (preset) => {
    const p = period(preset)
    const summary = demoSummary(p, null)
    const revenue = demoRevenueSeries(p).points.reduce((sum, point) => sum + point.revenueCents, 0)
    const sales = demoSalesSeries(p).points.reduce((sum, point) => sum + point.salesCount, 0)
    expect(revenue).toBe(summary.revenueCents)
    expect(sales).toBe(summary.salesCount)
  })

  it('usa a granularidade do período', () => {
    expect(demoRevenueSeries(period('today')).granularity).toBe('hour')
    expect(demoRevenueSeries(period('30d')).points).toHaveLength(30)
    const semestral = buildPeriod('custom', '2026-01-01', '2026-06-30')
    const weekly = buildPeriod('custom', '2026-05-01', '2026-10-24')
    expect(demoSalesSeries(semestral).granularity).toBe('month')
    expect(demoSalesSeries(semestral).points).toHaveLength(6)
    expect(demoSalesSeries(weekly).granularity).toBe('week')
  })

  it('o ticket médio é derivado do faturamento e das vendas', () => {
    const { revenueCents, salesCount } = demoSummary(period('7d'), null)
    expect(averageTicketCents(revenueCents, salesCount)).toBe(Math.round(revenueCents / salesCount))
  })

  it('inclui o período anterior apenas quando solicitado', () => {
    const p = period('7d')
    expect(demoSummary(p, null).previous).toBeNull()
    expect(demoSummary(p, previousPeriod(p)).previous).toEqual(totalsFor('2026-10-11', '2026-10-17'))
  })

  it('o ranking vem ordenado e as unidades não ultrapassam o total', () => {
    const { items, totalUnits } = demoTopProducts(period('30d'))
    const quantities = items.map((item) => item.quantity)
    expect(quantities).toEqual([...quantities].sort((a, b) => b - a))
    expect(quantities.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(totalUnits)
  })

  it('pedidos recentes usam datas relativas a hoje', () => {
    const [first] = demoRecentOrders(TODAY)
    expect(first?.createdAt.startsWith(TODAY)).toBe(true)
  })
})
