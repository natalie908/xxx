import { useState } from 'react'
import { levelFor } from '../data/levels'
import type { AppData, CravingResult } from '../hooks/useAppData'
import { daysUntil, czDays } from '../lib/date'
import { bigCelebration, burst, buzz, pling, sunBurst } from '../lib/fx'
import type { CleanDay, Kind } from '../lib/types'
import { ConversionCard } from './ConversionCard'
import { Modal } from './Modal'
import { PurchaseSheet } from './PurchaseSheet'
import { Wave } from './Wave'

export function Home({ data }: { data: AppData }) {
  const { settings, cravings, todayCravings, cleanToday } = data
  const [buying, setBuying] = useState(false)
  const [cardId, setCardId] = useState<string | null>(null)
  const [clean, setClean] = useState<CleanDay | null>(null)
  const [reward, setReward] = useState<(CravingResult & { n: number }) | null>(null)
  const [bounce, setBounce] = useState(false)
  const [levelModal, setLevelModal] = useState(false)

  const card = data.purchases.find((p) => p.id === cardId)
  const { current, next } = levelFor(cravings.total)
  const progress = next ? ((cravings.total - current.at) / (next.at - current.at)) * 100 : 100
  const left = daysUntil(settings.departDate)

  const pickProduct = (kind: Kind, amount: number) => {
    const p = data.addPurchase(kind, amount)
    setBuying(false)
    setCardId(p.id)
  }

  const onCraving = () => {
    const r = data.addCraving()
    setReward({ ...r, n: (reward?.n ?? 0) + 1 })
    setBounce(false)
    requestAnimationFrame(() => setBounce(true))
    setTimeout(() => setBounce(false), 650)
    buzz()
    if (settings.sound) pling()
    if (r.levelUp) {
      bigCelebration()
      setLevelModal(true)
    } else burst()
  }

  const onClean = () => {
    const d = data.addCleanDay()
    if (!d) return
    setClean(d)
    sunBurst()
    if (settings.sound) pling()
  }

  return (
    <div>
      <header className="bg-gradient-to-b from-sea-500 to-sea-400 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
        <div className="mx-auto max-w-md px-4">
          <div className="flex items-center justify-between">
            <h1 className="whitespace-nowrap text-xl font-extrabold">
              Pura Vida Fund <span className="sway">🌴</span>
            </h1>
            <span className="whitespace-nowrap rounded-full bg-white/25 px-3 py-1 text-sm font-bold">
              {left > 0 ? `✈️ za ${left} ${czDays(left)}` : left === 0 ? '✈️ dnes letíš!' : '🌺 jsi tam!'}
            </span>
          </div>
          <p className="mb-3 mt-1 text-sm text-white/85">Kostarika, listopad – dva týdny bez výčitek.</p>
        </div>
        <Wave />
      </header>

      <main className="mx-auto grid max-w-md gap-4 px-4 pt-4">
        {/* Ustálené chutě – bez peněz, čistě pro radost */}
        <section className="card p-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{current.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-sea-600">Level</p>
              <p className="text-lg font-extrabold leading-tight">{current.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold leading-none">{todayCravings}</p>
              <p className="text-xs text-ink/60">dnes</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold leading-none">{cravings.total}</p>
              <p className="text-xs text-ink/60">celkem</p>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-sea-100">
            <div className="h-full rounded-full bg-gradient-to-r from-sea-500 to-palm-400 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink/60">
            {next ? `Ještě ${next.at - cravings.total} do levelu „${next.name}“ ${next.emoji}` : 'Nejvyšší level, jsi legenda 👑'}
          </p>
        </section>

        {/* Dopamin */}
        <button
          onClick={onCraving}
          className={`press rounded-[2rem] bg-gradient-to-br from-sea-400 via-sea-500 to-palm-500 px-6 py-8 text-white shadow-xl shadow-sea-500/40 ${bounce ? 'bounce' : ''}`}
        >
          <span className="block text-6xl">🌊</span>
          <span className="mt-2 block text-2xl font-extrabold">Ustála jsem chuť</span>
          <span className="block text-sm text-white/85">klepni pokaždé, když to zvládneš</span>
        </button>

        {reward && (
          <section key={reward.n} className="card pop-in flex items-center gap-4 p-4">
            <span className="text-6xl">{reward.animal.emoji}</span>
            <div>
              <p className="text-lg font-extrabold leading-snug">{reward.message}</p>
              <p className="mt-1 text-sm text-ink/60">
                {reward.isNew ? `Nové do alba: ${reward.animal.name} ✨` : `${reward.animal.name} ti jde naproti`}
              </p>
            </div>
          </section>
        )}

        <button
          onClick={onClean}
          disabled={cleanToday}
          className="press flex items-center gap-4 rounded-3xl bg-gradient-to-br from-sun-300 to-sun-500 px-5 py-5 text-left shadow-lg shadow-sun-500/30 disabled:from-sand-200 disabled:to-sand-200 disabled:shadow-none"
        >
          <span className="text-5xl">{cleanToday ? '✅' : '🌞'}</span>
          <span>
            <span className="block text-xl font-extrabold">{cleanToday ? 'Dnešek splněn' : 'Celý den bez nikotinu'}</span>
            <span className="block text-sm text-ink/70">
              {cleanToday ? 'Zítra zase, slunce nezapadá 🌅' : `+${settings.dailySpend} Kč do kostarického fondu`}
            </span>
          </span>
        </button>

        <button
          onClick={() => setBuying(true)}
          className="press flex items-center justify-center gap-3 rounded-3xl bg-coral-400 px-5 py-5 text-xl font-extrabold text-white shadow-lg shadow-coral-500/30"
        >
          <span className="text-3xl">🛒</span> Koupila jsem…
        </button>
      </main>

      {buying && <PurchaseSheet settings={settings} onPick={pickProduct} onClose={() => setBuying(false)} />}

      {card && (
        <ConversionCard
          emoji="🌴"
          tone="coral"
          title="Tohle sis právě vzala z Kostariky:"
          amount={card.amount}
          lines={card.lines}
          footer="Žádný stres, další chuť zvládneš přepést 🌊"
          onReroll={() => data.rerollPurchase(card.id)}
          onClose={() => setCardId(null)}
        />
      )}

      {clean && (
        <ConversionCard
          emoji="🌞"
          tone="sun"
          title="Tohle sis dnes zachránila na Kostariku:"
          amount={clean.amount}
          lines={clean.lines}
          footer="Pura vida! Dnešek je tvůj ☀️"
          onClose={() => setClean(null)}
        />
      )}

      {levelModal && (
        <Modal center onClose={() => setLevelModal(false)}>
          <div className="pop-in text-center">
            <div className="text-8xl wiggle">{current.emoji}</div>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-sea-600">Nový level!</p>
            <h2 className="text-3xl font-extrabold">{current.name}</h2>
            <p className="mt-2 text-ink/70">{cravings.total} ustálených chutí. Pura vida! 🎉</p>
            <button onClick={() => setLevelModal(false)} className="press mt-5 w-full rounded-2xl bg-sea-500 py-3 text-lg font-bold text-white">
              Jedeme dál 🌴
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
