import { Eye, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  IconButton,
  QueryBoundary,
  Skeleton,
  Table,
  Td,
  Th,
} from '@/components/ui'
import { formatCurrencyCents, formatDateTime } from '@/lib/format'
import { useRecentOrders } from '../hooks/useDashboardData'
import { ORDER_STATUS } from '../lib/labels'

export function RecentOrdersCard() {
  const query = useRecentOrders()
  return (
    <Card>
      <CardHeader title="Pedidos recentes" kicker="Últimas vendas" action={<Link to={ROUTES.sales}>Ver vendas</Link>} />
      <CardBody flush>
        <QueryBoundary
          query={query}
          loading={
            <div className="sf-skeleton-rows">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} variant="text" height={18} />
              ))}
            </div>
          }
          isEmpty={(orders) => orders.length === 0}
          empty={
            <EmptyState
              icon={<ReceiptText size={22} aria-hidden="true" />}
              title="Nenhum pedido ainda"
              description="Os pedidos de venda aparecerão aqui."
            />
          }
          errorTitle="Não foi possível carregar os pedidos"
        >
          {(orders) => (
            <Table caption="Pedidos de venda recentes" stackOnMobile>
              <thead>
                <tr>
                  <Th>Pedido</Th>
                  <Th>Cliente</Th>
                  <Th>Data</Th>
                  <Th align="end">Valor total</Th>
                  <Th>Status</Th>
                  <Th>
                    <span className="sf-visually-hidden">Detalhes</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = ORDER_STATUS[order.status]
                  return (
                    <tr key={order.id}>
                      <Td label="Pedido">
                        <strong>{order.number}</strong>
                      </Td>
                      <Td label="Cliente">{order.customerName}</Td>
                      <Td label="Data">{formatDateTime(order.createdAt)}</Td>
                      <Td align="end" label="Valor total">
                        {formatCurrencyCents(order.totalCents)}
                      </Td>
                      <Td label="Status">
                        <Badge tone={status.tone}>{status.label}</Badge>
                      </Td>
                      <Td>
                        {/* Habilitar quando o módulo de Vendas existir. */}
                        <IconButton
                          size="sm"
                          aria-label={`Ver detalhes do pedido ${order.number} (indisponível)`}
                          title="Disponível com o módulo de Vendas"
                          icon={<Eye size={16} aria-hidden="true" />}
                          disabled
                        />
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </QueryBoundary>
      </CardBody>
    </Card>
  )
}
