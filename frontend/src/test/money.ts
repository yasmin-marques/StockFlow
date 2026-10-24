import { formatCurrencyCents } from '@/lib/format'

/** Intl separa "R$" do número com NBSP; Testing Library normaliza para espaço comum. */
export const money = (cents: number): string => formatCurrencyCents(cents).replace(/\u00a0/g, ' ')
