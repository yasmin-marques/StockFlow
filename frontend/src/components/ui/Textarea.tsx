import type { Ref, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Field, type FieldOwnProps } from './Field'
import { useFieldIds } from './useFieldIds'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldOwnProps {
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ label, hint, error, required, id, className, ...rest }: TextareaProps) {
  const { controlId, describedBy } = useFieldIds(id, hint, error)
  return (
    <Field controlId={controlId} label={label} hint={hint} error={error} required={required}>
      <textarea
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
