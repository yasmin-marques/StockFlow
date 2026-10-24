# Design system

## Origem

Referência: `StockFlow Design System.zip` (raiz do repositório), contendo o tema **Classical** (`_ds/classical-*/styles.css`, `readme.md`, `_ds_manifest.json`) e o protótipo `StockFlow.dc.html`. O protótipo usa o runtime proprietário (`support.js`, elementos `sc-*`, `DCLogic`), que **não** foi reutilizado: apenas tokens, medidas e padrões visuais foram extraídos e reimplementados em React + CSS.

Limitações do ZIP: o manifesto cita `theme.json`, `thumbnail.html`, páginas `components/*.html`, `foundations/*.html`, templates e `assets/photo.jpg`, que **não estão no arquivo**; `_ds_bundle.js` é praticamente vazio. Os tokens vêm do `styles.css`, e o comportamento visual dos componentes, do protótipo e do `readme.md`.

## Identidade

Tema exclusivamente claro: fundo `#f3f2f2`, texto `#201f1d`, dourado `#b68235` como único acento. Cormorant Garamond (títulos, 600 no máximo) sobre Lora (corpo). Cor aplicada como traço, não como preenchimento: botões e cards são vazados, com bordas hairline e sombras discretas. Ícones: Lucide.

## Tokens

Em `frontend/src/styles/tokens.css`:

- **Primitivos do tema** (copiados do ZIP): `--color-*` (neutral e accent 100–900), `--font-*`, `--space-*` (escala 1.15×), `--radius-sm/md/lg`, `--shadow-sm/md/lg`.
- **Semânticos** (`--sf-*`): superfícies, borda, texto, texto atenuado, acento para texto, anel de foco, estados hover/active, opacidade de desabilitado, overlay.
- **Status** `ok / warn / bad / info` (bg, fg, border), vindos das cores `oklch` do protótipo.
- **Movimento:** `--duration-fast/base`, `--ease-standard`; `prefers-reduced-motion` é respeitado.
- **Adaptações de produto do protótipo:** `--radius-control` 10px (botões e campos), `--radius-card` 12px, `--radius-pill` (badges).
- **Layout:** largura da sidebar, altura da topbar, largura máxima do conteúdo.

## Correções em relação ao ZIP

| Problema | Correção |
| --- | --- |
| Texto atenuado com `color-mix(text 55%)` não atinge contraste AA | `--sf-text-muted` = neutral-700 (≈ 5,6:1 sobre o fundo) |
| Accent `#b68235` tem só ~3:1 e era usado em texto (botão primário, links) | Bordas/ícones usam o accent; texto usa accent-700/900 (`--sf-accent-text`) |
| Raios divergentes entre o `readme` (4px) e o protótipo (10/12px/pílula) | Tokens explícitos `--radius-control/card/pill` |
| Estilos inline e `style-hover` do protótipo | Classes `sf-*` com `:hover/:active/:focus-visible` |
| Status só por cor (glifos ●▲✕◆○) | Badge com ícone Lucide distinto por tom |
| Foco removido sem substituto em alguns controles | Anel `:focus-visible` de 2px em todos os interativos |
| Placeholder, protótipo mostrava "Conectado · v1.8" e usuário fictício | Status real da API (`/api/v1/health`); perfil e busca marcados como indisponíveis |
| Fontes via `@import` do Google Fonts | Self-host com `@fontsource` (sem requisição a terceiros) |

Observação: Cormorant Garamond usa numerais *old-style*; é o comportamento do tema original (`"both faces keep their own figure style"`) e foi mantido, com `tabular-nums` nas tabelas e KPIs.

## Componentes (`frontend/src/components/ui`)

| Componente | Notas |
| --- | --- |
| `Button`, `IconButton` | Variantes `primary` (contorno dourado), `secondary`, `ghost`, `danger`; tamanhos `sm/md`; `loading`, `block`, `leadingIcon`. `IconButton` exige `aria-label`. |
| `Input`, `Textarea`, `Select` | Rótulo, dica, erro e `required`; `aria-describedby` e `aria-invalid` automáticos. Select nativo. |
| `Badge` | Tons `neutral, accent, ok, warn, bad, info`, sempre com ícone. |
| `Card`, `CardHeader`, `CardBody` | Kicker, título, ação; `elevated`; corpo `flush` para tabelas. |
| `Dialog`, `Drawer` | Radix: foco preso, Esc, foco devolvido à origem (`useFocusReturn`). Drawer à esquerda/direita; usado como menu no mobile. |
| `Tooltip` | Radix; hover e foco. |
| `Toast` | `ToastProvider` + `useToast()`; tons `ok, warn, bad, info`; região viva. |
| `Skeleton` | Decorativo; o contêiner indica `aria-busy`. |
| `EmptyState`, `ErrorState` | `ErrorState` usa `role="alert"` e botão de nova tentativa opcional. |
| `Table`, `Th`, `Td` | Legenda acessível, rolagem horizontal, alinhamento numérico à direita; `stackOnMobile` + `label` viram cartões abaixo de 640 px. |
| `QueryBoundary` | Loading, vazio, erro com retry e "atualizando" (`aria-busy`) para qualquer consulta. |
| `Popover` | Radix; usado nas notificações. |
| `Pagination` | `nav` rotulada, `aria-current`, janela de páginas com reticências. |

Exemplos de todas as variantes: rota `/componentes` (apenas `npm run dev`).

## Layout

Sidebar fixa de 248 px (recolhível para 68 px, com tooltips e rótulos para leitores de tela), topbar com breadcrumbs, título, busca, notificações e perfil. Abaixo de 960 px a sidebar vira um Drawer aberto pelo botão de menu; abaixo de 760 px a busca e o texto do perfil somem. Busca, notificações e perfil aparecem **desabilitados** e rotulados como indisponíveis.

## Validação visual

Screenshots de desktop (1440), tablet (820), mobile (390, via iframe) e da página de componentes foram inspecionados manualmente em Chrome headless. Não houve auditoria automatizada de acessibilidade (axe/Lighthouse); os contrastes citados foram calculados a partir dos tokens.
