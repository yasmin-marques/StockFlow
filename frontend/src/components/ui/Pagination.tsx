import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import './data.css'

interface PaginationProps {
  /** Página atual, base 1. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** Texto de resumo opcional, ex.: "Mostrando 1–10 de 248". */
  summary?: string
}

/** Páginas visíveis: primeira, última e uma janela de 1 vizinho ao redor da atual. */
function visiblePages(page: number, pageCount: number): (number | 'gap')[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...wanted].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b)
  const result: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    const previous = sorted[i - 1]
    if (previous !== undefined && p - previous > 1) result.push('gap')
    result.push(p)
  })
  return result
}

export function Pagination({ page, pageCount, onPageChange, summary }: PaginationProps) {
  if (pageCount < 1) return null
  return (
    <nav className="sf-pagination" aria-label="Paginação">
      <span className="sf-pagination__summary" aria-live="polite">
        {summary ?? `Página ${page} de ${pageCount}`}
      </span>
      <ul className="sf-pagination__list">
        <li>
          <IconButton
            aria-label="Página anterior"
            icon={<ChevronLeft size={16} aria-hidden="true" />}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
        </li>
        {visiblePages(page, pageCount).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className="sf-pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className="sf-pagination__page"
                aria-label={`Página ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <IconButton
            aria-label="Próxima página"
            icon={<ChevronRight size={16} aria-hidden="true" />}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          />
        </li>
      </ul>
    </nav>
  )
}
