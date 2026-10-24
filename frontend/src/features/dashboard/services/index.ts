import { env } from '@/lib/env'
import { apiDashboardSource } from './apiDashboardSource'
import type { DashboardDataSource } from './dashboardSource'
import { createMockDashboardSource } from './mockDashboardSource'

const MOCK_LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 250

/** Fonte ativa, escolhida por VITE_DASHBOARD_SOURCE (padrão: dados demonstrativos). */
export const dashboardSource: DashboardDataSource =
  env.dashboardSource === 'api' ? apiDashboardSource : createMockDashboardSource({ delayMs: MOCK_LATENCY_MS })

export type { DashboardDataSource } from './dashboardSource'
