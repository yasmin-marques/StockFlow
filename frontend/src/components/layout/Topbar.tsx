import { Bell, Menu, Search, UserRound } from 'lucide-react'
import { Fragment } from 'react'
import { useMatches } from 'react-router-dom'
import type { RouteHandle } from '@/app/routeHandle'
import { IconButton } from '@/components/ui'

interface TopbarProps {
  onOpenMenu: () => void
}

function usePageMeta(): RouteHandle {
  const matches = useMatches()
  const handle = [...matches].reverse().find((m) => m.handle)?.handle as RouteHandle | undefined
  return handle ?? { title: 'StockFlow', crumbs: ['StockFlow'] }
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
        <nav className="sf-breadcrumbs" aria-label="Breadcrumbs">
          <ol>
            {crumbs.map((crumb, index) => (
              <Fragment key={`${crumb}-${index}`}>
                <li aria-current={index === crumbs.length - 1 ? 'page' : undefined}>{crumb}</li>
              </Fragment>
            ))}
          </ol>
        </nav>
        <h1 className="sf-topbar__title">{title}</h1>
      </div>

      {/* Busca, notificações e perfil ainda não têm backend: ficam visíveis, porém desabilitados. */}
      <div className="sf-topbar__search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          className="sf-control"
          placeholder="Buscar — em breve"
          aria-label="Busca global (indisponível)"
          disabled
        />
      </div>

      <IconButton
        aria-label="Notificações (indisponível)"
        title="Notificações — em breve"
        icon={<Bell size={18} aria-hidden="true" />}
        disabled
      />

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
