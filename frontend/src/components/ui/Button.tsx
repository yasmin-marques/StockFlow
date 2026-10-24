import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '@/lib/cn'
import './button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  block?: boolean
  leadingIcon?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  block = false,
  leadingIcon,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonBaseProps) {
  return (
    <button
      type={type}
      className={cn(
        'sf-btn',
        `sf-btn--${variant}`,
        size === 'sm' && 'sf-btn--sm',
        block && 'sf-btn--block',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="sf-btn__spinner" aria-hidden="true" /> : leadingIcon}
      {children}
    </button>
  )
}

interface IconButtonProps extends Omit<ButtonBaseProps, 'leadingIcon' | 'block' | 'children'> {
  /** Obrigatório: botões só com ícone precisam de nome acessível. */
  'aria-label': string
  icon: ReactNode
}

export function IconButton({ icon, className, variant = 'ghost', ...rest }: IconButtonProps) {
  return (
    <Button variant={variant} className={cn('sf-btn--icon', className)} {...rest}>
      {icon}
    </Button>
  )
}
