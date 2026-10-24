import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Drawer } from '@/components/ui'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import './layout.css'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isCompact = useMediaQuery('(max-width: 960px)')

  return (
    <>
      <a className="sf-skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className={cn('sf-shell', collapsed && 'sf-shell--collapsed')}>
        <aside className="sf-shell__sidebar">
          <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
        </aside>

        <div className="sf-shell__main-column">
          <Topbar onOpenMenu={() => setMenuOpen(true)} />
          <main id="conteudo" className="sf-shell__content" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      </div>

      {isCompact && (
        <Drawer open={menuOpen} onOpenChange={setMenuOpen} title="Menu" side="left" bare>
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </Drawer>
      )}
    </>
  )
}
