import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { formatInteger } from '@/lib/format'
import { previousPeriod, resolvePeriod } from '@/lib/period'
import { money } from '@/test/money'
import { renderApp } from '@/test/renderApp'
import { averageTicketCents } from '../lib/metrics'
import { demoSummary } from '../mocks/demoData'
import { createMockDashboardSource } from '../services/mockDashboardSource'
import type { DashboardDataSource } from '../services/dashboardSource'

const TODAY = '2026-10-24'
const source = vi.hoisted(() => ({ current: null as unknown as DashboardDataSource }))

vi.mock('../services', () => ({
  get dashboardSource() {
    return source.current
  },
}))
vi.mock('@/services/health', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'UP', database: 'UP', timestamp: '2026-01-01T00:00:00Z' }),
}))

const summaryFor = (preset: string) => {
  const { period } = resolvePeriod({ periodo: preset }, TODAY)
  return demoSummary(period, previousPeriod(period))
}

const kpi = (name: string) => screen.getByRole('region', { name })

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-10-24T15:00:00-03:00'))
  const base = createMockDashboardSource({ today: () => TODAY })
  source.current = {
    ...base,
    getSummary: vi.fn(base.getSummary),
    getTopProducts: vi.fn(base.getTopProducts),
    getLowStockAlerts: vi.fn(base.getLowStockAlerts),
  }
})

afterEach(() => vi.useRealTimers())

