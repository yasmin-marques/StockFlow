/** Única fonte dos caminhos da aplicação: componentes e testes importam daqui, nunca usam strings soltas. */
export const ROUTES = {
  dashboard: '/',
  products: '/produtos',
  stock: '/estoque',
  movements: '/movimentacoes',
  sales: '/vendas',
  purchases: '/compras',
  customers: '/clientes',
  suppliers: '/fornecedores',
  categories: '/categorias',
  reports: '/relatorios',
  users: '/usuarios',
  audit: '/auditoria',
  settings: '/configuracoes',
  components: '/componentes',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
