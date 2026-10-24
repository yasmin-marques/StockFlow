import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { ApiRequestError, toApiRequestError } from './errors'

function axiosErrorWith(response?: Partial<AxiosResponse>) {
  const error = new AxiosError('boom', 'ERR', undefined, undefined, response as AxiosResponse | undefined)
  return error
}

describe('toApiRequestError', () => {
  it('converte erro de rede em NETWORK_ERROR', () => {
    const result = toApiRequestError(axiosErrorWith())
    expect(result).toBeInstanceOf(ApiRequestError)
    expect(result.code).toBe('NETWORK_ERROR')
    expect(result.status).toBeNull()
  })

  it('preserva código, mensagem e violações devolvidos pela API', () => {
    const result = toApiRequestError(
      axiosErrorWith({
        status: 400,
        statusText: 'Bad Request',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
        data: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos.',
          violations: [{ field: 'name', message: 'obrigatório' }],
        },
      }),
    )

    expect(result.status).toBe(400)
    expect(result.code).toBe('VALIDATION_ERROR')
    expect(result.message).toBe('Dados inválidos.')
    expect(result.violations).toEqual([{ field: 'name', message: 'obrigatório' }])
  })

  it('não reencapsula um ApiRequestError', () => {
    const original = new ApiRequestError('x', 500, 'INTERNAL_ERROR')
    expect(toApiRequestError(original)).toBe(original)
  })

  it('trata erros desconhecidos', () => {
    expect(toApiRequestError('algo').code).toBe('UNKNOWN_ERROR')
  })
})
