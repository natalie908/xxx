export type ProductKind = 'cigs' | 'vape' | 'pod'
export type Kind = ProductKind | 'custom'

export interface Line {
  id: string
  count: number
}

export interface Purchase {
  id: string
  ts: number
  kind: Kind
  amount: number
  lines: Line[]
}

export interface CleanDay {
  id: string
  date: string // YYYY-MM-DD (lokální čas)
  ts: number
  amount: number
  lines: Line[]
}

export type Uses = 'cigs' | 'vape' | 'both'

export interface Settings {
  uses: Uses
  prices: Record<ProductKind, number>
  itemPrices: Record<string, number>
  dailySpend: number
  departDate: string // YYYY-MM-DD
  sound: boolean
}

export interface Cravings {
  total: number
  byDate: Record<string, number>
}

export interface Body {
  lastDose: number | null // ms; začátek odpočtu času bez nikotinu
  wins: Record<string, number> // id zdravotního faktu → kolikrát
}
