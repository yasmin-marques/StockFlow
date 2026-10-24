import { ROUTES } from '@/app/routes'
import { normalize, searchEntries, searchPages } from './searchPages'

describe('searchPages', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(normalize('  Relatórios ')).toBe('relatorios')
    expect(searchPages('RELATORIOS').map((e) => e.to)).toEqual([ROUTES.reports])
  })

  it('sem termo devolve todas as páginas na ordem da navegação', () => {
    expect(searchPages('')).toEqual(searchEntries)
    expect(searchEntries[0]?.to).toBe(ROUTES.dashboard)
  })

  it('prioriza rótulo que começa com o termo', () => {
    expect(searchPages('p')[0]?.label).toBe('Produtos')
  })

  it('encontra por palavra-chave e por grupo', () => {
    expect(searchPages('inventario').map((e) => e.to)).toContain(ROUTES.stock)
    expect(searchPages('cadastros').map((e) => e.label)).toEqual(['Clientes', 'Fornecedores', 'Categorias'])
  })

  it('retorna vazio quando nada casa', () => {
    expect(searchPages('zzzz')).toEqual([])
  })

  it('só o Dashboard está disponível; módulos futuros são marcados', () => {
    expect(searchEntries.filter((e) => e.available).map((e) => e.to)).toEqual([ROUTES.dashboard])
  })
})
