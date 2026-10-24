import { Trophy } from 'lucide-react'
import { Card, CardBody, CardHeader, EmptyState, QueryBoundary, Skeleton, Table, Td, Th } from '@/components/ui'
import { formatCurrencyCents, formatInteger, formatPercent } from '@/lib/format'
import type { Period } from '@/lib/period'
import { useTopProducts } from '../hooks/useDashboardData'
import { sharePercent } from '../lib/metrics'

export function TopProductsCard({ period }: { period: Period }) {
  const query = useTopProducts(period)
  return (
    <Card>
      <CardHeader
        title="Produtos mais vendidos"
        kicker={query.data ? `${formatInteger(query.data.totalUnits)} un. vendidas no período` : 'No período'}
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
          isEmpty={(data) => data.items.length === 0 || data.totalUnits === 0}
          empty={
            <EmptyState
              icon={<Trophy size={22} aria-hidden="true" />}
              title="Nenhuma venda no período"
              description="O ranking aparece quando houver vendas no intervalo selecionado."
            />
          }
          errorTitle="Não foi possível carregar o ranking"
        >
          {({ items, totalUnits }) => (
            <Table caption="Produtos mais vendidos no período" stackOnMobile>
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th align="end">Quantidade (un.)</Th>
                  <Th align="end">Participação</Th>
                  <Th align="end">Valor (R$)</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const share = sharePercent(item.quantity, totalUnits)
                  return (
                    <tr key={item.productId}>
                      <Td label="Produto">
                        <span className="sf-rank">{index + 1}</span>
                        <span className="sf-product-cell">
                          <span className="sf-product-name">{item.name}</span>
                          <span className="sf-product-sku">{item.sku}</span>
                        </span>
                      </Td>
                      <Td align="end" label="Quantidade (un.)">
                        {formatInteger(item.quantity)}
                      </Td>
                      <Td align="end" label="Participação">
                        {share === null ? '—' : formatPercent(share)}
                      </Td>
                      <Td align="end" label="Valor (R$)">
                        {formatCurrencyCents(item.revenueCents)}
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
