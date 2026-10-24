/** Metadados de rota consumidos pela Topbar (título e breadcrumbs). */
export interface RouteHandle {
  title: string
  /** Trilha até a página atual, incluindo a própria página como último item. */
  crumbs: string[]
}
