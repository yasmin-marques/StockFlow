import {
  formatCurrencyCents,
  formatCurrencyCompactCents,
  formatDateTime,
  formatInteger,
  formatIsoDate,
  formatIsoDayMonth,
  formatPercent,
  formatSignedPercent,
} from './format'

// Intl usa NBSP entre "R$" e o número.
const plain = (text: string) => text.replace(/\u00a0/g, ' ')

describe('formatação pt-BR', () => {
  it('formata centavos como moeda', () => {
    expect(plain(formatCurrencyCents(4782000))).toBe('R$ 47.820,00')
    expect(plain(formatCurrencyCents(1))).toBe('R$ 0,01')
    expect(plain(formatCurrencyCents(0))).toBe('R$ 0,00')
  })

  it('formata moeda compacta para eixos', () => {
    expect(plain(formatCurrencyCompactCents(1_250_000))).toMatch(/^R\$ 12,5 mil$/)
  })

  it('formata inteiros com separador de milhar', () => {
    expect(formatInteger(1204)).toBe('1.204')
  })

  it('formata percentuais com sinal tipográfico', () => {
    expect(formatPercent(12.4)).toBe('12,4%')
    expect(formatSignedPercent(12.4)).toBe('+12,4%')
    expect(formatSignedPercent(-2.1)).toBe('−2,1%')
    expect(formatSignedPercent(0)).toBe('0,0%')
  })

  it('formata datas ISO sem deslocamento de fuso', () => {
    expect(formatIsoDate('2026-10-01')).toBe('01/10/2026')
    expect(formatIsoDayMonth('2026-10-01')).toBe('01/10')
  })

  it('formata instantes no fuso de São Paulo', () => {
    expect(formatDateTime('2026-10-24T14:02:00-03:00')).toBe('24/10/2026 14:02')
    expect(formatDateTime('2026-10-24T17:02:00Z')).toBe('24/10/2026 14:02')
  })
})
