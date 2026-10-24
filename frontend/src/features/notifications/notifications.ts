import { useCallback, useState } from 'react'

export interface AppNotification {
  id: string
  title: string
  description: string
  /** Texto já formatado ("Hoje, 14:05"); virá do backend com instante ISO. */
  when: string
  read: boolean
}

/** NOTIFICAÇÕES DEMONSTRATIVAS — não existe backend de notificações; o painel avisa isso ao usuário. */
export const demoNotifications: AppNotification[] = [
  {
    id: 'demo-n1',
    title: 'Estoque abaixo do mínimo',
    description: 'Detergente Neutro 5L está esgotado.',
    when: 'Hoje, 14:05',
    read: false,
  },
  {
    id: 'demo-n2',
    title: 'Pedido de compra recebido',
    description: 'O pedido PC-0090 foi recebido por completo.',
    when: 'Hoje, 11:20',
    read: false,
  },
  {
    id: 'demo-n3',
    title: 'Pedido cancelado',
    description: 'O pedido #1236 foi cancelado.',
    when: 'Anteontem, 17:55',
    read: true,
  },
]

/** Estado local das notificações; trocar pelo TanStack Query quando houver API. */
export function useNotifications(initial: AppNotification[] = demoNotifications) {
  const [items, setItems] = useState(initial)

  const markAllRead = useCallback(() => setItems((current) => current.map((item) => ({ ...item, read: true }))), [])
  const clear = useCallback(() => setItems([]), [])

  return { items, unreadCount: items.filter((item) => !item.read).length, markAllRead, clear }
}
