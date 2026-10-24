import { QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { Providers } from '@/app/Providers'
import { createTestRouter } from '@/routes/router'

/** Renderiza a aplicação inteira numa rota, com cache limpo e sem retentativas. */
export function renderApp(path = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  const router = createTestRouter([path])
  const utils = render(
    <Providers client={client}>
      <RouterProvider router={router} />
    </Providers>,
  )
  return { ...utils, router, client }
}
