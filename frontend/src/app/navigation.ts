import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Layers,
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
import { ROUTES } from './routes'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Termos extras para a busca global. */
  keywords?: string[]
}

/** Módulo ainda não implementado: alimenta a página de indisponibilidade temporária. */
export interface ModuleItem extends NavItem {
  summary: string
  planned: string[]
}

export interface NavGroup<T extends NavItem = NavItem> {
  label: string
  items: T[]
}

export const dashboardItem: NavItem = {
  to: ROUTES.dashboard,
  label: 'Dashboard',
  icon: LayoutDashboard,
  keywords: ['inicio', 'indicadores', 'resumo', 'visao geral'],
}

const modulesByGroup: NavGroup<ModuleItem>[] = [
  {
    label: 'Operações',
    items: [
      {
        to: ROUTES.products,
        label: 'Produtos',
        icon: Boxes,
        keywords: ['catalogo', 'sku', 'itens'],
        summary: 'Catálogo de produtos com preço, SKU e estoque mínimo.',
        planned: ['Cadastro e edição de produtos', 'Categorias e fornecedores', 'Situação de estoque por produto'],
      },
      {
        to: ROUTES.stock,
        label: 'Estoque',
        icon: PackageSearch,
        keywords: ['saldo', 'inventario', 'reposicao', 'estoque baixo', 'minimo'],
        summary: 'Posição de estoque físico, reservado e disponível, com alertas de reposição.',
        planned: ['Saldo físico, reservado e disponível', 'Alertas por gravidade', 'Apoio à reposição'],
      },
      {
        to: ROUTES.movements,
        label: 'Movimentações',
        icon: ClipboardList,
        keywords: ['entrada', 'saida', 'ajuste', 'historico'],
        summary: 'Registro rastreável de toda entrada, saída, ajuste, reserva e devolução.',
        planned: ['Entradas, saídas e ajustes', 'Referência ao pedido de origem', 'Controle de concorrência'],
      },
      {
        to: ROUTES.sales,
        label: 'Vendas',
        icon: ShoppingCart,
        keywords: ['pedidos de venda', 'faturamento', 'pedido'],
        summary: 'Pedidos de venda com reserva de estoque, confirmação, faturamento e cancelamento.',
        planned: ['Ciclo do pedido: rascunho, reservado, confirmado e faturado', 'Reserva e liberação de estoque', 'Devoluções'],
      },
      {
        to: ROUTES.purchases,
        label: 'Compras',
        icon: Truck,
        keywords: ['pedidos de compra', 'recebimento', 'pedido'],
        summary: 'Pedidos de compra junto a fornecedores e recebimento de mercadorias.',
        planned: ['Rascunho, solicitado, aprovado e recebido', 'Recebimento parcial', 'Entrada automática no estoque'],
      },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      {
        to: ROUTES.customers,
        label: 'Clientes',
        icon: Users,
        keywords: ['carteira', 'compradores'],
        summary: 'Carteira de clientes e histórico de compras.',
        planned: ['Cadastro com documento e contatos', 'Histórico de pedidos', 'Status ativo, inativo e bloqueado'],
      },
      {
        to: ROUTES.suppliers,
        label: 'Fornecedores',
        icon: Store,
        keywords: ['abastecimento'],
        summary: 'Cadastro dos fornecedores que abastecem o estoque.',
        planned: ['Cadastro com documento e contato', 'Produtos fornecidos'],
      },
      {
        to: ROUTES.categories,
        label: 'Categorias',
        icon: Tags,
        keywords: ['grupos', 'classificacao'],
        summary: 'Organização do catálogo em categorias.',
        planned: ['Cadastro e edição', 'Estoque mínimo padrão por categoria'],
      },
    ],
  },
  {
    label: 'Gestão',
    items: [
      {
        to: ROUTES.reports,
        label: 'Relatórios',
        icon: BarChart3,
        keywords: ['exportar', 'analise'],
        summary: 'Relatórios gerenciais de vendas, estoque e compras.',
        planned: ['Filtros por período, categoria e vendedor', 'Exportação em CSV e PDF'],
      },
      {
        to: ROUTES.users,
        label: 'Usuários',
        icon: UserCog,
        keywords: ['acesso', 'permissoes', 'papeis'],
        summary: 'Gestão de usuários e papéis de acesso.',
        planned: ['Autenticação', 'Papéis: admin, gerente e vendedor', 'Convite e desativação de usuários'],
      },
      {
        to: ROUTES.audit,
        label: 'Auditoria',
        icon: ShieldCheck,
        keywords: ['log', 'registro', 'historico'],
        summary: 'Registro imutável das operações, com valores antes e depois.',
        planned: ['Quem, quando e o quê', 'Filtros por recurso e ação'],
      },
      {
        to: ROUTES.settings,
        label: 'Configurações',
        icon: Settings,
        keywords: ['empresa', 'preferencias'],
        summary: 'Dados da empresa e preferências do sistema.',
        planned: ['Dados da empresa', 'Numeração de pedidos'],
      },
    ],
  },
]

/** Grupos da sidebar, na ordem de exibição. */
export const navigation: NavGroup[] = [{ label: 'Visão geral', items: [dashboardItem] }, ...modulesByGroup]

export const modules: ModuleItem[] = modulesByGroup.flatMap((group) => group.items)

export function findGroupLabel(to: string): string | undefined {
  return navigation.find((group) => group.items.some((item) => item.to === to))?.label
}

/** Item extra exibido só em desenvolvimento (catálogo do design system). */
export const componentsItem: NavItem = { to: ROUTES.components, label: 'Componentes (dev)', icon: Layers }
