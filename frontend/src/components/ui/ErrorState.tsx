import { TriangleAlert } from 'lucide-react'
import { Button } from './Button'
import './feedback.css'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não foi possível concluir a operação. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="sf-state sf-state--error" role="alert">
      <div className="sf-state__icon">
        <TriangleAlert size={22} aria-hidden="true" />
      </div>
      <h3 className="sf-state__title">{title}</h3>
      <p className="sf-state__description">{description}</p>
      {onRetry && (
        <div className="sf-state__action">
          <Button variant="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  )
}
