import * as RadixToast from '@radix-ui/react-toast'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { IconButton } from './Button'
import { ToastContext, type ToastApi, type ToastInput, type ToastTone } from './toast-context'
import './feedback.css'

interface ToastItem extends ToastInput {
  id: number
}

const toneIcon: Record<ToastTone, typeof Info> = {
  ok: CircleCheck,
  warn: TriangleAlert,
  bad: CircleX,
  info: Info,
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((input: ToastInput) => {
    setItems((current) => [...current, { ...input, id: nextId++ }])
  }, [])

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const api = useMemo<ToastApi>(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={api}>
      <RadixToast.Provider duration={5000} label="Notificações">
        {children}
        {items.map((item) => {
          const tone = item.tone ?? 'info'
          const Icon = toneIcon[tone]
          return (
            <RadixToast.Root
              key={item.id}
              className={`sf-toast sf-toast--${tone}`}
              onOpenChange={(open) => !open && remove(item.id)}
            >
              <Icon className="sf-toast__icon" size={18} aria-hidden="true" />
              <div>
                <RadixToast.Title className="sf-toast__title">{item.title}</RadixToast.Title>
                {item.description && (
                  <RadixToast.Description className="sf-toast__description">
                    {item.description}
                  </RadixToast.Description>
                )}
              </div>
              <RadixToast.Close asChild>
                <IconButton size="sm" aria-label="Dispensar notificação" icon={<X size={16} aria-hidden="true" />} />
              </RadixToast.Close>
            </RadixToast.Root>
          )
        })}
        <RadixToast.Viewport className="sf-toast-viewport" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}
