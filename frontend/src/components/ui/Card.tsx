import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import './data.css'

interface CardProps extends HTMLAttributes<HTMLElement> {
  elevated?: boolean
}

export function Card({ elevated, className, ...rest }: CardProps) {
  return <section className={cn('sf-card', elevated && 'sf-card--elevated', className)} {...rest} />
}

interface CardHeaderProps {
  title: ReactNode
  kicker?: string
  action?: ReactNode
  /** Nível do título para manter a hierarquia correta da página. */
  as?: 'h2' | 'h3' | 'h4'
}

export function CardHeader({ title, kicker, action, as: Heading = 'h2' }: CardHeaderProps) {
  return (
    <div className="sf-card__header">
      <div>
        {kicker && <div className="sf-card__kicker">{kicker}</div>}
        <Heading className="sf-card__title">{title}</Heading>
      </div>
      {action}
    </div>
  )
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove o padding (ex.: tabelas que ocupam toda a largura do card). */
  flush?: boolean
}

export function CardBody({ flush, className, ...rest }: CardBodyProps) {
  return <div className={cn('sf-card__body', flush && 'sf-card__body--flush', className)} {...rest} />
}
