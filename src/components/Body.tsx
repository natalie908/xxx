import { useEffect, useState } from 'react'
import { MILESTONES, NEUTRAL_MESSAGES, factsFor } from '../data/health'
import type { AppData } from '../hooks/useAppData'
import { fmtDate } from '../lib/date'

const MIN = 60_000

function useNow(everyMs = 20_000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), everyMs)
    return () => clearInterval(t)
  }, [everyMs])
  return now
}

/** Max. dvě nejvýznamnější jednotky: „2 d 4 h“, „3 h 20 min“, „35 min“. */
function fmtDur(ms: number): string {
  const total = Math.max(0, Math.floor(ms / MIN))
  const d = Math.floor(total / 1440)
  const h = Math.floor((total % 1440) / 60)
  const m = total % 60
  if (d) return h ? `${d} d ${h} h` : `${d} d`
  if (h) return m ? `${h} h ${m} min` : `${h} h`
  return `${m} min`
}

const toLocalInput = (ms: number) => {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * MIN)
  return d.toISOString().slice(0, 16)
}

const startOfDay = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}

export function Body({ data }: { data: AppData }) {
  const { body, settings, setLastDose } = data
  const now = useNow()
  const [toast, setToast] = useState<{ text: string; undo: number | null } | null>(null)

  const last = body.lastDose
  const elapsed = last ? Math.max(0, now - last) : 0
  const departMs = startOfDay(settings.departDate)
  const facts = factsFor(settings.uses)
  const winsTotal = Object.values(body.wins).reduce((a, b) => a + b, 0)

  const next = last ? MILESTONES.find((m) => elapsed < m.minutes * MIN) : undefined
  const prev = last ? [...MILESTONES].reverse().find((m) => elapsed >= m.minutes * MIN) : undefined
  const progress = next ? ((elapsed - (prev?.minutes ?? 0) * MIN) / ((next.minutes - (prev?.minutes ?? 0)) * MIN)) * 100 : 100

  const slip = () => {
    setToast({ text: NEUTRAL_MESSAGES[Math.floor(Math.random() * NEUTRAL_MESSAGES.length)], undo: last })
    setLastDose(Date.now())
  }

  return (
    <main className="mx-auto grid max-w-md gap-4 px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div>
        <h1 className="text-2xl font-extrabold">Tělo 🫁</h1>
        <p className="text-sm text-ink/60">Tělo se zotavuje po svém. Tady není nic o penězích, jen o tobě.</p>
      </div>

      {/* Odpočet od poslední dávky */}
      <section className="card p-4">
        {last ? (
          <>
            <p className="text-sm font-bold text-ink/60">Bez nikotinu už</p>
            <p className="text-4xl font-extrabold text-sea-600">{fmtDur(elapsed)}</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-sea-100">
              <div className="h-full rounded-full bg-gradient-to-r from-sea-500 to-palm-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-ink/60">
              {next ? `Další milník (${next.label}) za ${fmtDur(next.minutes * MIN - elapsed)} ${next.icon}` : 'Všechny milníky splněné 🏆'}
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-extrabold">Kdy byla tvoje poslední dávka?</p>
            <p className="mb-3 text-sm text-ink/60">Od toho se bude počítat časová osa. Nastav čas níž, nebo začni od teď.</p>
            <button onClick={() => setLastDose(Date.now())} className="press w-full rounded-2xl bg-sea-500 py-3 font-bold text-white shadow">
              Začít odpočet od teď 🌊
            </button>
          </>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {last && (
            <button onClick={slip} className="press rounded-full bg-sand-100 px-4 py-2 text-sm font-bold ring-1 ring-sand-200">
              Dala jsem si
            </button>
          )}
          <label className="flex items-center gap-2 text-xs text-ink/60">
            {last ? 'Poslední dávka:' : 'Poslední dávka byla:'}
            <input
              type="datetime-local"
              max={toLocalInput(now)}
              value={last ? toLocalInput(last) : ''}
              onChange={(e) => {
                const ms = new Date(e.target.value).getTime()
                if (!Number.isNaN(ms) && ms <= Date.now()) setLastDose(ms)
              }}
              className="rounded-xl bg-white px-2 py-1 text-sm text-ink ring-1 ring-sand-200"
            />
          </label>
        </div>
        {last && <p className="mt-2 text-xs text-ink/50">Od {fmtDate(last)}. Nákup odpočet taky vynuluje.</p>}

        {toast && (
          <div className="pop-in mt-3 flex items-center gap-3 rounded-2xl bg-sea-50 p-3">
            <p className="flex-1 font-bold">{toast.text}</p>
            <button
              onClick={() => {
                setLastDose(toast.undo)
                setToast(null)
              }}
              className="press rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm"
            >
              ↩ Vrátit
            </button>
          </div>
        )}
      </section>

      {/* Časová osa */}
      <section className="card p-4">
        <h2 className="mb-3 text-lg font-extrabold">Cesta tvého těla</h2>
        <ol className="relative">
          {MILESTONES.map((m, i) => {
            const at = last ? last + m.minutes * MIN : null
            const done = !!last && elapsed >= m.minutes * MIN
            const beforeFlight = !!at && !done && at <= departMs
            const lastItem = i === MILESTONES.length - 1
            return (
              <li key={m.id} className="relative flex gap-3 pb-5 last:pb-0">
                {!lastItem && (
                  <span className={`absolute left-[1.35rem] top-12 h-[calc(100%-2.5rem)] w-0 border-l-2 border-dashed ${done ? 'border-palm-400' : 'border-sand-400/60'}`} />
                )}
                <span
                  className={`z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl transition ${
                    done ? 'bg-palm-400/25 shadow-[0_0_0_4px_rgba(76,203,141,.25)]' : 'bg-sand-200/70 grayscale opacity-60'
                  }`}
                >
                  {m.icon}
                </span>
                <div className={done ? '' : 'opacity-80'}>
                  <p className="flex flex-wrap items-center gap-2 font-extrabold">
                    {m.label}
                    {done && <span className="rounded-full bg-palm-400/20 px-2 py-0.5 text-xs font-bold text-palm-700">✓ splněno</span>}
                    {!done && at && <span className="text-xs font-semibold text-ink/50">za {fmtDur(at - now)}</span>}
                  </p>
                  <p className="text-sm">{m.text}</p>
                  {beforeFlight && (
                    <span className="mt-1 inline-block rounded-full bg-sun-300/60 px-3 py-1 text-xs font-bold">
                      Tenhle stihneš ještě před odletem ✈️
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Sbírka zdravotních výher */}
      <section className="card p-4">
        <h2 className="text-lg font-extrabold">Drobné výhry pro tělo</h2>
        <p className="mb-3 text-sm text-ink/60">
          {winsTotal ? `${winsTotal} celkem. Sbírají se pokaždé, když ustojíš chuť 🌊` : 'Sbírají se pokaždé, když ustojíš chuť 🌊'}
        </p>
        <ul className="grid gap-2">
          {facts.map((f) => {
            const n = body.wins[f.id] ?? 0
            return (
              <li key={f.id} className={`flex items-center gap-3 rounded-2xl p-3 ${n ? 'bg-white shadow-sm' : 'bg-sand-100/70 opacity-60'}`}>
                <span className="text-2xl">{f.emoji}</span>
                <p className="flex-1 text-sm font-semibold">
                  <b className="mr-1 text-sea-600">{n}×</b>
                  {f.short}
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="px-2 pb-2 text-center text-[11px] text-ink/50">Obecné informace podle NHS a CDC, nejde o lékařskou radu.</p>
    </main>
  )
}
