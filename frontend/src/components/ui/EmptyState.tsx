import type { ReactNode } from 'react'
import './feedback.css'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="sf-state">
      {icon && <div className="sf-state__icon">{icon}</div>}
      <h3 className="sf-state__title">{title}</h3>
      {description && <p className="sf-state__description">{description}</p>}
      {action && <div className="sf-state__action">{action}</div>}
    </div>
  )
}
