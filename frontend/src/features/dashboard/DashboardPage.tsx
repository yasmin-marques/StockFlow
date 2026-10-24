import { Link } from 'react-router-dom'
import { Badge, Card, CardBody, CardHeader, Table, Td, Th, type BadgeTone } from '@/components/ui'
import { activities, kpis, orderSummary, revenueCurrent, revenuePrevious, stockAlerts, type StockAlert } from './mockData'
import { SalesChart } from './SalesChart'
import './dashboard.css'

const alertTone: Record<StockAlert['level'], BadgeTone> = {
  Baixo: 'warn',
  Crítico: 'bad',
  'Sem estoque': 'bad',
}

export function DashboardPage() {
  return (
    <div className="sf-page">
      <div className="sf-page__intro">
        <p>Visão geral da operação.</p>
        <Badge tone="warn">Dados demonstrativos (mock)</Badge>
      </div>

      <section className="sf-grid sf-grid--kpis" aria-label="Indicadores">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="sf-kpi">
            <div className="sf-kpi__label">{kpi.label}</div>
            <div className="sf-kpi__value">{kpi.value}</div>
            <div className={`sf-kpi__delta sf-kpi__delta--${kpi.tone}`}>
              {kpi.tone === 'up' ? '▲' : '▼'} {kpi.delta}
            </div>
          </Card>
        ))}
      </section>

      <div className="sf-grid sf-grid--wide-left">
        <Card>
          <CardHeader title="Vendas ao longo do tempo" kicker="Faturamento · R$ mil / dia" />
          <CardBody>
            <SalesChart current={revenueCurrent} previous={revenuePrevious} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Resumo de pedidos" kicker="Por status" />
          <CardBody>
            <ul className="sf-status-list">
              {orderSummary.map((status) => (
                <li key={status.label}>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <strong>{status.count}</strong>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="sf-grid sf-grid--two">
        <Card>
          <CardHeader
            title="Alerta de estoque"
            kicker="Atenção necessária"
            action={<Link to="/estoque-baixo">Ver todos</Link>}
          />
          <CardBody flush>
            <Table caption="Produtos abaixo do estoque mínimo (dados demonstrativos)">
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th align="end">Disponível</Th>
                  <Th align="end">Mínimo</Th>
                  <Th>Situação</Th>
                </tr>
              </thead>
              <tbody>
                {stockAlerts.map((alert) => (
                  <tr key={alert.product}>
                    <Td>{alert.product}</Td>
                    <Td align="end">{alert.available}</Td>
                    <Td align="end">{alert.minimum}</Td>
                    <Td>
                      <Badge tone={alertTone[alert.level]}>{alert.level}</Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Atividades recentes" kicker="Últimas operações" />
          <CardBody>
            <ul className="sf-activity">
              {activities.map((activity) => (
                <li key={activity.id}>
                  <span>{activity.text}</span>
                  <time>{activity.when}</time>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