describe('DashboardPage', () => {
  it('avisa que os dados são demonstrativos', async () => {
    renderApp('/')
    expect(await screen.findByText('Dados demonstrativos.')).toBeInTheDocument()
  })

  it('exibe os seis indicadores com valores formatados e ticket médio calculado', async () => {
    renderApp('/')
    const summary = summaryFor('30d')
    const ticket = averageTicketCents(summary.revenueCents, summary.salesCount) as number

    await waitFor(() =>
      expect(within(kpi('Faturamento do período')).getByText(money(summary.revenueCents))).toBeInTheDocument(),
    )
    expect(within(kpi('Vendas realizadas')).getByText(formatInteger(summary.salesCount))).toBeInTheDocument()
    expect(within(kpi('Ticket médio')).getByText(money(ticket))).toBeInTheDocument()
    expect(within(kpi('Produtos ativos')).getByText('248')).toBeInTheDocument()
    expect(within(kpi('Estoque abaixo do mínimo')).getByText('5')).toBeInTheDocument()
    expect(within(kpi('Pedidos pendentes')).getByText('3')).toBeInTheDocument()
  })

  it('identifica indicadores de posição atual e mostra variação só nos temporais', async () => {
    renderApp('/')
    await screen.findByText(money(summaryFor('30d').revenueCents))

    expect(within(kpi('Produtos ativos')).getByText('Posição atual')).toBeInTheDocument()
    expect(within(kpi('Faturamento do período')).getByText('vs. período anterior')).toBeInTheDocument()
    expect(within(kpi('Produtos ativos')).queryByText('vs. período anterior')).not.toBeInTheDocument()
  })

  it('não mostra variação quando não há período comparável', async () => {
    const base = source.current
    source.current = { ...base, getSummary: async (p) => ({ ...(await base.getSummary(p)), previous: null }) }
    renderApp('/')
    await screen.findByText(money(summaryFor('30d').revenueCents))

    expect(screen.queryByText('vs. período anterior')).not.toBeInTheDocument()
  })

  it('mostra traço e explicação quando não há vendas (sem dividir por zero)', async () => {
    const base = source.current
    source.current = {
      ...base,
      getSummary: async () => ({
        revenueCents: 0,
        salesCount: 0,
        activeProducts: 10,
        lowStockCount: 0,
        pendingOrders: 0,
        previous: { revenueCents: 0, salesCount: 0 },
      }),
    }
    renderApp('/')

    const ticket = await screen.findByRole('region', { name: 'Ticket médio' })
    await waitFor(() => expect(within(ticket).getByText('Sem vendas no período')).toBeInTheDocument())
    expect(within(ticket).getByText('—')).toBeInTheDocument()
  })

  it('alterar o período atualiza URL, consultas e valores', async () => {
    const { router } = renderApp('/')
    await screen.findByText(money(summaryFor('30d').revenueCents))

    await userEvent.selectOptions(screen.getByLabelText('Período'), '7d')

    expect(router.state.location.search).toBe('?periodo=7d')
    await screen.findByText(money(summaryFor('7d').revenueCents))
    expect(source.current.getSummary).toHaveBeenLastCalledWith(
      expect.objectContaining({ from: '2026-10-18', to: TODAY, days: 7 }),
    )
    expect(screen.getByText('18/10/2026 – 24/10/2026', { exact: false })).toBeInTheDocument()
  })

  it('"Hoje" usa granularidade horária nos gráficos', async () => {
    renderApp('/?periodo=today')
    const revenue = await screen.findByTestId('revenue-chart')
    expect(Number(revenue.dataset.points)).toBe(13)
  })

  it('o gráfico de faturamento recebe um ponto por dia no padrão de 30 dias', async () => {
    renderApp('/')
    expect(Number((await screen.findByTestId('revenue-chart')).dataset.points)).toBe(30)
    expect(Number((await screen.findByTestId('sales-chart')).dataset.points)).toBe(30)
  })

  it('lê o período da URL e mantém os parâmetros', async () => {
    renderApp('/?periodo=custom&de=2026-10-01&ate=2026-10-10')
    expect(await screen.findByText('01/10/2026 – 10/10/2026', { exact: false })).toBeInTheDocument()
    expect(screen.getByLabelText('Período')).toHaveValue('custom')
  })

  it('período personalizado: rejeita datas inválidas e aplica as válidas', async () => {
    const { router } = renderApp('/')
    await userEvent.selectOptions(screen.getByLabelText('Período'), 'custom')

    const from = screen.getByLabelText('De')
    const to = screen.getByLabelText('Até')

    await userEvent.clear(from)
    await userEvent.type(from, '2026-10-20')
    await userEvent.clear(to)
    await userEvent.type(to, '2026-10-10')
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('data inicial não pode ser posterior')
    expect(router.state.location.search).toBe('')

    await userEvent.clear(to)
    await userEvent.type(to, '2026-10-25')
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('no futuro')

    await userEvent.clear(to)
    await userEvent.type(to, '2026-10-22')
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(router.state.location.search).toBe('?periodo=custom&de=2026-10-20&ate=2026-10-22')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('parâmetros inválidos na URL voltam ao padrão com aviso', async () => {
    renderApp('/?periodo=custom&de=xx&ate=2026-10-10')
    expect(await screen.findByRole('alert')).toHaveTextContent('datas válidas')
    expect(screen.getByLabelText('Período')).toHaveValue('30d')
  })

  it('mostra skeleton enquanto carrega', () => {
    source.current = { ...source.current, getSummary: () => new Promise(() => {}) }
    renderApp('/')
    expect(screen.getByText('Carregando Faturamento do período…')).toBeInTheDocument()
  })

  it('erro em uma seção não derruba as demais e permite nova tentativa', async () => {
    const base = source.current
    const getSummary = vi.fn(base.getSummary).mockRejectedValueOnce(new Error('falha'))
    source.current = { ...base, getSummary }
    renderApp('/')

    const retries = await screen.findAllByRole('button', { name: 'Tentar novamente' })
    expect(retries.length).toBeGreaterThan(0)
    expect(await screen.findByText('Alertas de estoque')).toBeInTheDocument()
    expect((await screen.findAllByText('Detergente Neutro 5L')).length).toBeGreaterThan(0)

    await userEvent.click(retries[0] as HTMLElement)
    await screen.findByText(money(summaryFor('30d').revenueCents))
  })

  it('exibe estados vazios no ranking e nos alertas', async () => {
    source.current = {
      ...source.current,
      getTopProducts: async () => ({ totalUnits: 0, items: [] }),
      getLowStockAlerts: async () => [],
    }
    renderApp('/')

    expect(await screen.findByText('Nenhuma venda no período')).toBeInTheDocument()
    expect(await screen.findByText('Tudo em ordem')).toBeInTheDocument()
  })

  it('ranking separa unidades de valor e calcula a participação', async () => {
    renderApp('/')
    const table = await screen.findByRole('table', { name: 'Produtos mais vendidos no período' })

    expect(within(table).getByRole('columnheader', { name: 'Quantidade (un.)' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Valor (R$)' })).toBeInTheDocument()
    expect(within(table).getAllByText(/\d+,\d%/).length).toBe(5)
  })

  it('alertas distinguem esgotado e baixo por texto e ícone', async () => {
    renderApp('/')
    const table = await screen.findByRole('table', { name: 'Produtos abaixo do estoque mínimo' })

    expect(within(table).getByText('Esgotado')).toBeInTheDocument()
    expect(within(table).getAllByText('Baixo').length).toBeGreaterThan(0)
  })

  it('pedidos recentes têm status em badge e detalhes indisponíveis', async () => {
    renderApp('/')
    const table = await screen.findByRole('table', { name: 'Pedidos de venda recentes' })

    expect(within(table).getByText('Confirmado')).toBeInTheDocument()
    expect(within(table).getByText('Cancelado')).toBeInTheDocument()
    const details = within(table).getAllByRole('button', { name: /indisponível/ })
    expect(details.every((button) => (button as HTMLButtonElement).disabled)).toBe(true)
  })

  it('atividades recentes são identificadas como demonstrativas', async () => {
    renderApp('/')
    expect(await screen.findByText('Venda #1240 confirmada')).toBeInTheDocument()
    expect(screen.getAllByText('Demonstrativo').length).toBeGreaterThan(0)
  })
})
