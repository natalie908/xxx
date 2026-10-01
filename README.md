# Pura Vida Fund 🌴

Mobilní PWA (React + TypeScript + Vite + Tailwind): nákup nikotinu se přepočte na věci z Kostariky, které si za to nekoupíš; ustálená chuť = konfety, hlášky a sbírka zvířátek. Bez backendu, data jsou v `localStorage`.

## Lokálně
```bash
npm install
npm run dev        # vývoj, http://localhost:5173 (--host: dostupné i z mobilu v LAN)
npm run build      # produkční build do dist/ (včetně kontroly typů)
npm run preview    # náhled buildu (service worker funguje jen v buildu)
```

## Nasazení
- **Vercel**: `vercel` v kořeni projektu, nebo naimportuj repo na vercel.com. Framework Vite, build `npm run build`, výstup `dist`.
- **Netlify**: stejné nastavení, nebo přetáhni složku `dist/` na app.netlify.com/drop.

Po otevření na telefonu: Sdílet → *Přidat na plochu* (iOS Safari) / menu → *Nainstalovat aplikaci* (Android Chrome).

## Struktura
`src/components` UI · `src/data` položky, hlášky, zvířátka, levely, výchozí hodnoty · `src/hooks` localStorage a stav · `src/lib` algoritmus přepočtu, efekty, datum.
