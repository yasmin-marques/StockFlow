import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { Providers } from '@/app/Providers'
import { createQueryClient } from '@/lib/queryClient'
import { createTestRouter } from './router'

vi.mock('@/services/health', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'UP', database: 'UP', timestamp: '2026-01-01T00:00:00Z' }),
}))

function renderAt(path: string) {
  return render(
    <Providers client={createQueryClient()}>
      <RouterProvider router={createTestRouter([path])} />
    </Providers>,
  )
}

describe('navegação', () => {
  it('abre no dashboard com indicadores marcados como mock', () => {
    renderAt('/')

    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Dados demonstrativos (mock)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
  })

  it('navega para um módulo futuro, atualizando título, breadcrumbs e item ativo', async () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' })

    await userEvent.click(within(nav).getByRole('link', { name: 'Produtos' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Produtos' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Produtos' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')

    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumbs' })
    expect(within(crumbs).getByText('Estoque')).toBeInTheDocument()
    expect(screen.getByText('Entrega 3')).toBeInTheDocument()
  })

  it('exibe 404 para rota desconhecida', () => {
    renderAt('/nao-existe')
    expect(screen.getByRole('heading', { name: 'Página não encontrada', level: 3 })).toBeInTheDocument()
  })

  it('recolhe e expande a sidebar', async () => {
    renderAt('/')

    await userEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))
    const expand = screen.getByRole('button', { name: 'Expandir menu' })
    expect(expand).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(expand)
    expect(screen.getByRole('button', { name: 'Recolher menu' })).toBeInTheDocument()
  })

  it('itens não funcionais da topbar ficam desabilitados', () => {
    renderAt('/')

    expect(screen.getByLabelText(/busca global/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /notificações/i })).toBeDisabled()
  })

  it('mostra o status real da API no rodapé da sidebar', async () => {
    renderAt('/')
    expect(await screen.findByText('API conectada')).toBeInTheDocument()
  })
})
