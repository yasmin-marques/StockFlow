import { createBrowserRouter, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { RouteError } from '@/app/RouteError'
import type { RouteHandle } from '@/app/routeHandle'
import { dashboardItem, findGroupLabel, modules } from '@/app/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ModulePlaceholderPage } from '@/features/placeholder/ModulePlaceholderPage'
import { NotFoundPage } from '@/features/placeholder/NotFoundPage'

const handle = (title: string, ...crumbs: (string | undefined)[]): RouteHandle => ({
  title,
  crumbs: [...crumbs.filter((c): c is string => Boolean(c)), title],
})

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage />, handle: handle(dashboardItem.label, 'StockFlow') },
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
              path: 'componentes',
              lazy: async () => ({ Component: (await import('@/features/components-demo/ComponentsPage')).ComponentsPage }),
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
