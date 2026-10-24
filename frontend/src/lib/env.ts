import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('http://localhost:8080'),
  /** `mock`: dados demonstrativos locais (padrão até existirem endpoints). `api`: backend real, sem fallback. */
  VITE_DASHBOARD_SOURCE: z.enum(['mock', 'api']).default('mock'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Variáveis de ambiente inválidas: ${parsed.error.message}`)
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL.replace(/\/$/, ''),
  dashboardSource: parsed.data.VITE_DASHBOARD_SOURCE,
}
