import { http } from '@/lib/http'

export interface HealthResponse {
  status: 'UP' | 'DEGRADED'
  database: 'UP' | 'DOWN'
  timestamp: string
}

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await http.get<HealthResponse>('/api/v1/health')
  return data
}
