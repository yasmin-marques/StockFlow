import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryBoundary } from './QueryBoundary'

const base = { data: undefined, isPending: false, isError: false, isFetching: false, refetch: vi.fn() }
const props = { loading: <span>skeleton</span>, empty: <span>vazio</span>, isEmpty: (d: string[]) => d.length === 0 }

describe('QueryBoundary', () => {
  it('mostra loading na primeira carga, com aria-busy', () => {
    render(
      <QueryBoundary query={{ ...base, isPending: true }} {...props}>
        {() => <span>conteúdo</span>}
      </QueryBoundary>,
    )
    expect(screen.getByText('skeleton')).toBeInTheDocument()
    expect(screen.getByText('skeleton').parentElement).toHaveAttribute('aria-busy', 'true')
  })

  it('mostra erro com nova tentativa', async () => {
    const refetch = vi.fn()
    render(
      <QueryBoundary query={{ ...base, isError: true, refetch }} {...props} errorTitle="Falhou">
        {() => <span>conteúdo</span>}
      </QueryBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou')
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('mostra estado vazio', () => {
    render(
      <QueryBoundary query={{ ...base, data: [] }} {...props}>
        {() => <span>conteúdo</span>}
      </QueryBoundary>,
    )
    expect(screen.getByText('vazio')).toBeInTheDocument()
  })

  it('mostra o conteúdo e marca atualização em andamento', () => {
    const { rerender } = render(
      <QueryBoundary query={{ ...base, data: ['a'] }} {...props}>
        {(data) => <span>{data.join(',')}</span>}
      </QueryBoundary>,
    )
    expect(screen.getByText('a').parentElement).toHaveAttribute('data-refreshing', 'false')

    rerender(
      <QueryBoundary query={{ ...base, data: ['a'], isFetching: true }} {...props}>
        {(data) => <span>{data.join(',')}</span>}
      </QueryBoundary>,
    )
    expect(screen.getByText('a').parentElement).toHaveAttribute('aria-busy', 'true')
  })
})
