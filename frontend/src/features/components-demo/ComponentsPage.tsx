import { Plus, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  Drawer,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  Pagination,
  Select,
  Skeleton,
  Table,
  Td,
  Textarea,
  Th,
  Tooltip,
  useToast,
  type BadgeTone,
} from '@/components/ui'
import './components-demo.css'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody>{children}</CardBody>
    </Card>
  )
}

const tones: BadgeTone[] = ['neutral', 'accent', 'ok', 'warn', 'bad', 'info']
const toneLabel: Record<BadgeTone, string> = {
  neutral: 'Neutro',
  accent: 'Destaque',
  ok: 'Concluído',
  warn: 'Atenção',
  bad: 'Crítico',
  info: 'Informativo',
}

export function ComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(3)
  const { toast } = useToast()

  return (
    <div className="sf-page">
      <p className="sf-muted">
        Catálogo interno do design system. Disponível apenas em desenvolvimento (<code>npm run dev</code>).
      </p>

      <Section title="Button">
        <div className="sf-demo-row">
          <Button variant="primary">Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" leadingIcon={<Trash2 size={16} aria-hidden="true" />}>
            Excluir
          </Button>
          <Button variant="primary" loading>
            Salvando
          </Button>
          <Button variant="primary" disabled>
            Desabilitado
          </Button>
          <Button variant="primary" size="sm">
            Pequeno
          </Button>
          <IconButton variant="secondary" aria-label="Adicionar" icon={<Plus size={18} aria-hidden="true" />} />
        </div>
      </Section>

      <Section title="Input, Textarea e Select">
        <div className="sf-demo-form">
          <Input label="Nome do produto" placeholder="Ex.: Café Premium" hint="Aparece nos pedidos e relatórios." />
          <Input label="SKU" required defaultValue="CAF" error="O SKU deve ter ao menos 6 caracteres." />
          <Input label="Campo desabilitado" disabled defaultValue="Somente leitura" />
          <Select
            label="Categoria"
            placeholder="Selecione…"
            options={[
              { value: 'alimentos', label: 'Alimentos' },
              { value: 'informatica', label: 'Informática' },
              { value: 'limpeza', label: 'Limpeza' },
            ]}
          />
          <Textarea label="Observações" placeholder="Informações adicionais" />
        </div>
      </Section>

      <Section title="Badge">
        <div className="sf-demo-row">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {toneLabel[tone]}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Card">
        <div className="sf-grid sf-grid--two">
          <Card>
            <CardHeader title="Card simples" kicker="Kicker" />
            <CardBody>Superfície com borda hairline e raio de 12px.</CardBody>
          </Card>
          <Card elevated>
            <CardHeader title="Card elevado" action={<Badge tone="info">Ação</Badge>} />
            <CardBody>Sombra média, usada com moderação.</CardBody>
          </Card>
        </div>
      </Section>

      <Section title="Dialog, Drawer, Tooltip e Toast">
        <div className="sf-demo-row">
          <Button onClick={() => setDialogOpen(true)}>Abrir dialog</Button>
          <Button onClick={() => setDrawerOpen(true)}>Abrir drawer</Button>
          <Tooltip content="Dica contextual acessível por foco e hover">
            <Button variant="ghost">Passe o mouse</Button>
          </Tooltip>
          <Button onClick={() => toast({ title: 'Operação concluída', description: 'Exemplo de toast.', tone: 'ok' })}>
            Toast de sucesso
          </Button>
          <Button onClick={() => toast({ title: 'Falha ao salvar', description: 'Exemplo de erro.', tone: 'bad' })}>
            Toast de erro
          </Button>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Confirmar ação"
          description="Exemplo de modal: foco preso, Esc fecha e o foco volta ao botão de origem."
          footer={
            <>
              <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => setDialogOpen(false)}>
                Confirmar
              </Button>
            </>
          }
        />
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title="Painel lateral"
          description="Útil para formulários rápidos sem sair da página."
          footer={<Button variant="primary" onClick={() => setDrawerOpen(false)}>Concluir</Button>}
        >
          <Input label="Campo de exemplo" />
        </Drawer>
      </Section>

      <Section title="Skeleton, EmptyState e ErrorState">
        <div className="sf-grid sf-grid--two">
          <div aria-busy="true" className="sf-demo-skeletons">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="block" height={64} />
          </div>
          <Card>
            <EmptyState title="Nenhum produto" description="Cadastre o primeiro produto." action={<Button variant="primary">Novo produto</Button>} />
          </Card>
          <Card>
            <ErrorState onRetry={() => toast({ title: 'Tentando novamente…', tone: 'info' })} />
          </Card>
        </div>
      </Section>

      <Section title="Table e Pagination">
        <Card>
          <CardBody flush>
            <Table caption="Exemplo de tabela">
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th align="end">Quantidade</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>Café Premium</Td>
                  <Td align="end">120</Td>
                  <Td>
                    <Badge tone="ok">Ativo</Badge>
                  </Td>
                </tr>
                <tr>
                  <Td>Papel A4</Td>
                  <Td align="end">3</Td>
                  <Td>
                    <Badge tone="bad">Crítico</Badge>
                  </Td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <div className="sf-demo-pagination">
          <Pagination page={page} pageCount={12} onPageChange={setPage} summary={`Página ${page} de 12`} />
        </div>
      </Section>
    </div>
  )
}
