import type { Ref, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Field, type FieldOwnProps } from './Field'
import { useFieldIds } from './useFieldIds'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldOwnProps {
  options: SelectOption[]
  /** Opção inicial sem valor, ex.: "Selecione…". */
  placeholder?: string
  ref?: Ref<HTMLSelectElement>
}

/** <select> nativo estilizado: teclado, leitores de tela e picker mobile funcionam sem JS extra. */
export function Select({
  label,
  hint,
  error,
  required,
  id,
  className,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  const { controlId, describedBy } = useFieldIds(id, hint, error)
  return (
    <Field controlId={controlId} label={label} hint={hint} error={error} required={required}>
      <select
        id={controlId}
        className={cn('sf-control', className)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}
