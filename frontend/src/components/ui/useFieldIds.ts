import { useId } from 'react'

interface FieldIds {
  controlId: string
  describedBy: string | undefined
}

/** Liga rótulo, dica e erro ao controle via aria-describedby. */
export function useFieldIds(id: string | undefined, hint?: string, error?: string): FieldIds {
  const generated = useId()
  const controlId = id ?? generated
  const ids = [hint && `${controlId}-hint`, error && `${controlId}-error`].filter(Boolean)
  return { controlId, describedBy: ids.length ? ids.join(' ') : undefined }
}
