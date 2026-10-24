# Dashboard comercial

## Origem dos dados

| Seção | Origem hoje | Depende do período? |
| --- | --- | --- |
| Faturamento, vendas, ticket médio | **Demonstrativa** (`mocks/demoData.ts`) | Sim |
| Produtos ativos, estoque abaixo do mínimo, pedidos pendentes | **Demonstrativa** | Não — posição atual |
| Gráficos de faturamento e vendas | **Demonstrativa** (somam exatamente os totais do resumo) | Sim |
| Produtos mais vendidos | **Demonstrativa** | Sim |
| Alertas de estoque, pedidos recentes, atividades | **Demonstrativa** | Não |
| Notificações (painel da topbar) | **Demonstrativa** (`features/notifications`) | Não |
| Status da API (rodapé da sidebar) | **Real** (`GET /api/v1/health`) | — |

Os dados demonstrativos são determinísticos (função pura da data; nenhum `Math.random`), ficam isolados em `features/dashboard/mocks` e a interface avisa quando estão ativos ("Dados demonstrativos"). `VITE_DASHBOARD_SOURCE=api` troca para a fonte HTTP; **falhas da API nunca caem em mock** — o bloco mostra o estado de erro com "Tentar novamente".

## Período

Datas são dias civis `AAAA-MM-DD` no fuso `America/Sao_Paulo`; ambos os limites são **inclusivos**. Presets: `today`, `7d`, `30d` (padrão), `month`, `custom` (máx. 366 dias, sem datas futuras, início ≤ fim). A URL guarda o filtro: `?periodo=7d` ou `?periodo=custom&de=2026-10-01&ate=2026-10-20`; parâmetros inválidos voltam ao padrão com aviso. O período anterior tem a mesma duração e termina na véspera; a variação % só aparece quando ele existe e é maior que zero.

Granularidade das séries: 1 dia → `hour`; até 31 dias → `day`; até 180 → `week` (semanas ISO, bucket = segunda-feira); acima → `month`.

## Contrato HTTP previsto (ainda não implementado no backend)

Valores monetários em **centavos inteiros**; instantes em ISO-8601 com offset. Tipos em `features/dashboard/types/index.ts`.

| Método e caminho | Parâmetros | Resposta |
| --- | --- | --- |
| `GET /api/v1/dashboard/summary` | `from`, `to` | `DashboardSummary` |
| `GET /api/v1/dashboard/revenue` | `from`, `to`, `granularity` | `RevenueSeries` |
| `GET /api/v1/dashboard/sales` | `from`, `to`, `granularity` | `SalesSeries` |
| `GET /api/v1/dashboard/top-products` | `from`, `to`, `limit` | `TopSellingProducts` |
| `GET /api/v1/dashboard/low-stock` | — | `LowStockAlert[]` |
| `GET /api/v1/dashboard/recent-orders` | `limit` | `RecentOrder[]` |
| `GET /api/v1/dashboard/recent-activities` | `limit` | `RecentActivity[]` |

```ts
DashboardSummary   { revenueCents, salesCount, activeProducts, lowStockCount, pendingOrders,
                     previous: { revenueCents, salesCount } | null }
RevenueSeries      { granularity, points: { bucket, revenueCents }[] }
SalesSeries        { granularity, points: { bucket, salesCount }[] }
TopSellingProducts { totalUnits, items: { productId, name, sku, quantity, revenueCents }[] }
LowStockAlert      { productId, name, sku, available, minimum }
RecentOrder        { id, number, customerName, createdAt, totalCents, status }
RecentActivity     { id, type, message, occurredAt }
```

`bucket`: `AAAA-MM-DDTHH:00` (hour), `AAAA-MM-DD` (day), segunda-feira da semana (week) ou dia 1 do mês (month); em semanas/meses parciais nas pontas, o primeiro bucket começa em `from`. `OrderStatus`: `draft | reserved | confirmed | invoiced | cancelled`. `ActivityType`: `stock_entry | sale_confirmed | order_cancelled | stock_adjustment | purchase_received`.

Regras de apresentação (não do backend): ticket médio = `round(revenueCents / salesCount)` (`null` sem vendas); situação do estoque: `available ≤ 0` esgotado, `available < minimum` baixo, senão normal; participação = `quantity / totalUnits`; "pendente" = rascunho, reservado ou confirmado.

## Organização

```text
features/dashboard/
  types/      contratos
  mocks/      dados demonstrativos (únicos valores comerciais do front)
  services/   DashboardDataSource: mock | api
  hooks/      TanStack Query (uma query por seção) e filtro de período na URL
  lib/        métricas puras, rótulos de status
  components/ KPIs, gráficos (Recharts, lazy), tabelas, filtro
  pages/      DashboardPage
```

Gráficos: **Recharts** — biblioteca consolidada em React, declarativa, com `ResponsiveContainer`, tooltips e eixos prontos; é carregada sob demanda (`React.lazy`) e não entra no bundle inicial. Animações respeitam `prefers-reduced-motion`.
