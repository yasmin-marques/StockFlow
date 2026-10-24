import { createBrowserRouter, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { RouteError } from '@/app/RouteError'
import { findGroupLabel, modules } from '@/app/navigation'
import { ROUTES } from '@/app/routes'
import type { RouteHandle } from '@/app/routeHandle'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ModulePlaceholderPage } from '@/features/placeholder/ModulePlaceholderPage'
import { NotFoundPage } from '@/features/placeholder/NotFoundPage'

/** Trilha padrão: StockFlow (link para o início) › grupo (texto) › página. */
const handle = (title: string, group?: string): RouteHandle => ({
  title,
  crumbs: [
    { label: 'StockFlow', to: ROUTES.dashboard },
    ...(group ? [{ label: group }] : []),
    { label: title },
  ],
})

/*
 * Rotas centralizadas. Quando houver autenticação (futuro), as rotas filhas de AppLayout
 * passam a ficar sob uma rota-guarda pathless; nenhuma proteção simulada existe hoje.
 */
export const routes: RouteObject[] = [
  {
    path: ROUTES.dashboard,
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage />, handle: handle('Dashboard') },
      ...modules.map(
        (module): RouteObject => ({
          path: module.to.slice(1),
          element: <ModulePlaceholderPage module={module} />,
          handle: handle(module.label, findGroupLabel(module.to)),
        }),
      ),
      // Catálogo do design system: existe apenas no build de desenvolvimento.
      ...(import.meta.env.DEV
        ? [
            {
              path: ROUTES.components.slice(1),
              lazy: async () => ({
                Component: (await import('@/features/components-demo/ComponentsPage')).ComponentsPage,
              }),
              handle: handle('Componentes', 'Design system'),
            },
          ]
        : []),
      { path: '*', element: <NotFoundPage />, handle: handle('Página não encontrada') },
    ],
  },
]

export const createRouter = () => createBrowserRouter(routes)
export const createTestRouter = (initialEntries: string[]) => createMemoryRouter(routes, { initialEntries })
