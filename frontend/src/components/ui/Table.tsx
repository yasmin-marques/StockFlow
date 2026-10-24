import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import './data.css'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Legenda acessível da tabela (visível acima do cabeçalho). */
  caption?: string
}

/** Tabela semântica com rolagem horizontal em telas estreitas. Use <thead>/<tbody>/<tr> nativos com Th/Td. */
export function Table({ caption, className, children, ...rest }: TableProps) {
  return (
    <div className="sf-table-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className={cn('sf-table', className)} {...rest}>
        {caption && <caption className="sf-visually-hidden">{caption}</caption>}
        {children}
      </table>
    </div>
  )
}

interface ThProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'start' | 'end'
}

export function Th({ align = 'start', scope = 'col', ...rest }: ThProps) {
  return <th scope={scope} data-align={align} {...rest} />
}

interface TdProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'start' | 'end'
}

export function Td({ align = 'start', ...rest }: TdProps) {
  return <td data-align={align} {...rest} />
}
