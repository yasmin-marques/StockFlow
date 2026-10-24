import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Providers } from '@/app/Providers'
import { createQueryClient } from '@/lib/queryClient'
import { createRouter } from '@/routes/router'
import '@/styles/index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root não encontrado')

createRoot(root).render(
  <StrictMode>
    <Providers client={createQueryClient()}>
      <RouterProvider router={createRouter()} />
    </Providers>
  </StrictMode>,
)
