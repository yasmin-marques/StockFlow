import { QueryClient } from '@tanstack/react-query'
import { ApiRequestError } from './errors'

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Erros 4xx não melhoram com nova tentativa.
          if (error instanceof ApiRequestError && error.status !== null && error.status < 500) return false
          return failureCount < 2
        },
      },
    },
  })
}
