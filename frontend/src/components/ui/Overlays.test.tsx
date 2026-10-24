import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { Drawer } from './Drawer'
import { ToastProvider } from './Toast'
import { useToast } from './toast-context'

function DialogHarness() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Confirmar"
        description="Tem certeza?"
        footer={<Button onClick={() => setOpen(false)}>Cancelar</Button>}
      />
    </>
  )
}

describe('Dialog', () => {
  it('abre com título e descrição acessíveis', async () => {
    render(<DialogHarness />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))

    const dialog = screen.getByRole('dialog', { name: 'Confirmar' })
    expect(dialog).toHaveAccessibleDescription('Tem certeza?')
  })

  it('fecha com Esc e devolve o foco ao gatilho', async () => {
    render(<DialogHarness />)
    const trigger = screen.getByRole('button', { name: 'Abrir' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('fecha pelo botão de ação', async () => {
    render(<DialogHarness />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Drawer', () => {
  it('renderiza conteúdo e fecha pelo botão Fechar', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="Painel">
        <p>Conteúdo</p>
      </Drawer>,
    )

    expect(screen.getByRole('dialog', { name: 'Painel' })).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

function ToastHarness() {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Salvo', description: 'Tudo certo', tone: 'ok' })}>Disparar</Button>
}

describe('Toast', () => {
  it('exibe a notificação disparada via useToast', async () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Disparar' }))

    expect(await screen.findByText('Salvo')).toBeInTheDocument()
    expect(screen.getByText('Tudo certo')).toBeInTheDocument()
  })

  it('useToast fora do provider falha de forma explícita', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<ToastHarness />)).toThrow(/ToastProvider/)
    spy.mockRestore()
  })
})
