import type { Uses } from '../lib/types'

// Zdravotní fakta: POUZE tyto, přesně podle zadání (obecné informace podle NHS a CDC).
// Nic sem nepřidávej ani nepřeformulovávej bez ověření zdroje.
export type Applies = 'all' | 'cigs' | 'vape'

export interface HealthFact {
  id: string
  applies: Applies // all = nikotin (cigarety i vape)
  emoji: string
  title: string // nadpis výhry
  short: string // text do počítadla: „14× …“
  text: string
}

export const FACTS: HealthFact[] = [
  { id: 'heart', applies: 'all', emoji: '💓', title: 'Srdce nemuselo zrychlit', short: 'tvoje srdce nemuselo zrychlit', text: 'Nikotin zvyšuje tep zhruba o 10–20 úderů za minutu.' },
  { id: 'pressure', applies: 'all', emoji: '🩺', title: 'Tlak nemusel vyskočit', short: 'tvůj tlak nemusel vyskočit', text: 'Nikotin krátkodobě zvyšuje krevní tlak.' },
  { id: 'vessels', applies: 'all', emoji: '🥶', title: 'Cévy se nemusely stáhnout', short: 'tvoje cévy se nemusely stáhnout', text: 'Nikotin zužuje cévy, proto bývají studené ruce a nohy.' },
  { id: 'adrenaline', applies: 'all', emoji: '⚡', title: 'Žádný nával adrenalinu', short: 'žádný nával adrenalinu', text: 'Nikotin spouští vyplavení adrenalinu.' },
  { id: 'sleep', applies: 'all', emoji: '😴', title: 'Klidnější spánek', short: 'klidnější spánek', text: 'Nikotin je stimulant a večer zhoršuje usínání.' },
  { id: 'skin', applies: 'all', emoji: '🌸', title: 'Kůže a hojení', short: 'kůže a hojení', text: 'Zúžené cévy znamenají méně krve a kyslíku pro kůži a hojení.' },

  { id: 'co', applies: 'cigs', emoji: '🩸', title: 'Víc kyslíku v krvi', short: 'víc kyslíku v krvi', text: 'Oxid uhelnatý z kouře se váže na hemoglobin místo kyslíku.' },
  { id: 'cilia', applies: 'cigs', emoji: '🌬️', title: 'Řasinky v plicích můžou pracovat', short: 'řasinky v plicích mohly pracovat', text: 'Kouř zpomaluje řasinky, které čistí dýchací cesty.' },
  { id: 'tar', applies: 'cigs', emoji: '🫁', title: 'Žádný dehet v plicích', short: 'žádný dehet v plicích', text: 'S každou cigaretou se do plic dostává dehet.' },
  { id: 'teeth', applies: 'cigs', emoji: '🦷', title: 'Zuby a dech', short: 'zuby a dech', text: 'Kouř barví zuby a způsobuje zápach z úst.' },

  { id: 'airways', applies: 'vape', emoji: '🍃', title: 'Dýchací cesty v klidu', short: 'dýchací cesty v klidu', text: 'Aerosol z vapu dráždí dýchací cesty.' },
]

export const factsFor = (uses: Uses): HealthFact[] =>
  FACTS.filter((f) => f.applies === 'all' || uses === 'both' || f.applies === uses)

export interface Milestone {
  id: string
  minutes: number // kdy se milník „rozsvítí“ (u rozsahů dolní hranice)
  label: string
  icon: string
  text: string // zdravotní tvrzení (NHS)
  costa: string // propojení s Kostarikou, bez nových zdravotních tvrzení
}

const D = 24 * 60

export const MILESTONES: Milestone[] = [
  { id: '20m', minutes: 20, label: '20 minut', icon: '💓', text: 'Tep a tlak se vracejí k normálu.', costa: 'První malý krok na cestě k pláži 🏖️' },
  { id: '8h', minutes: 8 * 60, label: '8 hodin', icon: '🩸', text: 'Hladina oxidu uhelnatého v krvi klesne na polovinu a hladina kyslíku se vrací k normálu.', costa: 'Čas pomalu plánovat trasu po národních parcích 🗺️' },
  { id: '48h', minutes: 48 * 60, label: '48 hodin', icon: '👃', text: 'Oxid uhelnatý je z těla pryč, plíce začínají čistit hlen, zlepšuje se chuť a čich.', costa: 'Casado ti bude chutnat víc 🍛' },
  { id: '72h', minutes: 72 * 60, label: '72 hodin', icon: '⚡', text: 'Dýchá se snáz, přibývá energie.', costa: 'Výšlap k sopce s lepším dechem 🌋' },
  { id: '2w', minutes: 14 * D, label: '2–12 týdnů', icon: '🔄', text: 'Zlepšuje se krevní oběh.', costa: 'Šnorchlování s lepší kondicí 🤿' },
  { id: '3m', minutes: 91 * D, label: '3–9 měsíců', icon: '🫁', text: 'Ustupuje kašel a dušnost, plicní funkce se zlepšuje až o 10 %.', costa: 'Na další cestu za dobrodružstvím už můžeš pomalu spořit 🌎' },
  { id: '1y', minutes: 365 * D, label: '1 rok', icon: '🏆', text: 'Riziko srdečních onemocnění je zhruba poloviční oproti kuřákům.', costa: 'Za rok si připiješ kokosem na tuhle cestu 🥥' },
]

export const NEUTRAL_MESSAGES = [
  'Nevadí, jedeme dál 🌊',
  'Stává se. Nová vlna se už rozjíždí 🏄‍♀️',
  'Žádný problém, odpočet jede znovu od nuly 🌴',
]
