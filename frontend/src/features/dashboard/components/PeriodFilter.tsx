import { useState, type FormEvent } from 'react'
import { Button, Input, Select } from '@/components/ui'
import { formatIsoDate } from '@/lib/format'
import { PRESET_LABELS, validateCustomRange, type Period, type PeriodPreset } from '@/lib/period'

interface PeriodFilterProps {
  period: Period
  today: string
  /** Erro vindo da URL (parâmetros inválidos que foram descartados). */
  urlError?: string
  onPreset: (preset: Exclude<PeriodPreset, 'custom'>) => void
  onCustomRange: (from: string, to: string) => void
}

const presetOptions = (Object.keys(PRESET_LABELS) as PeriodPreset[]).map((value) => ({
  value,
  label: PRESET_LABELS[value],
}))

export function PeriodFilter({ period, today, urlError, onPreset, onCustomRange }: PeriodFilterProps) {
  const [customOpen, setCustomOpen] = useState(false)
  const [from, setFrom] = useState(period.from)
  const [to, setTo] = useState(period.to)
  const [formError, setFormError] = useState<string>()

  const selected = customOpen || period.preset === 'custom' ? 'custom' : period.preset

  function handleSelect(value: string) {
    if (value === 'custom') {
      setFrom(period.from)
      setTo(period.to)
      setFormError(undefined)
      setCustomOpen(true)
      return
    }
    setCustomOpen(false)
    setFormError(undefined)
    onPreset(value as Exclude<PeriodPreset, 'custom'>)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const error = validateCustomRange(from, to, today)
    setFormError(error)
    if (error) return
    onCustomRange(from, to)
    setCustomOpen(false)
  }

  const error = formError ?? urlError

  return (
    <div className="sf-period">
      <div className="sf-period__row">
        <Select
          label="Período"
          value={selected}
          options={presetOptions}
          onChange={(event) => handleSelect(event.target.value)}
        />
        <p className="sf-period__range" aria-live="polite">
          {formatIsoDate(period.from)}
          {period.from !== period.to && ` – ${formatIsoDate(period.to)}`}
          <span className="sf-muted"> · {period.days} {period.days === 1 ? 'dia' : 'dias'}</span>
        </p>
      </div>

      {selected === 'custom' && (
        <form className="sf-period__custom" onSubmit={handleSubmit} noValidate>
          <Input label="De" type="date" value={from} max={today} onChange={(e) => setFrom(e.target.value)} />
          <Input label="Até" type="date" value={to} max={today} onChange={(e) => setTo(e.target.value)} />
          <Button type="submit" variant="primary">
            Aplicar
          </Button>
        </form>
      )}

      {error && (
        <p className="sf-period__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
