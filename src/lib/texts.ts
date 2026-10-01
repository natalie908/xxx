import { useSyncExternalStore } from 'react'
import { ANIMALS } from '../data/animals'
import { ITEM_BY_ID } from '../data/items'
import { MESSAGES } from '../data/messages'
import { UI_DEFAULTS, type UiKey } from '../data/ui'

/** Vlastní texty uživatelky přepisují výchozí z data/. Ukládá se do localStorage. */
export interface Overrides {
  messages?: string[]
  animals: Record<number, string>
  levels: Record<number, string> // klíč = práh levelu
  items: Record<string, string>
  ui: Partial<Record<UiKey, string>>
}

const KEY = 'pvf.texts'
const empty = (): Overrides => ({ animals: {}, levels: {}, items: {}, ui: {} })

function load(): Overrides {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || 'null') }
  } catch {
    return empty()
  }
}

let state = load()
const subs = new Set<() => void>()

export function updateTexts(fn: (o: Overrides) => Overrides) {
  state = fn(state)
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* úložiště plné / zakázané */
  }
  subs.forEach((f) => f())
}

/** Zavolat v kořenové komponentě, ať se po úpravě textů překreslí celá appka. */
export const useTextsVersion = () =>
  useSyncExternalStore(
    (cb) => (subs.add(cb), () => subs.delete(cb)),
    () => state,
  )

export const getOverrides = () => state
export const getMessages = () => (state.messages?.length ? state.messages : MESSAGES)
export const animalName = (i: number) => state.animals[i] || ANIMALS[i].name
export const levelName = (at: number, fallback: string) => state.levels[at] || fallback
export const itemName = (id: string) => state.items[id] || ITEM_BY_ID[id].name
export const ui = (k: UiKey) => state.ui[k] || UI_DEFAULTS[k]
