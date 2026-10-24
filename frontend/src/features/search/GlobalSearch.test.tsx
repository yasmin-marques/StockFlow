import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ROUTES } from '@/app/routes'
import { renderApp } from '@/test/renderApp'

vi.mock('@/services/health', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'UP', database: 'UP', timestamp: '2026-01-01T00:00:00Z' }),
}))

const openSearch = () => userEvent.click(screen.getByRole('button', { name: 'Abrir busca global' }))

describe('busca global', () => {
  it('abre por clique com foco automático no campo', async () => {
    renderApp('/')
    await openSearch()

    expect(screen.getByRole('dialog', { name: 'Busca global' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Buscar páginas e módulos' })).toHaveFocus()
    expect(screen.getAllByRole('option').length).toBeGreaterThan(5)
  })

  it('filtra, navega com Enter e fecha', async () => {
    const { router } = renderApp('/')
    await openSearch()

    await userEvent.type(screen.getByRole('combobox'), 'relat')
    expect(screen.getAllByRole('option')).toHaveLength(1)

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTES.reports))
    expect(screen.queryByRole('dialog', { name: 'Busca global' })).not.toBeInTheDocument()
  })

  it('navega pelas opções com as setas', async () => {
    const { router } = renderApp('/')
    await openSearch()

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0]?.id)

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{ArrowUp}{Enter}')
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTES.products))
  })

  it('navega ao clicar em um resultado', async () => {
    const { router } = renderApp('/')
    await openSearch()
    await userEvent.click(screen.getByRole('option', { name: /Clientes/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTES.customers))
  })

  it('mostra estado sem resultados', async () => {
    renderApp('/')
    await openSearch()
    await userEvent.type(screen.getByRole('combobox'), 'zzzz')

    expect(screen.getByRole('status')).toHaveTextContent('Nenhum resultado para “zzzz”.')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('fecha com Escape e devolve o foco ao botão', async () => {
    renderApp('/')
    await openSearch()
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Busca global' })).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Abrir busca global' })).toHaveFocus())
  })

  it('abre com "/" e com Ctrl+K', async () => {
    renderApp('/')
    await userEvent.keyboard('/')
    expect(screen.getByRole('dialog', { name: 'Busca global' })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await userEvent.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: 'Busca global' })).toBeInTheDocument()
  })

  it('"/" digitado em um campo não abre a busca', async () => {
    renderApp('/')
    await userEvent.click(screen.getByLabelText('Período'))
    await userEvent.keyboard('/')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
