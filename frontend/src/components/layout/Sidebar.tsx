import { Palette, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { dashboardItem, moduleGroups, type NavGroup, type NavItem } from '@/app/navigation'
import { IconButton, Tooltip } from '@/components/ui'
import { useHealth } from '@/hooks/useHealth'
import { cn } from '@/lib/cn'

interface SidebarProps {
  collapsed?: boolean
  /** Exibe o botão de recolher (apenas desktop). */
  onToggleCollapsed?: () => void
  /** Chamado após navegar; usado para fechar o drawer no mobile. */
  onNavigate?: () => void
}

const groups: NavGroup[] = [{ items: [dashboardItem] }, ...moduleGroups]

function SidebarLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const Icon = item.icon
  const link = (
    <NavLink to={item.to} end={item.to === '/'} className="sf-nav-link" onClick={onNavigate}>
      <Icon size={18} aria-hidden="true" />
      <span className={cn(collapsed && 'sf-visually-hidden')}>{item.label}</span>
    </NavLink>
  )
  return <li>{collapsed ? <Tooltip content={item.label} side="right">{link}</Tooltip> : link}</li>
}

function ApiStatus({ collapsed }: { collapsed: boolean }) {
  const { data, isPending, isError } = useHealth()
  const state = isPending
    ? { tone: '', label: 'Verificando API…' }
    : isError
      ? { tone: 'bad', label: 'API indisponível' }
      : data.status === 'UP'
        ? { tone: 'ok', label: 'API conectada' }
        : { tone: 'warn', label: 'API com degradação' }

  return (
    <div className="sf-sidebar__footer" role="status">
      <span className={cn('sf-status-dot', state.tone && `sf-status-dot--${state.tone}`)} aria-hidden="true" />
      <span className={cn(collapsed && 'sf-visually-hidden')}>{state.label}</span>
    </div>
  )
}

export function Sidebar({ collapsed = false, onToggleCollapsed, onNavigate }: SidebarProps) {
  return (
    <div className={cn('sf-sidebar', collapsed && 'sf-sidebar--collapsed')}>
      <div className="sf-sidebar__header">
        {!collapsed && (
          <Link to="/" className="sf-brand" onClick={onNavigate} aria-label="StockFlow — ir para o Dashboard">
            Stock<span>Flow</span>
          </Link>
        )}
        {onToggleCollapsed && (
          <IconButton
            className="sf-sidebar__toggle"
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            aria-expanded={!collapsed}
            icon={collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
            onClick={onToggleCollapsed}
          />
        )}
      </div>

      <nav className="sf-sidebar__nav" aria-label="Navegação principal">
        {groups.map((group, index) => (
          <div key={group.label ?? index} className={cn('sf-nav-group', !group.label && index > 1 && 'sf-nav-group--ruled')}>
            {group.label && <div className="sf-nav-group__label">{group.label}</div>}
            <ul className="sf-nav-list">
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
              ))}
              {import.meta.env.DEV && index === groups.length - 1 && (
                <SidebarLink
                  item={{ to: '/componentes', label: 'Componentes (dev)', icon: Palette }}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              )}
            </ul>
          </div>
        ))}
      </nav>

      <ApiStatus collapsed={collapsed} />
    </div>
  )
}
