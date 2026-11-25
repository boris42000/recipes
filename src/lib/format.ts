import type { Ingredient, Unit } from './schema'
import { unitLabel } from '../strings'

const numberFormat = new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 2 })
export const formatNumber = (n: number) => numberFormat.format(n)

const roundTo = (v: number, step: number) => Math.round(v / step) * step

/** Round a scaled quantity to something you'd actually measure in a kitchen. */
export function roundQty(value: number, unit: Unit | undefined): number {
  switch (unit) {
    case 'g':
    case 'ml':
      if (value >= 100) return roundTo(value, 5)
      if (value >= 10) return Math.round(value)
      return Math.max(0.5, roundTo(value, 0.5))
    case 'kg':
    case 'l':
      return Math.max(0.05, roundTo(value, value >= 10 ? 0.5 : 0.05))
    case 'lyžica':
    case 'lyžička':
      return value < 0.5 ? 0.25 : roundTo(value, 0.5)
    case 'ks':
    case 'štipka':
    case undefined:
      // Whole or half pieces only ("1,5 ks" cibule is fine, "1,37 ks" vajca is not).
      return Math.max(0.5, roundTo(value, 0.5))
  }
}

export function scaleIngredient(ing: Ingredient, factor: number): number | undefined {
  if (ing.qty === undefined) return undefined // never scale "kyslá smotana" without an amount
  if (factor === 1) return ing.qty
  return roundQty(ing.qty * factor, ing.unit)
}

/** "1,5 lyžice" / "250 g" / "" (no qty) */
export function formatAmount(qty: number | undefined, unit: Unit | undefined): string {
  if (qty === undefined) return ''
  const n = formatNumber(qty)
  return unit ? `${n} ${unitLabel(unit, qty)}` : n
}
