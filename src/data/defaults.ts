import type { ProductKind, Settings } from '../lib/types'

export const PRODUCTS: { kind: ProductKind; emoji: string; label: string }[] = [
  { kind: 'cigs', emoji: '🚬', label: 'krabička cigaret' },
  { kind: 'vape', emoji: '💨', label: 'jednorázový vape' },
  { kind: 'pod', emoji: '🫧', label: 'náplň / pod do vapu' },
]

export const DEFAULT_SETTINGS: Settings = {
  prices: { cigs: 170, vape: 250, pod: 150 },
  itemPrices: {},
  dailySpend: 170,
  departDate: '2026-11-14',
  sound: true,
}
