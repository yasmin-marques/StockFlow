import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'

describe('campos de formulário', () => {
  it('associa o rótulo ao input e aceita digitação', async () => {
    render(<Input label="Nome" />)

    const input = screen.getByLabelText('Nome')
    await userEvent.type(input, 'Café')
    expect(input).toHaveValue('Café')
  })

  it('liga dica e erro via aria-describedby e marca aria-invalid', () => {
    render(<Input label="SKU" hint="Código único" error="Obrigatório" />)

    const input = screen.getByLabelText('SKU')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Código único Obrigatório')
    expect(screen.getByRole('alert')).toHaveTextContent('Obrigatório')
  })

  it('não marca inválido sem erro', () => {
    render(<Input label="Nome" />)
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid')
  })

  it('Textarea e Select seguem o mesmo contrato', async () => {
    render(
      <>
        <Textarea label="Observações" />
        <Select
          label="Categoria"
          placeholder="Selecione…"
          options={[
            { value: 'a', label: 'Alimentos' },
            { value: 'b', label: 'Limpeza' },
          ]}
        />
      </>,
    )

    await userEvent.type(screen.getByLabelText('Observações'), 'texto')
    await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'b')

    expect(screen.getByLabelText('Observações')).toHaveValue('texto')
    expect(screen.getByLabelText('Categoria')).toHaveValue('b')
  })

  it('campo desabilitado não aceita digitação', async () => {
    render(<Input label="Nome" disabled />)
    const input = screen.getByLabelText('Nome')
    await userEvent.type(input, 'x')
    expect(input).toHaveValue('')
  })
})
