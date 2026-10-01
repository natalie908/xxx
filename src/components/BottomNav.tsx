export type Tab = 'home' | 'album' | 'overview' | 'settings'

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'home', emoji: '🏠', label: 'Domů' },
  { id: 'album', emoji: '🦥', label: 'Album' },
  { id: 'overview', emoji: '📊', label: 'Přehled' },
  { id: 'settings', emoji: '⚙️', label: 'Nastavení' },
]

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center bg-white/90 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-8px_rgba(7,94,102,.3)]">
      <div className="flex w-full max-w-md">
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={active ? 'page' : undefined}
              className="press flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              <span className={`flex h-9 w-14 items-center justify-center rounded-full text-2xl transition ${active ? 'bg-sea-100' : ''}`}>
                {t.emoji}
              </span>
              <span className={`text-[11px] font-semibold ${active ? 'text-sea-600' : 'text-ink/50'}`}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
