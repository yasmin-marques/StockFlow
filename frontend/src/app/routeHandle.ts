export interface Crumb {
  label: string
  /** Sem `to`, o item é apenas texto (ex.: grupo sem página própria). */
  to?: string
}

/** Metadados de rota consumidos pela Topbar (título e breadcrumbs). */
export interface RouteHandle {
  title: string
  /** Trilha até a página atual; o último item é a própria página. */
  crumbs: Crumb[]
}
