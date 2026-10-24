import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import './overlay.css'

export const TooltipProvider = ({ children }: { children: ReactNode }) => (
  <RadixTooltip.Provider delayDuration={300}>{children}</RadixTooltip.Provider>
)

interface TooltipProps {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Um único elemento focável; o tooltip aparece com hover e foco de teclado. */
  children: ReactNode
}

export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content className="sf-tooltip" side={side} sideOffset={6}>
          {content}
          <RadixTooltip.Arrow className="sf-tooltip__arrow" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
