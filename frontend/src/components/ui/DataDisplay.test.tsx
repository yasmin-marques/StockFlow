import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from './Badge'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { Pagination } from './Pagination'
import { Skeleton } from './Skeleton'
import { Table, Td, Th } from './Table'

describe('Pagination', () => {
  it('marca a página atual e navega para a próxima', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />)

    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')

    await userEvent.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('desabilita anterior na primeira página e próxima na última', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()

    rerender(<Pagination page={5} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('resume com reticências quando há muitas páginas', () => {
    render(<Pagination page={1} pageCount={20} onPageChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 20' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Página 10' })).not.toBeInTheDocument()
  })
})

describe('Table', () => {
  it('renderiza cabeçalhos com escopo de coluna e legenda acessível', () => {
    render(
      <Table caption="Produtos">
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th align="end">Qtd</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Café</Td>
            <Td align="end">10</Td>
          </tr>
        </tbody>
      </Table>,
    )

    const table = screen.getByRole('table', { name: 'Produtos' })
    expect(within(table).getByRole('columnheader', { name: 'Nome' })).toHaveAttribute('scope', 'col')
    expect(within(table).getByRole('cell', { name: '10' })).toHaveAttribute('data-align', 'end')
  })
})

describe('estados', () => {
  it('EmptyState mostra título, descrição e ação', () => {
    render(<EmptyState title="Vazio" description="Nada aqui" action={<button>Criar</button>} />)

    expect(screen.getByRole('heading', { name: 'Vazio' })).toBeInTheDocument()
    expect(screen.getByText('Nada aqui')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument()
  })

  it('ErrorState anuncia o erro e permite nova tentativa', async () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('ErrorState sem onRetry não exibe botão', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('Skeleton é decorativo', () => {
    const { container } = render(<Skeleton width={40} />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('Badge inclui ícone por tom semântico (não depende só da cor)', () => {
    const { container } = render(<Badge tone="bad">Crítico</Badge>)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('sf-badge--bad')
  })
})
