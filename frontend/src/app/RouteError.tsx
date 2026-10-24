import { useRouteError } from 'react-router-dom'
import { Card, ErrorState } from '@/components/ui'

/** Fallback de erros de renderização/loader em qualquer rota. */
export function RouteError() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)

  return (
    <Card style={{ margin: 'var(--space-6)' }}>
      <ErrorState
        title="Não foi possível exibir esta página"
        description="Ocorreu um erro inesperado. Recarregue a página para tentar novamente."
        onRetry={() => window.location.reload()}
      />
    </Card>
  )
}
