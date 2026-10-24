import {
  addDays,
  diffDays,
  granularityFor,
  isValidIsoDate,
  previousPeriod,
  resolvePeriod,
  startOfWeek,
  toSearchParams,
  todayInAppZone,
  validateCustomRange,
} from './period'

const TODAY = '2026-10-24' // sábado

describe('datas', () => {
  it('valida datas ISO reais', () => {
    expect(isValidIsoDate('2026-02-28')).toBe(true)
    expect(isValidIsoDate('2026-02-30')).toBe(false)
    expect(isValidIsoDate('24/10/2026')).toBe(false)
    expect(isValidIsoDate('')).toBe(false)
    expect(isValidIsoDate(null)).toBe(false)
  })

  it('soma dias atravessando mês e ano', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('calcula diferença de dias sem sofrer com horário de verão', () => {
    expect(diffDays('2018-11-01', '2018-11-10')).toBe(9)
    expect(diffDays(TODAY, TODAY)).toBe(0)
  })

  it('usa o dia civil do fuso America/Sao_Paulo', () => {
    // 01:30 UTC de 25/10 ainda é 22:30 de 24/10 em São Paulo (UTC−3)
    expect(todayInAppZone(new Date('2026-10-25T01:30:00Z'))).toBe('2026-10-24')
    expect(todayInAppZone(new Date('2026-10-25T03:30:00Z'))).toBe('2026-10-25')
  })

  it('encontra a segunda-feira da semana', () => {
    expect(startOfWeek('2026-10-24')).toBe('2026-10-19')
    expect(startOfWeek('2026-10-19')).toBe('2026-10-19')
  })
})

describe('resolvePeriod', () => {
  it('usa 30 dias por padrão (limites inclusivos)', () => {
    const { period, error } = resolvePeriod({}, TODAY)
    expect(error).toBeUndefined()
    expect(period).toMatchObject({ preset: '30d', from: '2026-09-25', to: TODAY, days: 30, granularity: 'day' })
  })

  it.each([
    ['today', '2026-10-24', '2026-10-24', 1, 'hour'],
    ['7d', '2026-10-18', '2026-10-24', 7, 'day'],
    ['month', '2026-10-01', '2026-10-24', 24, 'day'],
  ])('resolve o preset %s', (preset, from, to, days, granularity) => {
    expect(resolvePeriod({ periodo: preset }, TODAY).period).toMatchObject({ from, to, days, granularity })
  })

  it('aceita período personalizado válido', () => {
    const { period, error } = resolvePeriod({ periodo: 'custom', de: '2026-01-01', ate: '2026-06-30' }, TODAY)
    expect(error).toBeUndefined()
    expect(period).toMatchObject({ preset: 'custom', days: 181, granularity: 'month' })
  })

  it.each([
    ['datas inválidas', 'xx', '2026-10-01'],
    ['início depois do fim', '2026-10-10', '2026-10-01'],
    ['fim no futuro', '2026-10-01', '2026-10-25'],
    ['mais de 366 dias', '2025-01-01', '2026-10-01'],
  ])('rejeita personalizado com %s e volta ao padrão', (_name, de, ate) => {
    const { period, error } = resolvePeriod({ periodo: 'custom', de, ate }, TODAY)
    expect(error).toBeTruthy()
    expect(period.preset).toBe('30d')
  })

  it('ignora preset desconhecido sem erro', () => {
    const { period, error } = resolvePeriod({ periodo: 'ontem' }, TODAY)
    expect(period.preset).toBe('30d')
    expect(error).toBeUndefined()
  })
})

describe('granularidade e período anterior', () => {
  it.each([
    [1, 'hour'],
    [2, 'day'],
    [31, 'day'],
    [32, 'week'],
    [180, 'week'],
    [181, 'month'],
  ] as const)('%i dias → %s', (days, granularity) => {
    expect(granularityFor(days)).toBe(granularity)
  })

  it('o período anterior tem a mesma duração e termina na véspera', () => {
    const { period } = resolvePeriod({ periodo: '7d' }, TODAY)
    expect(previousPeriod(period)).toMatchObject({ from: '2026-10-11', to: '2026-10-17', days: 7 })
  })

  it('serializa para a URL omitindo o padrão', () => {
    expect(toSearchParams(resolvePeriod({}, TODAY).period)).toEqual({})
    expect(toSearchParams(resolvePeriod({ periodo: '7d' }, TODAY).period)).toEqual({ periodo: '7d' })
    expect(toSearchParams(resolvePeriod({ periodo: 'custom', de: '2026-10-01', ate: '2026-10-05' }, TODAY).period)).toEqual({
      periodo: 'custom',
      de: '2026-10-01',
      ate: '2026-10-05',
    })
  })

  it('validateCustomRange retorna undefined para intervalo válido', () => {
    expect(validateCustomRange('2026-10-01', '2026-10-24', TODAY)).toBeUndefined()
  })
})
