import { useEffect, useState, type ReactNode } from 'react'
import { ANIMALS } from '../data/animals'
import { ITEMS } from '../data/items'
import { LEVELS, START_LEVEL } from '../data/levels'
import { MESSAGES } from '../data/messages'
import { UI_DEFAULTS, UI_LABELS, type UiKey } from '../data/ui'
import { getMessages, getOverrides, updateTexts, type Overrides } from '../lib/texts'
import { Modal } from './Modal'

/** Textové pole s lokálním stavem: do úložiště jde jen neprázdný text, při opuštění se prázdné vrátí. */
function TextField({ value, onCommit, multiline = false }: { value: string; onCommit: (v: string) => void; multiline?: boolean }) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  const props = {
    value: text,
    onChange: (e: { target: { value: string } }) => {
      setText(e.target.value)
      if (e.target.value.trim()) onCommit(e.target.value)
    },
    onBlur: () => setText(value),
    className: 'w-full rounded-xl bg-white px-3 py-2 text-base ring-1 ring-sand-200 outline-none focus:ring-2 focus:ring-sea-500',
  }
  return multiline ? <textarea rows={2} {...props} /> : <input {...props} />
}

function Section({ title, count, open, onReset, children }: { title: string; count?: number; open?: boolean; onReset: () => void; children: ReactNode }) {
  return (
    <details open={open} className="card group mb-3 p-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-lg font-extrabold">
        <span className="inline-block transition group-open:rotate-90">▸</span>
        {title}
        {count !== undefined && <span className="rounded-full bg-sea-100 px-2 py-0.5 text-xs font-bold">{count}</span>}
      </summary>
      <div className="mt-3 grid gap-2">{children}</div>
      <button onClick={onReset} className="press mt-3 rounded-full bg-sand-100 px-3 py-1 text-xs font-bold">
        Obnovit výchozí
      </button>
    </details>
  )
}

export function TextEditor({ onClose }: { onClose: () => void }) {
  const o = getOverrides()
  const messages = getMessages()
  const [draft, setDraft] = useState('')

  const patch = (fn: (o: Overrides) => Partial<Overrides>) => updateTexts((cur) => ({ ...cur, ...fn(cur) }))
  const setMessages = (list: string[]) => patch(() => ({ messages: list }))

  const addMessage = () => {
    if (!draft.trim()) return
    setMessages([...messages, draft.trim()])
    setDraft('')
  }

  const resetAll = () => {
    if (confirm('Vrátit všechny texty na výchozí?')) updateTexts(() => ({ animals: {}, levels: {}, items: {}, ui: {} }))
  }

  return (
    <Modal onClose={onClose}>
      <div className="mb-3 flex items-start gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold">Úprava textů ✏️</h2>
          <p className="text-sm text-ink/60">
            Změny se ukládají hned a platí jen v tomhle prohlížeči / zařízení. Zavřeš přes Esc nebo Ctrl+E.
          </p>
        </div>
        <button onClick={onClose} aria-label="Zavřít" className="press rounded-full bg-white px-3 py-2 text-lg shadow-sm">
          ✕
        </button>
      </div>

      <Section title="Povzbudivé hlášky" count={messages.length} open onReset={() => patch(() => ({ messages: undefined }))}>
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <TextField multiline value={m} onCommit={(v) => setMessages(messages.map((x, j) => (j === i ? v : x)))} />
            </div>
            <button
              disabled={messages.length <= 1}
              onClick={() => setMessages(messages.filter((_, j) => j !== i))}
              aria-label="Smazat hlášku"
              className="press rounded-full p-2 text-lg disabled:opacity-30"
            >
              🗑️
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMessage()}
              placeholder="Nová hláška…"
              className="w-full rounded-xl bg-white px-3 py-2 ring-1 ring-sand-200 outline-none focus:ring-2 focus:ring-sea-500"
            />
          </div>
          <button onClick={addMessage} className="press rounded-xl bg-palm-500 px-4 py-2 font-bold text-white">
            + Přidat
          </button>
        </div>
        <p className="text-xs text-ink/50">Výchozích hlášek je {MESSAGES.length}. Poslední hlášku smazat nejde.</p>
      </Section>

      <Section title="Texty v appce" onReset={() => patch(() => ({ ui: {} }))}>
        {(Object.keys(UI_DEFAULTS) as UiKey[]).map((k) => (
          <label key={k} className="grid gap-1">
            <span className="text-xs font-bold text-ink/60">{UI_LABELS[k]}</span>
            <TextField multiline value={o.ui[k] || UI_DEFAULTS[k]} onCommit={(v) => patch((c) => ({ ui: { ...c.ui, [k]: v } }))} />
          </label>
        ))}
      </Section>

      <Section title="Názvy levelů" count={LEVELS.length + 1} onReset={() => patch(() => ({ levels: {} }))}>
        {[START_LEVEL, ...LEVELS].map((l) => (
          <label key={l.at} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-xs font-bold text-ink/60">
              {l.emoji} {l.at === 0 ? 'začátek' : `od ${l.at}`}
            </span>
            <TextField value={o.levels[l.at] || l.name} onCommit={(v) => patch((c) => ({ levels: { ...c.levels, [l.at]: v } }))} />
          </label>
        ))}
      </Section>

      <Section title="Zvířátka a věci v albu" count={ANIMALS.length} onReset={() => patch(() => ({ animals: {} }))}>
        {ANIMALS.map((a, i) => (
          <label key={i} className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-center text-2xl">{a.emoji}</span>
            <TextField value={o.animals[i] || a.name} onCommit={(v) => patch((c) => ({ animals: { ...c.animals, [i]: v } }))} />
          </label>
        ))}
      </Section>

      <Section title="Názvy věcí z Kostariky" count={ITEMS.length} onReset={() => patch(() => ({ items: {} }))}>
        {ITEMS.map((it) => (
          <label key={it.id} className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-center text-2xl">{it.emoji}</span>
            <TextField value={o.items[it.id] || it.name} onCommit={(v) => patch((c) => ({ items: { ...c.items, [it.id]: v } }))} />
          </label>
        ))}
      </Section>

      <button onClick={resetAll} className="press w-full rounded-2xl bg-white py-3 font-bold text-coral-500 ring-2 ring-coral-400/40">
        Vrátit všechny texty na výchozí
      </button>
    </Modal>
  )
}
