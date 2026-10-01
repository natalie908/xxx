import { ANIMALS } from '../data/animals'
import { levelFor } from '../data/levels'
import type { AppData } from '../hooks/useAppData'

export function Album({ data }: { data: AppData }) {
  const unlocked = Math.min(data.cravings.total, ANIMALS.length)
  const { current } = levelFor(data.cravings.total)

  return (
    <main className="mx-auto max-w-md px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-extrabold">Album 🦥</h1>
      <p className="mb-4 text-sm text-ink/60">
        Každá ustálená chuť odemkne další zvířátko nebo kostarickou věc. {current.emoji} {current.name}
      </p>

      <div className="card mb-4 p-4">
        <div className="mb-1 flex justify-between text-sm font-bold">
          <span>Odemčeno</span>
          <span>
            {unlocked} / {ANIMALS.length}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-sea-100">
          <div className="h-full rounded-full bg-gradient-to-r from-sea-500 to-palm-400" style={{ width: `${(unlocked / ANIMALS.length) * 100}%` }} />
        </div>
        {unlocked === ANIMALS.length && <p className="mt-2 text-sm font-bold text-palm-700">Máš celé album! 🏆</p>}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ANIMALS.map((a, i) => {
          const open = i < unlocked
          return (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl p-1 text-center ${open ? 'card' : 'bg-sand-200/60'}`}
            >
              <span className={`text-4xl leading-none ${open ? '' : 'silhouette'}`}>{a.emoji}</span>
              <span className="mt-1 text-[10px] font-semibold leading-tight text-ink/70">{open ? a.name : '???'}</span>
            </div>
          )
        })}
      </div>
    </main>
  )
}
