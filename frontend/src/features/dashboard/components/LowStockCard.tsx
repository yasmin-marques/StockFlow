import { PackageCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Badge, Card, CardBody, CardHeader, EmptyState, QueryBoundary, Skeleton, Table, Td, Th } from '@/components/ui'
import { formatInteger } from '@/lib/format'
import { useLowStockAlerts } from '../hooks/useDashboardData'
import { STOCK_STATUS } from '../lib/labels'
import { stockStatus } from '../lib/metrics'

export function LowStockCard() {
  const query = useLowStockAlerts()
  return (
    <Card>
      <CardHeader
        title="Alertas de estoque"
        kicker="Posição atual · precisa de reposição"
        action={<Link to={ROUTES.stock}>Ver estoque</Link>}
      />
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
          isEmpty={(alerts) => alerts.length === 0}
          empty={
            <EmptyState
              icon={<PackageCheck size={22} aria-hidden="true" />}
              title="Tudo em ordem"
              description="Nenhum produto está abaixo do estoque mínimo."
            />
          }
          errorTitle="Não foi possível carregar os alertas"
        >
          {(alerts) => (
            <Table caption="Produtos abaixo do estoque mínimo" stackOnMobile>
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th>SKU</Th>
                  <Th align="end">Disponível</Th>
                  <Th align="end">Mínimo</Th>
                  <Th>Situação</Th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => {
                  const status = STOCK_STATUS[stockStatus(alert.available, alert.minimum)]
                  return (
                    <tr key={alert.productId}>
                      <Td label="Produto">{alert.name}</Td>
                      <Td label="SKU">
                        <span className="sf-product-sku">{alert.sku}</span>
                      </Td>
                      <Td align="end" label="Disponível">
                        {formatInteger(alert.available)}
                      </Td>
                      <Td align="end" label="Mínimo">
                        {formatInteger(alert.minimum)}
                      </Td>
                      <Td label="Situação">
                        <Badge tone={status.tone}>{status.label}</Badge>
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
