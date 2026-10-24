import { isAxiosError } from 'axios'

export interface FieldViolation {
  field: string
  message: string
}

/** Erro padronizado da API (espelha com.stockflow.shared.error.ApiError). */
export class ApiRequestError extends Error {
  readonly status: number | null
  readonly code: string
  readonly violations: FieldViolation[]

  constructor(message: string, status: number | null, code: string, violations: FieldViolation[] = []) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.violations = violations
  }
}

interface ApiErrorBody {
  code?: string
  message?: string
  violations?: FieldViolation[]
}

export function toApiRequestError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) return error

  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return new ApiRequestError('Não foi possível conectar ao servidor.', null, 'NETWORK_ERROR')
    }
    const { status, data } = error.response
    return new ApiRequestError(
      data?.message ?? 'Erro inesperado ao processar a requisição.',
      status,
      data?.code ?? 'UNKNOWN_ERROR',
      data?.violations ?? [],
    )
  }

  return new ApiRequestError('Erro inesperado.', null, 'UNKNOWN_ERROR')
}
