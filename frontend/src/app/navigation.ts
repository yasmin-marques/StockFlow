import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PackageSearch,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tags,
  Truck,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export interface ModuleItem extends NavItem {
  /** Entrega do roadmap em que o módulo passa a existir. */
  delivery: number
  summary: string
  planned: string[]
}

export interface NavGroup<T extends NavItem = NavItem> {
  label?: string
  items: T[]
}

export const dashboardItem: NavItem = { to: '/', label: 'Dashboard', icon: LayoutDashboard }

export const moduleGroups: NavGroup<ModuleItem>[] = [
  {
    label: 'Comercial',
    items: [
      {
        to: '/vendas',
        label: 'Vendas',
        icon: ShoppingCart,
        delivery: 4,
        summary: 'Pedidos de venda com reserva de estoque, confirmação, faturamento e cancelamento.',
        planned: [
          'Ciclo do pedido: rascunho, reservado, confirmado e faturado',
          'Reserva e liberação de estoque',
          'Devoluções',
        ],
      },
      {
        to: '/clientes',
        label: 'Clientes',
        icon: Users,
        delivery: 3,
        summary: 'Carteira de clientes e histórico de compras.',
        planned: ['Cadastro com documento e contatos', 'Histórico de pedidos', 'Status ativo, inativo e bloqueado'],
      },
    ],
  },
  {
    label: 'Estoque',
    items: [
      {
        to: '/produtos',
        label: 'Produtos',
        icon: Boxes,
        delivery: 3,
        summary: 'Catálogo de produtos com estoque físico, reservado e disponível.',
        planned: [
          'Cadastro com SKU, preço e estoque mínimo',
          'Categorias e fornecedores',
          'Visão de estoque por produto',
        ],
      },
      {
        to: '/movimentacoes',
        label: 'Movimentações',
        icon: ClipboardList,
        delivery: 4,
        summary: 'Registro rastreável de toda entrada, saída, ajuste, reserva e devolução.',
        planned: ['Entradas, saídas e ajustes', 'Referência ao pedido de origem', 'Controle de concorrência'],
      },
      {
        to: '/estoque-baixo',
        label: 'Estoque baixo',
        icon: PackageSearch,
        delivery: 4,
        summary: 'Produtos abaixo do estoque mínimo, com apoio à reposição.',
        planned: ['Alertas por gravidade', 'Sugestão de pedido de compra por fornecedor'],
      },
      {
        to: '/categorias',
        label: 'Categorias',
        icon: Tags,
        delivery: 3,
        summary: 'Organização do catálogo em categorias.',
        planned: ['Cadastro e edição', 'Estoque mínimo padrão por categoria'],
      },
    ],
  },
  {
    label: 'Compras',
    items: [
      {
        to: '/compras',
        label: 'Pedidos de compra',
        icon: Truck,
        delivery: 4,
        summary: 'Pedidos de compra junto a fornecedores e recebimento de mercadorias.',
        planned: [
          'Rascunho, solicitado, aprovado e recebido',
          'Recebimento parcial',
          'Entrada automática no estoque',
        ],
      },
      {
        to: '/fornecedores',
        label: 'Fornecedores',
        icon: Store,
        delivery: 3,
        summary: 'Cadastro dos fornecedores que abastecem o estoque.',
        planned: ['Cadastro com documento e contato', 'Produtos fornecidos'],
      },
    ],
  },
  {
    items: [
      {
        to: '/relatorios',
        label: 'Relatórios',
        icon: BarChart3,
        delivery: 5,
        summary: 'Relatórios gerenciais de vendas, estoque e compras.',
        planned: ['Filtros por período, categoria e vendedor', 'Exportação em CSV e PDF'],
      },
    ],
  },
  {
    label: 'Administração',
    items: [
      {
        to: '/usuarios',
        label: 'Usuários',
        icon: UserCog,
        delivery: 2,
        summary: 'Gestão de usuários e papéis de acesso.',
        planned: ['Autenticação JWT', 'Papéis: admin, gerente e vendedor', 'Convite e desativação de usuários'],
      },
      {
        to: '/auditoria',
        label: 'Auditoria',
        icon: ShieldCheck,
        delivery: 5,
        summary: 'Registro imutável das operações, com valores antes e depois.',
        planned: ['Quem, quando e o quê', 'Filtros por recurso e ação'],
      },
      {
        to: '/configuracoes',
        label: 'Configurações',
        icon: Settings,
        delivery: 2,
        summary: 'Dados da empresa e preferências do sistema.',
        planned: ['Dados da empresa', 'Numeração de pedidos'],
      },
    ],
  },
]

export const modules: ModuleItem[] = moduleGroups.flatMap((group) => group.items)

export function findGroupLabel(to: string): string | undefined {
  return moduleGroups.find((group) => group.items.some((item) => item.to === to))?.label
}
