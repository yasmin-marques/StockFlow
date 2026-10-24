import { FlaskConical } from 'lucide-react'

/** Aviso exibido enquanto a fonte de dados do dashboard é demonstrativa. */
export function DemoDataNotice() {
  return (
    <aside className="sf-demo-notice" aria-label="Aviso sobre dados demonstrativos">
      <FlaskConical size={18} aria-hidden="true" />
      <p>
        <strong>Dados demonstrativos.</strong> Os números abaixo são fictícios e determinísticos; o dashboard será
        conectado às vendas e ao estoque reais quando esses módulos existirem.
      </p>
    </aside>
  )
}
