import { averageTicketCents, isPendingOrder, percentChange, sharePercent, stockStatus } from './metrics'

describe('averageTicketCents', () => {
  it('divide o faturamento pelas vendas, arredondando para o centavo', () => {
    expect(averageTicketCents(1_000_000, 4)).toBe(250_000)
    expect(averageTicketCents(100_000, 3)).toBe(33_333)
  })

  it('retorna null sem vendas (nunca divide por zero)', () => {
    expect(averageTicketCents(0, 0)).toBeNull()
    expect(averageTicketCents(500, 0)).toBeNull()
  })
})

describe('percentChange', () => {
  it('calcula variação com uma casa decimal', () => {
    expect(percentChange(112_400, 100_000)).toBe(12.4)
    expect(percentChange(97_900, 100_000)).toBe(-2.1)
    expect(percentChange(100, 100)).toBe(0)
  })

  it('não inventa variação sem base comparável', () => {
    expect(percentChange(100, 0)).toBeNull()
    expect(percentChange(100, null)).toBeNull()
    expect(percentChange(null, 100)).toBeNull()
  })
})

describe('sharePercent', () => {
  it('calcula participação sobre o total', () => {
    expect(sharePercent(25, 200)).toBe(12.5)
  })
  it('retorna null quando o total é zero', () => {
    expect(sharePercent(0, 0)).toBeNull()
  })
})

describe('stockStatus', () => {
  it.each([
    [0, 10, 'out'],
    [-1, 10, 'out'],
    [3, 10, 'low'],
    [10, 10, 'ok'],
    [25, 10, 'ok'],
  ] as const)('disponível %i / mínimo %i → %s', (available, minimum, expected) => {
    expect(stockStatus(available, minimum)).toBe(expected)
  })
})

describe('isPendingOrder', () => {
  it('considera pendentes apenas pedidos em andamento', () => {
    expect(['draft', 'reserved', 'confirmed'].every((s) => isPendingOrder(s as never))).toBe(true)
    expect(isPendingOrder('invoiced')).toBe(false)
    expect(isPendingOrder('cancelled')).toBe(false)
  })
})
