import type { InputHTMLAttributes, Ref } from 'react'
import { cn } from '@/lib/cn'
import { Field, type FieldOwnProps } from './Field'
import { useFieldIds } from './useFieldIds'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldOwnProps {
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, hint, error, required, id, className, ...rest }: InputProps) {
  const { controlId, describedBy } = useFieldIds(id, hint, error)
  return (
    <Field controlId={controlId} label={label} hint={hint} error={error} required={required}>
      <input
        id={controlId}
        className={cn('sf-control', className)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    </Field>
  )
}
