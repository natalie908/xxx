import { useCallback, useRef } from 'react'
import { DEFAULT_SETTINGS } from '../data/defaults'
import { ANIMALS } from '../data/animals'
import { isLevelUp } from '../data/levels'
import { convert } from '../lib/convert'
import { dateKey } from '../lib/date'
import { animalName, getMessages } from '../lib/texts'
import type { CleanDay, Cravings, Kind, Purchase, Settings } from '../lib/types'
import { useLocalStorage } from './useLocalStorage'

const EMPTY_CRAVINGS: Cravings = { total: 0, byDate: {} }
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const reviveSettings = (raw: unknown): Settings => {
  const s = (raw ?? {}) as Partial<Settings>
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    prices: { ...DEFAULT_SETTINGS.prices, ...s.prices },
    itemPrices: { ...s.itemPrices },
  }
}

export interface CravingResult {
  message: string
  animal: (typeof ANIMALS)[number]
  isNew: boolean
  levelUp: boolean
  total: number
}

export function useAppData() {
  const [settings, setSettings, resetSettings] = useLocalStorage<Settings>('pvf.settings', DEFAULT_SETTINGS, reviveSettings)
  const [purchases, setPurchases, resetPurchases] = useLocalStorage<Purchase[]>('pvf.purchases', [])
  const [cleanDays, setCleanDays, resetCleanDays] = useLocalStorage<CleanDay[]>('pvf.cleanDays', [])
  const [cravings, setCravings, resetCravings] = useLocalStorage<Cravings>('pvf.cravings', EMPTY_CRAVINGS)
  const lastMsg = useRef(-1)

  const addPurchase = useCallback(
    (kind: Kind, amount: number): Purchase => {
      const p: Purchase = { id: uid(), ts: Date.now(), kind, amount, lines: convert(amount, settings.itemPrices) }
      setPurchases((prev) => [p, ...prev])
      return p
    },
    [settings.itemPrices, setPurchases],
  )

  const rerollPurchase = useCallback(
    (id: string) =>
      setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, lines: convert(p.amount, settings.itemPrices) } : p))),
    [settings.itemPrices, setPurchases],
  )

  const today = dateKey()
  const cleanToday = cleanDays.some((d) => d.date === today)

  const addCleanDay = useCallback((): CleanDay | null => {
    if (cleanDays.some((d) => d.date === dateKey())) return null
    const amount = settings.dailySpend
    const d: CleanDay = { id: uid(), date: dateKey(), ts: Date.now(), amount, lines: convert(amount, settings.itemPrices) }
    setCleanDays((prev) => [d, ...prev])
    return d
  }, [cleanDays, settings.dailySpend, settings.itemPrices, setCleanDays])

  const addCraving = useCallback((): CravingResult => {
    const key = dateKey()
    const total = cravings.total + 1
    setCravings({ total, byDate: { ...cravings.byDate, [key]: (cravings.byDate[key] ?? 0) + 1 } })

    const messages = getMessages()
    let i: number
    do i = Math.floor(Math.random() * messages.length)
    while (i === lastMsg.current && messages.length > 1)
    lastMsg.current = i

    const isNew = total <= ANIMALS.length
    const ai = isNew ? total - 1 : Math.floor(Math.random() * ANIMALS.length)
    const animal = { emoji: ANIMALS[ai].emoji, name: animalName(ai) }
    return { message: messages[i], animal, isNew, levelUp: isLevelUp(total), total }
  }, [cravings, setCravings])

  const deletePurchase = (id: string) => setPurchases((p) => p.filter((x) => x.id !== id))
  const deleteCleanDay = (id: string) => setCleanDays((p) => p.filter((x) => x.id !== id))

  const resetAll = () => {
    resetSettings()
    resetPurchases()
    resetCleanDays()
    resetCravings()
  }

  return {
    settings, setSettings,
    purchases, cleanDays, cravings,
    cleanToday, todayCravings: cravings.byDate[today] ?? 0,
    addPurchase, rerollPurchase, addCleanDay, addCraving,
    deletePurchase, deleteCleanDay, resetAll,
  }
}

export type AppData = ReturnType<typeof useAppData>
