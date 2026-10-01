import { ITEM_BY_ID } from '../data/items'
import { itemName } from '../lib/texts'
import type { Line } from '../lib/types'

export function ItemChips({ lines }: { lines: Line[] }) {
  if (!lines.length) return <p className="text-ink/60">Jen drobné na pohlednici 💌</p>
  return (
    <ul className="flex flex-wrap gap-2">
      {lines.map((l) => {
        const it = ITEM_BY_ID[l.id]
        return (
          <li key={l.id} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm shadow-sm">
            <span className="text-xl leading-none">{it.emoji}</span>
            <span>
              {l.count > 1 && <b className="mr-1 text-coral-500">{l.count}×</b>}
              {itemName(l.id)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
