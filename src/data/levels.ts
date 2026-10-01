export interface Level {
  at: number
  name: string
  emoji: string
}

export const START_LEVEL: Level = { at: 0, name: 'Výletnice', emoji: '🧳' }

export const LEVELS: Level[] = [
  { at: 5, name: 'Plážová začátečnice', emoji: '🏖️' },
  { at: 15, name: 'Surfařka', emoji: '🏄‍♀️' },
  { at: 30, name: 'Strážkyně pralesa', emoji: '🌿' },
  { at: 50, name: 'Pura Vida legenda', emoji: '👑' },
]

export function levelFor(total: number): { current: Level; next: Level | null } {
  let current = START_LEVEL
  for (const l of LEVELS) if (total >= l.at) current = l
  const next = LEVELS.find((l) => l.at > total) ?? null
  return { current, next }
}

export const isLevelUp = (total: number) => LEVELS.some((l) => l.at === total)
