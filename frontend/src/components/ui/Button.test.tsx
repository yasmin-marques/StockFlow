import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, IconButton } from './Button'

describe('Button', () => {
  it('chama onClick e usa type="button" por padrão', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toHaveAttribute('type', 'button')

    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não dispara onClick quando desabilitado', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('em loading fica desabilitado e sinaliza aria-busy', () => {
    render(<Button loading>Salvando</Button>)

    const button = screen.getByRole('button', { name: 'Salvando' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('aplica a classe da variante', () => {
    render(<Button variant="primary">Ok</Button>)
    expect(screen.getByRole('button')).toHaveClass('sf-btn--primary')
  })

  it('IconButton expõe o nome acessível', () => {
    render(<IconButton aria-label="Adicionar" icon={<span aria-hidden="true">+</span>} />)
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument()
  })
})
