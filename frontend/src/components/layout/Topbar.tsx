import { Menu, UserRound } from 'lucide-react'
import { useMatches } from 'react-router-dom'
import type { RouteHandle } from '@/app/routeHandle'
import { IconButton } from '@/components/ui'
import { NotificationsMenu } from '@/features/notifications/NotificationsMenu'
import { GlobalSearch } from '@/features/search/GlobalSearch'
import { Breadcrumbs } from './Breadcrumbs'

interface TopbarProps {
  onOpenMenu: () => void
}

function usePageMeta(): RouteHandle {
  const matches = useMatches()
  const handle = [...matches].reverse().find((m) => m.handle)?.handle as RouteHandle | undefined
  return handle ?? { title: 'StockFlow', crumbs: [{ label: 'StockFlow' }] }
}

export function Topbar({ onOpenMenu }: TopbarProps) {
  const { title, crumbs } = usePageMeta()

  return (
    <header className="sf-topbar">
      <IconButton
        className="sf-topbar__menu"
        aria-label="Abrir menu de navegação"
        icon={<Menu size={20} aria-hidden="true" />}
        onClick={onOpenMenu}
      />

      <div className="sf-topbar__heading">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="sf-topbar__title">{title}</h1>
      </div>

      <div className="sf-topbar__search">
        <GlobalSearch />
      </div>

      <NotificationsMenu />

      {/* Sem autenticação ainda: estado neutro, nenhum usuário fictício apresentado como real. */}
      <div className="sf-profile">
        <div className="sf-profile__text">
          <strong>Perfil indisponível</strong>
          Aguardando autenticação
        </div>
        <span className="sf-avatar" aria-hidden="true">
          <UserRound size={16} />
        </span>
      </div>
    </header>
  )
}
