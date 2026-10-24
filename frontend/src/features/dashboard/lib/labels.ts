import { CircleCheck, CircleX, PackagePlus, SlidersHorizontal, Truck, type LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/components/ui'
import type { StockStatus } from './metrics'
import type { ActivityType, OrderStatus } from '../types'

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Rascunho', tone: 'neutral' },
  reserved: { label: 'Reservado', tone: 'info' },
  confirmed: { label: 'Confirmado', tone: 'accent' },
  invoiced: { label: 'Faturado', tone: 'ok' },
  cancelled: { label: 'Cancelado', tone: 'bad' },
}

export const STOCK_STATUS: Record<StockStatus, { label: string; tone: BadgeTone }> = {
  ok: { label: 'Normal', tone: 'ok' },
  low: { label: 'Baixo', tone: 'warn' },
  out: { label: 'Esgotado', tone: 'bad' },
}

export const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  stock_entry: PackagePlus,
  sale_confirmed: CircleCheck,
  order_cancelled: CircleX,
  stock_adjustment: SlidersHorizontal,
  purchase_received: Truck,
}
