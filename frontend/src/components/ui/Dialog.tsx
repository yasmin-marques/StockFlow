import * as RadixDialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { useFocusReturn } from './useFocusReturn'
import './overlay.css'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Ações (botões) alinhadas à direita no rodapé. */
  footer?: ReactNode
  children?: ReactNode
}

/** Modal acessível (Radix): foco preso, Esc fecha, foco volta ao gatilho. */
export function Dialog({ open, onOpenChange, title, description, footer, children }: DialogProps) {
  const focusReturn = useFocusReturn()
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="sf-overlay" />
        <RadixDialog.Content
          className="sf-dialog"
          {...focusReturn}
          // sem descrição, o Radix exige opt-out explícito do aria-describedby
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          <RadixDialog.Title className="sf-overlay-title">{title}</RadixDialog.Title>
          {description && (
            <RadixDialog.Description className="sf-overlay-description">{description}</RadixDialog.Description>
          )}
          {children}
          {footer && <div className="sf-dialog__footer">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
