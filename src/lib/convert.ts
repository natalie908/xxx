import { ITEMS, ITEM_BY_ID } from '../data/items'
import { itemName } from './texts'
import type { Line } from './types'

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const priceOf = (id: string, overrides: Record<string, number>) =>
  overrides[id] ?? ITEM_BY_ID[id].price

/**
 * Rozloží částku na celé položky: náhodně od větších k menším (vždy z položek, které se vejdou
 * a nejsou úplně titěrné vůči zbytku), nově použité položky mají přednost před opakováním.
 * Zbytek vždy dorovná nejmenší položka, takže odchylka je max. cena nejmenší položky (výchozí 15 Kč).
 */
export function convert(amount: number, overrides: Record<string, number> = {}): Line[] {
  const pool = ITEMS.map((i) => ({ id: i.id, price: Math.max(1, priceOf(i.id, overrides)) }))
  const smallest = pool.reduce((a, b) => (b.price < a.price ? b : a))
  const counts = new Map<string, number>()
  const add = (id: string) => counts.set(id, (counts.get(id) ?? 0) + 1)

  let rem = Math.max(0, amount)
  while (rem >= smallest.price) {
    const affordable = pool.filter((p) => p.price <= rem)
    let cand = affordable.filter((p) => p.price >= rem * 0.2)
    if (!cand.length) cand = affordable
    const fresh = cand.filter((p) => !counts.has(p.id))
    const pick = rand(fresh.length ? fresh : cand)
    add(pick.id)
    rem -= pick.price
  }
  // zbytek blíž k další nejmenší položce než k nule? přidej ji (odchylka se zmenší)
  if (rem > smallest.price / 2) add(smallest.id)

  return [...counts.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => priceOf(b.id, overrides) - priceOf(a.id, overrides))
}

export const lineText = (l: Line) => `${l.count > 1 ? `${l.count}× ` : ''}${itemName(l.id)}`

export const linesText = (lines: Line[]) =>
  lines.length ? lines.map(lineText).join(' + ') : 'pár drobných na pohlednici 💌'

export function mergeLines(all: Line[][]): Line[] {
  const m = new Map<string, number>()
  for (const ls of all) for (const l of ls) m.set(l.id, (m.get(l.id) ?? 0) + l.count)
  return [...m.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => ITEM_BY_ID[b.id].price - ITEM_BY_ID[a.id].price)
}
