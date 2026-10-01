import { useCallback, useEffect, useRef, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T, revive: (raw: unknown) => T = (r) => r as T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? revive(JSON.parse(raw)) : initial
    } catch {
      return initial
    }
  })

  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* plné úložiště / soukromý režim – appka funguje dál */
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initial), [initial])
  return [value, setValue, reset] as const
}
