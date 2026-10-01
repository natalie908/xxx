import { useEffect, useState } from 'react'
import { Body } from './components/Body'
import { Album } from './components/Album'
import { BottomNav, type Tab } from './components/BottomNav'
import { Home } from './components/Home'
import { Overview } from './components/Overview'
import { Settings } from './components/Settings'
import { TextEditor } from './components/TextEditor'
import { useAppData } from './hooks/useAppData'
import { useTextsVersion } from './lib/texts'

export default function App() {
  const data = useAppData()
  const [tab, setTab] = useState<Tab>('home')
  const [editing, setEditing] = useState(false)
  useTextsVersion() // po úpravě textů překreslí celou appku

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setEditing((v) => !v)
      } else if (e.key === 'Escape') setEditing(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="pb-28">
      {tab === 'home' && <Home data={data} />}
      {tab === 'body' && <Body data={data} />}
      {tab === 'album' && <Album data={data} />}
      {tab === 'overview' && <Overview data={data} />}
      {tab === 'settings' && <Settings data={data} onEditTexts={() => setEditing(true)} />}
      <BottomNav tab={tab} onChange={setTab} />
      {editing && <TextEditor onClose={() => setEditing(false)} />}
    </div>
  )
}
