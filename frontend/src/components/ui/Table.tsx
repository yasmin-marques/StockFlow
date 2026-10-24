import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import './data.css'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Legenda acessível da tabela (visível acima do cabeçalho). */
  caption?: string
  /** Em telas estreitas, cada linha vira um cartão (requer `label` nas células). */
  stackOnMobile?: boolean
}

/** Tabela semântica com rolagem horizontal em telas estreitas. Use <thead>/<tbody>/<tr> nativos com Th/Td. */
export function Table({ caption, stackOnMobile, className, children, ...rest }: TableProps) {
  return (
    <div className="sf-table-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className={cn('sf-table', stackOnMobile && 'sf-table--stack', className)} {...rest}>
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
  /** Rótulo da coluna, exibido no layout empilhado (mobile). */
  label?: string
}

export function Td({ align = 'start', label, ...rest }: TdProps) {
  return <td data-align={align} data-label={label} {...rest} />
}
