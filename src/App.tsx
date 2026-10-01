import { useState } from 'react'
import { Album } from './components/Album'
import { BottomNav, type Tab } from './components/BottomNav'
import { Home } from './components/Home'
import { Overview } from './components/Overview'
import { Settings } from './components/Settings'
import { useAppData } from './hooks/useAppData'

export default function App() {
  const data = useAppData()
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="pb-28">
      {tab === 'home' && <Home data={data} />}
      {tab === 'album' && <Album data={data} />}
      {tab === 'overview' && <Overview data={data} />}
      {tab === 'settings' && <Settings data={data} />}
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
