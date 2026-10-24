import { createContext, useContext } from 'react'

export type ToastTone = 'ok' | 'warn' | 'bad' | 'info'

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
}

export interface ToastApi {
  toast: (input: ToastInput) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}
