import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from './Button'
import { useFocusReturn } from './useFocusReturn'
import './overlay.css'

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  side?: 'left' | 'right'
  footer?: ReactNode
  /** Remove o padding do corpo (ex.: navegação ocupando todo o painel). */
  bare?: boolean
  children?: ReactNode
}

/** Painel lateral sobre a página, construído sobre o Dialog do Radix (mesma acessibilidade). */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  footer,
  bare,
  children,
}: DrawerProps) {
  const focusReturn = useFocusReturn()
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="sf-overlay" />
        <RadixDialog.Content
          className={cn('sf-drawer', `sf-drawer--${side}`, bare && 'sf-drawer--bare')}
          {...focusReturn}
          // sem descrição, o Radix exige opt-out explícito do aria-describedby
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          <div className="sf-drawer__header">
            <div>
              <RadixDialog.Title className="sf-overlay-title">{title}</RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="sf-overlay-description">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close asChild>
              <IconButton aria-label="Fechar" icon={<X size={18} aria-hidden="true" />} />
            </RadixDialog.Close>
          </div>
          <div className="sf-drawer__body">{children}</div>
          {footer && <div className="sf-drawer__footer">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
