import type { ReactNode } from 'react'
import { ErrorState } from './ErrorState'
import './feedback.css'

interface BoundaryQuery<T> {
  data: T | undefined
  isPending: boolean
  isError: boolean
  isFetching: boolean
  refetch: () => unknown
}

interface QueryBoundaryProps<T> {
  query: BoundaryQuery<T>
  /** Estado vazio (ex.: lista sem itens). */
  isEmpty?: (data: T) => boolean
  loading: ReactNode
  empty?: ReactNode
  errorTitle?: string
  children: (data: T) => ReactNode
}

/**
 * Padroniza os estados de uma consulta: loading (primeira carga), erro com nova tentativa,
 * vazio e sucesso. Durante atualizações com dados anteriores, o conteúdo fica visível e
 * marcado como "atualizando" (aria-busy), sem piscar um skeleton.
 */
export function QueryBoundary<T>({ query, isEmpty, loading, empty, errorTitle, children }: QueryBoundaryProps<T>) {
  if (query.isError) {
    return <ErrorState title={errorTitle} onRetry={() => void query.refetch()} />
  }
  if (query.isPending || query.data === undefined) {
    return (
      <div aria-busy="true" aria-live="polite">
        <span className="sf-visually-hidden">Carregando…</span>
        {loading}
      </div>
    )
  }
  if (isEmpty?.(query.data)) return <>{empty}</>

  return (
    <div className="sf-refreshable" aria-busy={query.isFetching} data-refreshing={query.isFetching}>
      {children(query.data)}
    </div>
  )
}
