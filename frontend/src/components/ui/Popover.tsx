import * as RadixPopover from '@radix-ui/react-popover'
import type { ReactNode } from 'react'
import './overlay.css'

interface PopoverProps {
  /** Elemento focável que abre o painel (ex.: IconButton). */
  trigger: ReactNode
  /** Nome acessível do painel. */
  label: string
  align?: 'start' | 'center' | 'end'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

/** Painel flutuante acessível (Radix): Esc e clique fora fecham; o foco volta ao gatilho. */
export function Popover({ trigger, label, align = 'end', open, onOpenChange, children }: PopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content className="sf-popover" align={align} sideOffset={8} collisionPadding={12} aria-label={label}>
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
