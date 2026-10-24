import { History } from 'lucide-react'
import { Badge, Card, CardBody, CardHeader, EmptyState, QueryBoundary, Skeleton } from '@/components/ui'
import { formatDateTime } from '@/lib/format'
import { useRecentActivities } from '../hooks/useDashboardData'
import { ACTIVITY_ICON } from '../lib/labels'
import { dashboardSource } from '../services'

export function RecentActivitiesCard() {
  const query = useRecentActivities()
  return (
    <Card>
      <CardHeader
        title="Atividades recentes"
        kicker="Linha do tempo"
        action={dashboardSource.isDemo ? <Badge tone="warn">Demonstrativo</Badge> : undefined}
      />
      <CardBody>
        <QueryBoundary
          query={query}
          loading={
            <div className="sf-skeleton-rows">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} variant="text" height={18} />
              ))}
            </div>
          }
          isEmpty={(activities) => activities.length === 0}
          empty={
            <EmptyState
              icon={<History size={22} aria-hidden="true" />}
              title="Sem atividades"
              description="As operações recentes aparecerão aqui."
            />
          }
          errorTitle="Não foi possível carregar as atividades"
        >
          {(activities) => (
            <ol className="sf-timeline">
              {activities.map((activity) => {
                const Icon = ACTIVITY_ICON[activity.type]
                return (
                  <li key={activity.id}>
                    <span className="sf-timeline__icon">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <div>
                      <div>{activity.message}</div>
                      <time className="sf-timeline__time" dateTime={activity.occurredAt}>
                        {formatDateTime(activity.occurredAt)}
                      </time>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </QueryBoundary>
      </CardBody>
    </Card>
  )
}
