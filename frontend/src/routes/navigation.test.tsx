import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ROUTES } from '@/app/routes'
import { renderApp } from '@/test/renderApp'

vi.mock('@/services/health', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'UP', database: 'UP', timestamp: '2026-01-01T00:00:00Z' }),
}))

const mainNav = () => screen.getByRole('navigation', { name: 'Navegação principal' })

describe('sidebar', () => {
  it('agrupa a navegação por domínio, na ordem definida', () => {
    renderApp('/')
    const groups = within(mainNav())
      .getAllByRole('list')
      .map((list) => list.getAttribute('aria-label'))
    expect(groups.slice(0, 4)).toEqual(['Visão geral', 'Operações', 'Cadastros', 'Gestão'])

    const operations = within(within(mainNav()).getByRole('list', { name: 'Operações' }))
      .getAllByRole('link')
      .map((link) => link.textContent)
    expect(operations).toEqual(['Produtos', 'Estoque', 'Movimentações', 'Vendas', 'Compras'])
  })

  it('todos os links apontam para rotas válidas (nenhum cai no 404)', async () => {
    const { router } = renderApp('/')
    const hrefs = within(mainNav())
      .getAllByRole('link')
      .map((link) => link.getAttribute('href') as string)
      .filter((href) => href !== ROUTES.components)

    expect(hrefs.length).toBe(13)
    for (const href of hrefs) {
      await act(() => router.navigate(href))
      expect(screen.queryByText('Página não encontrada')).not.toBeInTheDocument()
      expect(within(mainNav()).getByRole('link', { current: 'page' })).toHaveAttribute('href', href)
    }
  })

  it('marca apenas a rota ativa com aria-current', async () => {
    renderApp('/')
    expect(within(mainNav()).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')

    await userEvent.click(within(mainNav()).getByRole('link', { name: 'Estoque' }))
    expect(within(mainNav()).getByRole('link', { name: 'Estoque' })).toHaveAttribute('aria-current', 'page')
    expect(within(mainNav()).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('é navegável por teclado', async () => {
    const { router } = renderApp('/')
    const link = within(mainNav()).getByRole('link', { name: 'Clientes' })
    link.focus()
    expect(link).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe(ROUTES.customers)
  })

  it('recolhe e expande, mantendo nomes acessíveis dos links', async () => {
    renderApp('/')
    await userEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))

    const expand = screen.getByRole('button', { name: 'Expandir menu' })
    expect(expand).toHaveAttribute('aria-expanded', 'false')
    expect(within(mainNav()).getByRole('link', { name: 'Produtos' })).toBeInTheDocument()

    await userEvent.click(expand)
    expect(screen.getByRole('button', { name: 'Recolher menu' })).toBeInTheDocument()
  })

  it('mostra o status real da API', async () => {
    renderApp('/')
    expect(await screen.findByText('API conectada')).toBeInTheDocument()
  })
})

describe('breadcrumbs e título', () => {
  it('derivam da rota, com link para o início e grupo como texto', async () => {
    renderApp('/')
    await userEvent.click(within(mainNav()).getByRole('link', { name: 'Produtos' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Produtos' })).toBeInTheDocument()
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumbs' })
    expect(within(crumbs).getByRole('link', { name: 'StockFlow' })).toHaveAttribute('href', ROUTES.dashboard)
    expect(within(crumbs).getByText('Operações')).not.toHaveAttribute('href')
    expect(within(crumbs).getByText('Produtos')).toHaveAttribute('aria-current', 'page')
  })

  it('o link do breadcrumb navega sem recarregar', async () => {
    const { router } = renderApp(ROUTES.suppliers)
    expect(screen.getByRole('heading', { level: 1, name: 'Fornecedores' })).toBeInTheDocument()

    await userEvent.click(within(screen.getByRole('navigation', { name: 'Breadcrumbs' })).getByRole('link', { name: 'StockFlow' }))
    expect(router.state.location.pathname).toBe(ROUTES.dashboard)
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
  })
})

describe('rotas', () => {
  it('módulos futuros mostram página de indisponibilidade temporária', () => {
    renderApp(ROUTES.sales)
    expect(screen.getByText('Módulo temporariamente indisponível')).toBeInTheDocument()
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('exibe 404 para rota desconhecida', () => {
    renderApp('/nao-existe')
    expect(screen.getByRole('heading', { name: 'Página não encontrada', level: 3 })).toBeInTheDocument()
  })

  it('preserva os parâmetros da URL ao carregar', () => {
    const { router } = renderApp('/?periodo=7d')
    expect(router.state.location.search).toBe('?periodo=7d')
  })

  it('a topbar mantém apenas o perfil neutro, sem usuário fictício', () => {
    renderApp('/')
    expect(screen.getByText('Perfil indisponível')).toBeInTheDocument()
  })
})

describe('navegação em telas estreitas', () => {
  const original = window.matchMedia

  beforeEach(() => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes('max-width'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia
  })
  afterEach(() => {
    window.matchMedia = original
  })

  it('abre o menu em drawer, navega e fecha', async () => {
    const { router } = renderApp('/')
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }))
    const drawer = screen.getByRole('dialog', { name: 'Menu' })

    await userEvent.click(within(drawer).getByRole('link', { name: 'Clientes' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTES.customers))
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
  })

  it('o drawer fecha com Esc', async () => {
    renderApp('/')
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
  })
})
