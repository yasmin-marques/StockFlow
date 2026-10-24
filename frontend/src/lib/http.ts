import axios from 'axios'
import { env } from './env'
import { toApiRequestError } from './errors'

/** Cliente HTTP único da aplicação; erros chegam normalizados como ApiRequestError. */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiRequestError(error)),
)
