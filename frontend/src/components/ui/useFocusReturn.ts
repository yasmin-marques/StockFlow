import { useRef } from 'react'

/**
 * Overlays controlados (sem <Trigger> do Radix) perdem o foco ao fechar.
 * Guarda o elemento focado na abertura e o restaura no fechamento.
 */
export function useFocusReturn() {
  const origin = useRef<HTMLElement | null>(null)

  return {
    onOpenAutoFocus: () => {
      origin.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault()
      origin.current?.focus()
    },
  }
}
