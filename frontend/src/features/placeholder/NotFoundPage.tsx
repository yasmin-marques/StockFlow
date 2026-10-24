import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, EmptyState } from '@/components/ui'

export function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon={<SearchX size={22} aria-hidden="true" />}
        title="Página não encontrada"
        description="O endereço acessado não existe no StockFlow."
        action={<Link to="/">Voltar ao Dashboard</Link>}
      />
    </Card>
  )
}
