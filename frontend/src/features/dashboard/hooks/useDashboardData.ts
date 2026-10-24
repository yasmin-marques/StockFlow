import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Period } from '@/lib/period'
import { dashboardSource } from '../services'

/*
 * Uma query por seção: cada bloco carrega, falha e se recupera de forma independente.
 * Queries dependentes do período usam `keepPreviousData` — ao trocar o filtro, os dados
 * anteriores continuam visíveis (marcados como "atualizando") em vez de piscar um skeleton.
 */
const periodKey = (period: Period) => [period.from, period.to] as const

export const useDashboardSummary = (period: Period) =>
  useQuery({
    queryKey: ['dashboard', 'summary', ...periodKey(period)],
    queryFn: () => dashboardSource.getSummary(period),
    placeholderData: keepPreviousData,
  })

export const useRevenueSeries = (period: Period) =>
  useQuery({
    queryKey: ['dashboard', 'revenue', ...periodKey(period)],
    queryFn: () => dashboardSource.getRevenueSeries(period),
    placeholderData: keepPreviousData,
  })

export const useSalesSeries = (period: Period) =>
  useQuery({
    queryKey: ['dashboard', 'sales', ...periodKey(period)],
    queryFn: () => dashboardSource.getSalesSeries(period),
    placeholderData: keepPreviousData,
  })

export const useTopProducts = (period: Period) =>
  useQuery({
    queryKey: ['dashboard', 'top-products', ...periodKey(period)],
    queryFn: () => dashboardSource.getTopProducts(period),
    placeholderData: keepPreviousData,
  })

export const useLowStockAlerts = () =>
  useQuery({ queryKey: ['dashboard', 'low-stock'], queryFn: () => dashboardSource.getLowStockAlerts() })

export const useRecentOrders = () =>
  useQuery({ queryKey: ['dashboard', 'recent-orders'], queryFn: () => dashboardSource.getRecentOrders() })

export const useRecentActivities = () =>
  useQuery({ queryKey: ['dashboard', 'recent-activities'], queryFn: () => dashboardSource.getRecentActivities() })
