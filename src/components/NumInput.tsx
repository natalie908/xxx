import { useEffect, useState } from 'react'

interface Props {
  value: number
  onChange: (n: number) => void
  suffix?: string
  className?: string
}

/** Číselné pole, které dovolí dočasně prázdný text a ukládá jen platná kladná čísla. */
export function NumInput({ value, onChange, suffix = 'Kč', className = '' }: Props) {
  const [text, setText] = useState(String(value))
  useEffect(() => setText(String(value)), [value])

  return (
    <label className={`flex items-center gap-1 rounded-xl bg-white px-3 py-2 shadow-inner ring-1 ring-sand-200 ${className}`}>
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={(e) => {
          const t = e.target.value.replace(/[^0-9]/g, '').slice(0, 7)
          setText(t)
          const n = Number(t)
          if (t && n > 0) onChange(n)
        }}
        onBlur={() => setText(String(value))}
        className="w-full min-w-0 bg-transparent text-right text-base font-semibold outline-none"
      />
      {suffix && <span className="text-sm text-ink/60">{suffix}</span>}
    </label>
  )
}
