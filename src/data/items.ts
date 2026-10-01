export interface Item {
  id: string
  emoji: string
  name: string
  price: number
}

// Celé položky + malé položky / komponenty. Ubytování, letenky, snídaně, auto a benzín schválně nejsou.
export const ITEMS: Item[] = [
  { id: 'soda', emoji: '🍛', name: 'večeře v sodě (casado)', price: 220 },
  { id: 'restaurant', emoji: '🍽️', name: 'večeře v restauraci', price: 450 },
  { id: 'streetfood', emoji: '🌮', name: 'oběd / street food', price: 150 },
  { id: 'park', emoji: '🌳', name: 'vstup do národního parku', price: 450 },
  { id: 'repellent', emoji: '🦟', name: 'repelent', price: 250 },
  { id: 'sunscreen', emoji: '🧴', name: 'opalovací krém', price: 400 },
  { id: 'souvenir', emoji: '🎁', name: 'přívěšek / suvenýr', price: 300 },
  { id: 'airport', emoji: '🚕', name: 'doprava na letiště', price: 600 },
  { id: 'bus', emoji: '🚌', name: 'místní autobus', price: 40 },

  { id: 'rice', emoji: '🍚', name: 'rýže s fazolemi', price: 50 },
  { id: 'maduros', emoji: '🍌', name: 'smažené plantainy', price: 40 },
  { id: 'chicken', emoji: '🍗', name: 'kuřecí do casada', price: 90 },
  { id: 'tortilla', emoji: '🫓', name: 'tortilla', price: 15 },
  { id: 'empanada', emoji: '🥟', name: 'empanada', price: 45 },
  { id: 'water', emoji: '💧', name: 'láhev vody', price: 30 },
  { id: 'beer', emoji: '🍺', name: 'pivo Imperial', price: 70 },
  { id: 'coconut', emoji: '🥥', name: 'čerstvý kokos', price: 50 },
  { id: 'smoothie', emoji: '🥤', name: 'smoothie / batido', price: 80 },
  { id: 'icecream', emoji: '🍦', name: 'zmrzlina', price: 70 },
  { id: 'coffee', emoji: '☕', name: 'káva', price: 60 },
  { id: 'pineapple', emoji: '🍍', name: 'ananas z trhu', price: 40 },
  { id: 'postcard', emoji: '💌', name: 'pohlednice', price: 25 },
  { id: 'bracelet', emoji: '📿', name: 'náramek z korálků', price: 80 },
  { id: 'patches', emoji: '🩹', name: 'náplasti na štípance', price: 60 },
  { id: 'tuktuk', emoji: '🛺', name: 'jízda tuk-tukem', price: 100 },
]

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]))
