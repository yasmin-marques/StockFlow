import { Bell, BellOff } from 'lucide-react'
import { Badge, Button, EmptyState, IconButton, Popover } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useNotifications, type AppNotification } from './notifications'
import './notifications.css'

interface NotificationsMenuProps {
  /** Injetável para testes e para a futura integração com a API. */
  initialItems?: AppNotification[]
}

export function NotificationsMenu({ initialItems }: NotificationsMenuProps) {
  const { items, unreadCount, markAllRead, clear } = useNotifications(initialItems)

  const label = unreadCount > 0 ? `Notificações, ${unreadCount} não lidas` : 'Notificações'

  return (
    <Popover
      label="Notificações"
      trigger={
        <IconButton
          className="sf-notif-trigger"
          aria-label={label}
          icon={
            <>
              <Bell size={18} aria-hidden="true" />
              {unreadCount > 0 && <span className="sf-notif-dot" aria-hidden="true" />}
            </>
          }
        />
      }
    >
      <div className="sf-notif">
        <div className="sf-notif__header">
          <h2 className="sf-notif__title">Notificações</h2>
          <Badge tone="warn">Demonstrativo</Badge>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<BellOff size={22} aria-hidden="true" />}
            title="Nenhuma notificação"
            description="Alertas de estoque e de pedidos aparecerão aqui."
          />
        ) : (
          <>
            <ul className="sf-notif__list">
              {items.map((item) => (
                <li key={item.id} className={cn('sf-notif__item', !item.read && 'is-unread')}>
                  {!item.read && <span className="sf-notif__unread" aria-hidden="true" />}
                  <div>
                    <div className="sf-notif__item-title">
                      {item.title}
                      {!item.read && <span className="sf-visually-hidden"> (não lida)</span>}
                    </div>
                    <p className="sf-notif__item-text">{item.description}</p>
                    <span className="sf-notif__when">{item.when}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="sf-notif__footer">
              <Button size="sm" variant="ghost" onClick={markAllRead} disabled={unreadCount === 0}>
                Marcar todas como lidas
              </Button>
              <Button size="sm" variant="ghost" onClick={clear}>
                Limpar
              </Button>
            </div>
          </>
        )}
      </div>
    </Popover>
  )
}
