import { useMemo } from 'react'
import { PRODUCTS } from '../data/defaults'
import { levelFor } from '../data/levels'
import type { AppData } from '../hooks/useAppData'
import { mergeLines } from '../lib/convert'
import { czDays, daysUntil, fmtDate } from '../lib/date'
import { ItemChips } from './ItemChips'

export function Overview({ data }: { data: AppData }) {
  const { purchases, cleanDays, settings, cravings } = data
  const spent = purchases.reduce((s, p) => s + p.amount, 0)
  const saved = cleanDays.reduce((s, d) => s + d.amount, 0)
  const spentLines = useMemo(() => mergeLines(purchases.map((p) => p.lines)), [purchases])
  const savedLines = useMemo(() => mergeLines(cleanDays.map((d) => d.lines)), [cleanDays])
  const left = daysUntil(settings.departDate)
  const { current } = levelFor(cravings.total)

  const history = [
    ...purchases.map((p) => ({ kind: 'buy' as const, id: p.id, ts: p.ts, amount: p.amount, product: p.kind })),
    ...cleanDays.map((d) => ({ kind: 'clean' as const, id: d.id, ts: d.ts, amount: d.amount, product: null })),
  ].sort((a, b) => b.ts - a.ts)

  const remove = (h: (typeof history)[number]) => {
    if (!confirm('Smazat tenhle záznam?')) return
    if (h.kind === 'buy') data.deletePurchase(h.id)
    else data.deleteCleanDay(h.id)
  }

  const label = (h: (typeof history)[number]) => {
    if (h.kind === 'clean') return { emoji: '🌞', text: 'Celý den bez nikotinu' }
    const p = PRODUCTS.find((x) => x.kind === h.product)
    return p ? { emoji: p.emoji, text: p.label } : { emoji: '✏️', text: 'Vlastní částka' }
  }

  return (
    <main className="mx-auto grid max-w-md gap-4 px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-extrabold">Přehled 📊</h1>

      <section className="card p-4">
        <p className="text-sm font-bold text-ink/60">✈️ Odpočet do odletu</p>
        <p className="text-4xl font-extrabold text-sea-600">
          {left > 0 ? `${left} ${czDays(left)}` : left === 0 ? 'Dnes!' : 'Už jsi tam 🌺'}
        </p>
      </section>

      <section className="card p-4">
        <p className="text-sm font-bold text-ink/60">Utraceno za nikotin</p>
        <p className="text-4xl font-extrabold text-coral-500">{spent} Kč</p>
        <p className="mb-3 mt-1 text-sm text-ink/70">V Kostarice by to stačilo na:</p>
        {purchases.length ? <ItemChips lines={spentLines} /> : <p className="text-ink/60">Zatím nic, čistý štít 🌴</p>}
      </section>

      <section className="card p-4">
        <p className="text-sm font-bold text-ink/60">Zachráněno díky dnům bez nikotinu</p>
        <p className="text-4xl font-extrabold text-palm-500">{saved} Kč</p>
        <p className="mb-3 mt-1 text-sm text-ink/70">
          {cleanDays.length} {cleanDays.length === 1 ? 'den' : cleanDays.length >= 2 && cleanDays.length <= 4 ? 'dny' : 'dní'} bez nikotinu. Do Kostariky letí:
        </p>
        {cleanDays.length ? <ItemChips lines={savedLines} /> : <p className="text-ink/60">První slunečný den čeká 🌞</p>}
      </section>

      <section className="card flex items-center gap-4 p-4">
        <span className="text-4xl">🌊</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink/60">Ustálené chutě 🎉</p>
          <p className="font-extrabold">
            {cravings.total} celkem · {data.todayCravings} dnes
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-sea-100 px-3 py-1 text-xs font-bold">{current.emoji} {current.name}</span>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-lg font-extrabold">Historie 🗒️</h2>
        {history.length === 0 && <p className="text-ink/60">Zatím tu nic není.</p>}
        <ul className="divide-y divide-sand-200">
          {history.map((h) => {
            const l = label(h)
            return (
              <li key={h.id} className="flex items-center gap-3 py-2.5">
                <span className="text-2xl">{l.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.text}</p>
                  <p className="text-xs text-ink/60">{fmtDate(h.ts)}</p>
                </div>
                <span className={`font-extrabold ${h.kind === 'buy' ? 'text-coral-500' : 'text-palm-500'}`}>
                  {h.kind === 'buy' ? '−' : '+'}
                  {h.amount} Kč
                </span>
                <button onClick={() => remove(h)} aria-label="Smazat záznam" className="press rounded-full p-2 text-lg">
                  🗑️
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
