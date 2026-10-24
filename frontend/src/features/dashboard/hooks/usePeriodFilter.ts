import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { buildPeriod, resolvePeriod, toSearchParams, todayInAppZone, type PeriodPreset, type ResolvedPeriod } from '@/lib/period'

/** Período selecionado, persistido na URL (?periodo=7d | ?periodo=custom&de=…&ate=…). */
export function usePeriodFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const today = todayInAppZone()

  const periodo = searchParams.get('periodo')
  const de = searchParams.get('de')
  const ate = searchParams.get('ate')

  const resolved: ResolvedPeriod = useMemo(
    () => resolvePeriod({ periodo, de, ate }, today),
    [periodo, de, ate, today],
  )

  const setPreset = useCallback(
    (preset: Exclude<PeriodPreset, 'custom'>) => {
      const { period } = resolvePeriod({ periodo: preset }, today)
      setSearchParams(toSearchParams(period))
    },
    [setSearchParams, today],
  )

  /** Aplica um intervalo já validado pelo chamador. */
  const setCustomRange = useCallback(
    (from: string, to: string) => {
      setSearchParams(toSearchParams(buildPeriod('custom', from, to)))
    },
    [setSearchParams],
  )

  return { ...resolved, today, setPreset, setCustomRange }
}
