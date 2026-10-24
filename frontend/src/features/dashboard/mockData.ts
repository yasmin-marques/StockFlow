/**
 * DADOS DEMONSTRATIVOS — nenhum destes números vem da API nem é calculado.
 * Servem apenas para validar o layout até o dashboard real (Entrega 5).
 */
import type { BadgeTone } from '@/components/ui'

export interface Kpi {
  label: string
  value: string
  delta: string
  tone: 'up' | 'down'
}

export const kpis: Kpi[] = [
  { label: 'Faturamento no mês', value: 'R$ 47.820', delta: '+12,4% vs. mês anterior', tone: 'up' },
  { label: 'Pedidos', value: '153', delta: '+8 vs. mês anterior', tone: 'up' },
  { label: 'Ticket médio', value: 'R$ 312', delta: '−2,1% vs. mês anterior', tone: 'down' },
  { label: 'Produtos com estoque baixo', value: '17', delta: '+5 novos esta semana', tone: 'down' },
]

/** Faturamento diário (R$ mil) — mês atual e mês anterior. */
export const revenueCurrent = [1.1, 1.4, 1.2, 1.8, 1.6, 2.1, 1.9, 2.4, 2.2, 2.0, 2.6, 2.9]
export const revenuePrevious = [1.0, 1.1, 1.3, 1.2, 1.5, 1.4, 1.7, 1.6, 1.9, 1.8, 2.0, 2.2]

export interface OrderStatusSummary {
  label: string
  count: number
  tone: BadgeTone
}

export const orderSummary: OrderStatusSummary[] = [
  { label: 'Rascunho', count: 6, tone: 'neutral' },
  { label: 'Reservado', count: 14, tone: 'info' },
  { label: 'Confirmado', count: 22, tone: 'accent' },
  { label: 'Faturado', count: 104, tone: 'ok' },
  { label: 'Cancelado', count: 7, tone: 'bad' },
]

export interface StockAlert {
  product: string
  available: number
  minimum: number
  level: 'Crítico' | 'Baixo' | 'Sem estoque'
}

export const stockAlerts: StockAlert[] = [
  { product: 'Café Premium 500g', available: 10, minimum: 12, level: 'Baixo' },
  { product: 'Papel A4 75g (resma)', available: 3, minimum: 20, level: 'Crítico' },
  { product: 'Detergente Neutro 5L', available: 0, minimum: 15, level: 'Sem estoque' },
  { product: 'Mouse sem fio', available: 4, minimum: 6, level: 'Baixo' },
]

export interface Activity {
  id: number
  text: string
  when: string
}

export const activities: Activity[] = [
  { id: 1, text: 'Venda #1240 confirmada', when: 'há 12 min' },
  { id: 2, text: 'Entrada de 40 un. de Café Premium (PC-0083)', when: 'há 1 h' },
  { id: 3, text: 'Preço de CAF-001 alterado', when: 'há 3 h' },
  { id: 4, text: 'Pedido de compra PC-0091 solicitado', when: 'ontem' },
  { id: 5, text: 'Ajuste de inventário em Papel A4', when: 'ontem' },
]
