import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import './form.css'

export interface FieldOwnProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
}

interface FieldProps extends FieldOwnProps {
  controlId: string
  children: ReactNode
}

export function Field({ controlId, label, hint, error, required, children }: FieldProps) {
  return (
    <div className="sf-field">
      <label className="sf-field__label" htmlFor={controlId}>
        {label}
        {required && (
          <span className="sf-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <span id={`${controlId}-hint`} className="sf-field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${controlId}-error`} className="sf-field__error" role="alert">
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  )
}
