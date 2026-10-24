import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationsMenu } from './NotificationsMenu'
import type { AppNotification } from './notifications'

const items: AppNotification[] = [
  { id: '1', title: 'Estoque baixo', description: 'Café', when: 'Hoje', read: false },
  { id: '2', title: 'Pedido cancelado', description: '#1236', when: 'Ontem', read: true },
]

describe('NotificationsMenu', () => {
  it('indica itens não lidos no botão e no painel', async () => {
    render(<NotificationsMenu initialItems={items} />)

    await userEvent.click(screen.getByRole('button', { name: 'Notificações, 1 não lidas' }))
    expect(screen.getByRole('dialog', { name: 'Notificações' })).toBeInTheDocument()
    expect(screen.getByText('Demonstrativo')).toBeInTheDocument()
    expect(screen.getByText('Estoque baixo').parentElement).toHaveTextContent('(não lida)')
  })

  it('marca todas como lidas', async () => {
    render(<NotificationsMenu initialItems={items} />)
    await userEvent.click(screen.getByRole('button', { name: /Notificações/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Marcar todas como lidas' }))

    expect(screen.getByRole('button', { name: 'Marcar todas como lidas' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument()
  })

  it('mostra o estado vazio após limpar', async () => {
    render(<NotificationsMenu initialItems={items} />)
    await userEvent.click(screen.getByRole('button', { name: /Notificações/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }))

    expect(screen.getByText('Nenhuma notificação')).toBeInTheDocument()
  })

  it('abre vazio quando não há registros e fecha com Esc', async () => {
    render(<NotificationsMenu initialItems={[]} />)
    await userEvent.click(screen.getByRole('button', { name: 'Notificações' }))
    expect(screen.getByText('Nenhuma notificação')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
