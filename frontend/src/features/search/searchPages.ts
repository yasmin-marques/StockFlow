import { navigation, type NavItem } from '@/app/navigation'
import { ROUTES } from '@/app/routes'

export interface SearchEntry extends NavItem {
  group: string
  /** `false` para módulos ainda não implementados (a busca os mostra como "Em breve"). */
  available: boolean
}

/** Minúsculas e sem acentos: "relatórios" casa com "relatorios". */
export const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

/** Índice de páginas e módulos, derivado da navegação (fonte única). */
export const searchEntries: SearchEntry[] = navigation.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label, available: item.to === ROUTES.dashboard })),
)

/**
 * Pesquisa páginas e módulos. Ordem: rótulo começa com o termo, rótulo contém o termo,
 * grupo/palavras-chave contêm o termo. Sem termo, devolve todas na ordem da navegação.
 * (Produtos, clientes e pedidos serão adicionados quando seus módulos existirem.)
 */
export function searchPages(query: string, entries: SearchEntry[] = searchEntries): SearchEntry[] {
  const term = normalize(query)
  if (!term) return entries

  const scored = entries.flatMap((entry) => {
    const label = normalize(entry.label)
    const extras = [entry.group, ...(entry.keywords ?? [])].map(normalize)
    if (label.startsWith(term)) return [{ entry, score: 0 }]
    if (label.includes(term)) return [{ entry, score: 1 }]
    if (extras.some((extra) => extra.includes(term))) return [{ entry, score: 2 }]
    return []
  })
  return scored.sort((a, b) => a.score - b.score).map(({ entry }) => entry)
}
