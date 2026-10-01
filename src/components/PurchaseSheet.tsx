import { useState } from 'react'
import { PRODUCTS } from '../data/defaults'
import type { Kind, Settings } from '../lib/types'
import { Modal } from './Modal'
import { NumInput } from './NumInput'

interface Props {
  settings: Settings
  onPick: (kind: Kind, amount: number) => void
  onClose: () => void
}

export function PurchaseSheet({ settings, onPick, onClose }: Props) {
  const [custom, setCustom] = useState(100)

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-1 text-2xl font-extrabold">Koupila jsem… 🛒</h2>
      <p className="mb-4 text-sm text-ink/60">Vyber, co to bylo – převedu to na Kostariku.</p>
      <div className="grid gap-3">
        {PRODUCTS.map((p) => (
          <button
            key={p.kind}
            onClick={() => onPick(p.kind, settings.prices[p.kind])}
            className="press flex items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-sand-200"
          >
            <span className="text-4xl">{p.emoji}</span>
            <span className="flex-1 text-lg font-bold">{p.label}</span>
            <span className="rounded-full bg-sand-100 px-3 py-1 font-bold">{settings.prices[p.kind]} Kč</span>
          </button>
        ))}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sand-200">
          <span className="text-4xl">✏️</span>
          <span className="flex-1 text-lg font-bold">vlastní částka</span>
          <NumInput value={custom} onChange={setCustom} className="w-28" />
        </div>
        <button
          onClick={() => onPick('custom', custom)}
          className="press rounded-2xl bg-coral-400 py-3 text-lg font-bold text-white shadow"
        >
          Zapsat {custom} Kč
        </button>
      </div>
    </Modal>
  )
}
