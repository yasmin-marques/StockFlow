import * as RadixDialog from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/cn'
import { searchPages } from './searchPages'
import './search.css'

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/** Busca global: abre por clique, "/" ou Ctrl/⌘+K; navega por teclado; Esc fecha. */
export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const listId = useId()

  const results = useMemo(() => searchPages(query), [query])
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0))

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
      if (isShortcut || (event.key === '/' && !isTypingTarget(event.target) && !event.ctrlKey && !event.metaKey)) {
        event.preventDefault()
        setOpen((current) => (isShortcut ? !current : true))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setQuery('')
      setActive(0)
    }
  }

  function go(to: string) {
    handleOpenChange(false)
    void navigate(to)
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((activeIndex + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((activeIndex - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const entry = results[activeIndex]
      if (entry) go(entry.to)
    }
  }

  const optionId = (index: number) => `${listId}-option-${index}`

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      <RadixDialog.Trigger asChild>
        <button type="button" className="sf-search-trigger" aria-label="Abrir busca global" aria-keyshortcuts="/ Control+K">
          <Search size={16} aria-hidden="true" />
          <span className="sf-search-trigger__text">Buscar páginas e módulos…</span>
          <kbd aria-hidden="true">/</kbd>
        </button>
      </RadixDialog.Trigger>

      <RadixDialog.Portal>
        <RadixDialog.Overlay className="sf-overlay" />
        <RadixDialog.Content className="sf-palette" aria-describedby={undefined}>
          <RadixDialog.Title className="sf-visually-hidden">Busca global</RadixDialog.Title>

          <div className="sf-palette__field">
            <Search size={18} aria-hidden="true" />
            <input
              type="text"
              role="combobox"
              aria-label="Buscar páginas e módulos"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={results.length ? optionId(activeIndex) : undefined}
              autoComplete="off"
              autoFocus
              placeholder="Buscar páginas e módulos…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onInputKeyDown}
            />
          </div>

          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Resultados" className="sf-palette__list">
              {results.map((entry, index) => {
                const Icon = entry.icon
                return (
                  <li
                    key={entry.to}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={cn('sf-palette__option', index === activeIndex && 'is-active')}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(entry.to)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span className="sf-palette__label">{entry.label}</span>
                    <span className="sf-palette__group">{entry.group}</span>
                    {!entry.available && <Badge tone="neutral" hideIcon>Em breve</Badge>}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="sf-palette__empty" role="status">
              Nenhum resultado para “{query}”.
            </p>
          )}

          <p className="sf-palette__hint">
            ↑↓ navegar · Enter abrir · Esc fechar. A busca por produtos, clientes e pedidos chegará com os respectivos
            módulos.
          </p>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
