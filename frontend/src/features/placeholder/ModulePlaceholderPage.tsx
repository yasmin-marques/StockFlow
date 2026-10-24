import { Hammer } from 'lucide-react'
import type { ModuleItem } from '@/app/navigation'
import { Badge, Card, CardBody, CardHeader, EmptyState } from '@/components/ui'

/** Página provisória de módulo ainda não implementado — sem formulários nem dados simulados. */
export function ModulePlaceholderPage({ module }: { module: ModuleItem }) {
  return (
    <div className="sf-page sf-placeholder">
      <Card>
        <CardHeader title={module.label} kicker="Módulo previsto" action={<Badge tone="info">Em breve</Badge>} />
        <CardBody>
          <p>{module.summary}</p>
          <h2 className="sf-placeholder__heading">Escopo previsto</h2>
          <ul className="sf-placeholder__list">
            {module.planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardBody>
      </Card>
      <Card>
        <EmptyState
          icon={<Hammer size={22} aria-hidden="true" />}
          title="Módulo temporariamente indisponível"
          description="Este módulo ainda não foi implementado. Nenhum dado é exibido ou simulado."
        />
      </Card>
    </div>
  )
}
