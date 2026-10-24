import { CircleCheck, CircleX, Circle, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import './feedback.css'

export type BadgeTone = 'neutral' | 'accent' | 'ok' | 'warn' | 'bad' | 'info'

/** Status nunca depende só da cor: cada tom semântico leva um ícone distinto. */
const toneIcon: Partial<Record<BadgeTone, typeof Circle>> = {
  neutral: Circle,
  ok: CircleCheck,
  warn: TriangleAlert,
  bad: CircleX,
  info: Info,
}

interface BadgeProps {
  tone?: BadgeTone
  /** Oculta o ícone (use apenas quando o texto já carrega o significado). */
  hideIcon?: boolean
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', hideIcon = false, className, children }: BadgeProps) {
  const Icon = toneIcon[tone]
  return (
    <span className={cn('sf-badge', `sf-badge--${tone}`, className)}>
      {Icon && !hideIcon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  )
}
