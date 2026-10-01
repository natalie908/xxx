// Texty v appce, které jdou měnit v editoru (Ctrl+E)
export const UI_DEFAULTS = {
  tagline: 'Kostarika, listopad – dva týdny bez výčitek.',
  cravingButton: 'tpc to byla vlna',
  cravingHint: 'klepni pokaždé, když to zvládneš',
  buyTitle: 'Tohle sis právě vzala z Kostariky:',
  buyFooter: 'Žádný stres, další chuť zvládneš přepést 🌊',
  cleanTitle: 'Tohle sis dnes zachránila na Kostariku:',
  cleanFooter: 'Pura vida! Dnešek je tvůj ☀️',
} as const

export type UiKey = keyof typeof UI_DEFAULTS

export const UI_LABELS: Record<UiKey, string> = {
  tagline: 'Podtitulek nahoře na Domů',
  cravingButton: 'Hlavní text tlačítka s vlnou na Domů',
  cravingHint: 'Popisek pod tlačítkem „Ustála jsem chuť“',
  buyTitle: 'Nadpis karty po nákupu',
  buyFooter: 'Věta pod kartou po nákupu',
  cleanTitle: 'Nadpis karty po dni bez nikotinu',
  cleanFooter: 'Věta pod kartou po dni bez nikotinu',
}
