import { linesText } from '../lib/convert'
import type { Line } from '../lib/types'
import { ItemChips } from './ItemChips'
import { Modal } from './Modal'

interface Props {
  title: string
  amount: number
  lines: Line[]
  emoji: string
  tone: 'coral' | 'sun'
  footer: string
  onReroll?: () => void
  onClose: () => void
}

export function ConversionCard({ title, amount, lines, emoji, tone, footer, onReroll, onClose }: Props) {
  const bg = tone === 'coral' ? 'from-coral-400/20 to-sun-300/30' : 'from-sun-300/40 to-sun-400/20'
  return (
    <Modal onClose={onClose} center>
      <div className={`rounded-3xl bg-gradient-to-br ${bg} p-4`}>
        <div className="mb-2 text-center text-6xl wiggle">{emoji}</div>
        <h2 className="text-center text-xl font-extrabold">{title}</h2>
        <p className="mt-1 text-center text-sm text-ink/60">{amount} Kč</p>
        <p className="my-4 rounded-2xl bg-white/80 p-3 text-center text-lg font-bold leading-snug">= {linesText(lines)}</p>
        <ItemChips lines={lines} />
      </div>
      <p className="mt-3 text-center text-sm text-ink/70">{footer}</p>
      <div className="mt-4 flex gap-3">
        {onReroll && (
          <button onClick={onReroll} className="press flex-1 rounded-2xl bg-white py-3 font-bold shadow-sm ring-1 ring-sand-200">
            🎲 Jiné složení
          </button>
        )}
        <button onClick={onClose} className="press flex-[1.4] rounded-2xl bg-sea-500 py-3 font-bold text-white shadow">
          Dobře 🌴
        </button>
      </div>
    </Modal>
  )
}
