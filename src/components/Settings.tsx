import { PRODUCTS } from '../data/defaults'
import { ITEMS } from '../data/items'
import type { AppData } from '../hooks/useAppData'
import { priceOf } from '../lib/convert'
import { itemName } from '../lib/texts'
import { NumInput } from './NumInput'

export function Settings({ data, onEditTexts }: { data: AppData; onEditTexts: () => void }) {
  const { settings, setSettings } = data

  const setItemPrice = (id: string, n: number) =>
    setSettings((s) => ({ ...s, itemPrices: { ...s.itemPrices, [id]: n } }))

  const reset = () => {
    if (confirm('Opravdu smazat všechna data (nákupy, dny bez nikotinu, album i nastavení)? Nejde to vrátit.')) {
      data.resetAll()
    }
  }

  return (
    <main className="mx-auto grid max-w-md gap-4 px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-extrabold">Nastavení ⚙️</h1>

      <section className="card grid gap-3 p-4">
        <h2 className="text-lg font-extrabold">Nikotin</h2>
        <div>
          <p className="mb-1 text-sm font-semibold">Užívám</p>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-sand-100 p-1">
            {([['cigs', '🚬 Cigarety'], ['vape', '💨 Vape'], ['both', 'Obojí']] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setSettings((s) => ({ ...s, uses: v }))}
                aria-pressed={settings.uses === v}
                className={`press rounded-xl py-2 text-sm font-bold ${settings.uses === v ? 'bg-white text-sea-600 shadow' : 'text-ink/60'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-ink/60">Podle toho se vybírají zdravotní výhry v záložce Tělo.</p>
        </div>
        <h2 className="text-lg font-extrabold">Ceny nikotinu</h2>
        {PRODUCTS.map((p) => (
          <div key={p.kind} className="flex items-center gap-3">
            <span className="text-2xl">{p.emoji}</span>
            <span className="flex-1 font-semibold">{p.label}</span>
            <NumInput
              className="w-28"
              value={settings.prices[p.kind]}
              onChange={(n) => setSettings((s) => ({ ...s, prices: { ...s.prices, [p.kind]: n } }))}
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌞</span>
          <span className="flex-1 font-semibold">průměrná denní útrata</span>
          <NumInput className="w-28" value={settings.dailySpend} onChange={(n) => setSettings((s) => ({ ...s, dailySpend: n }))} />
        </div>
      </section>

      <section className="card grid gap-3 p-4">
        <h2 className="text-lg font-extrabold">Odlet a zvuk</h2>
        <label className="flex items-center gap-3">
          <span className="flex-1 font-semibold">✈️ Datum odletu</span>
          <input
            type="date"
            value={settings.departDate}
            onChange={(e) => e.target.value && setSettings((s) => ({ ...s, departDate: e.target.value }))}
            className="rounded-xl bg-white px-3 py-2 ring-1 ring-sand-200"
          />
        </label>
        <button onClick={() => setSettings((s) => ({ ...s, sound: !s.sound }))} className="flex items-center gap-3 text-left" role="switch" aria-checked={settings.sound}>
          <span className="flex-1 font-semibold">🔔 Zvuk při stisku</span>
          <span className={`flex h-8 w-14 items-center rounded-full p-1 transition ${settings.sound ? 'bg-sea-500' : 'bg-sand-400'}`}>
            <span className={`h-6 w-6 rounded-full bg-white shadow transition ${settings.sound ? 'translate-x-6' : ''}`} />
          </span>
        </button>
      </section>

      <button onClick={onEditTexts} className="press rounded-2xl bg-sea-500 py-4 text-lg font-bold text-white shadow">
        ✏️ Upravit texty <span className="text-sm font-normal opacity-80">(Ctrl+E)</span>
      </button>

      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Ceny v Kostarice</h2>
          <button onClick={() => setSettings((s) => ({ ...s, itemPrices: {} }))} className="press rounded-full bg-sand-100 px-3 py-1 text-xs font-bold">
            Výchozí ceny
          </button>
        </div>
        <ul className="grid gap-2">
          {ITEMS.map((it) => (
            <li key={it.id} className="flex items-center gap-3">
              <span className="text-2xl">{it.emoji}</span>
              <span className="flex-1 text-sm font-semibold leading-tight">{itemName(it.id)}</span>
              <NumInput className="w-24" value={priceOf(it.id, settings.itemPrices)} onChange={(n) => setItemPrice(it.id, n)} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink/60">Změna cen platí pro nové záznamy, staré zůstávají, jak byly.</p>
      </section>

      <button onClick={reset} className="press rounded-2xl bg-white py-3 font-bold text-coral-500 ring-2 ring-coral-400/40">
        🗑️ Smazat všechna data
      </button>
    </main>
  )
}
