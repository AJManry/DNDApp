import { useEffect, useRef, useState } from 'react'
import { JournalView } from './views/JournalView'
import { MapsView } from './views/MapsView'
import { OracleView } from './views/OracleView'
import { PartyView } from './views/PartyView'
import { PlayView } from './views/PlayView'
import { SagekeepProvider, useSagekeep } from './state/store'
import type { TabId } from './types'

const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: 'play', label: 'Table', hint: 'Run the one-shot' },
  { id: 'oracle', label: 'Oracle', hint: 'Ask the world' },
  { id: 'maps', label: 'Maps', hint: 'Paint the Green' },
  { id: 'party', label: 'Party', hint: 'HP, skills, gear' },
  { id: 'journal', label: 'Chronicle', hint: 'Notes & recap' },
]

function Shell() {
  const { state, dispatch } = useSagekeep()
  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const elapsed = formatElapsed(state.sessionElapsedMs)

  return (
    <div className="app">
      <aside className="rail">
        <div className="brand">
          <img src="/art/sagekeep-emblem.jpg" alt="" className="emblem" />
          <div>
            <div className="brand-name">Sagekeep</div>
            <div className="brand-tag">Dungeon Master’s table</div>
          </div>
        </div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={state.tab === t.id ? 'tab active' : 'tab'}
              onClick={() => dispatch({ type: 'tab', tab: t.id })}
            >
              <span>{t.label}</span>
              <small>{t.hint}</small>
            </button>
          ))}
        </nav>
        <div className="rail-foot">
          <div className="clock-readout">
            <span>Session</span>
            <strong>{elapsed}</strong>
          </div>
          <button
            className="ghost"
            onClick={() => dispatch({ type: 'start-session' })}
          >
            {state.sessionStartedAt ? 'Restart timer' : 'Start 3-hour clock'}
          </button>
        </div>
      </aside>
      <main className="stage">
        <header className="topbar">
          <form
            className="omni"
            onSubmit={(e) => {
              e.preventDefault()
              const q = search.trim()
              if (!q) return
              dispatch({ type: 'tab', tab: 'oracle' })
              dispatch({ type: 'ask', query: q })
              setSearch('')
            }}
          >
            <span className="omni-kicker">Ask Cursor / the Sage</span>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Eldara, invent a village, or describe a map…  (press /)"
              aria-label="World search and worldbuilding"
            />
            <button type="submit">Ask</button>
          </form>
          <label className="secrets-toggle">
            <input
              type="checkbox"
              checked={state.secretsRevealed}
              onChange={(e) => dispatch({ type: 'secrets', value: e.target.checked })}
            />
            DM secrets
          </label>
        </header>
        <section className="panel">
          {state.tab === 'play' && <PlayView />}
          {state.tab === 'oracle' && <OracleView />}
          {state.tab === 'maps' && <MapsView />}
          {state.tab === 'party' && <PartyView />}
          {state.tab === 'journal' && <JournalView />}
        </section>
      </main>
    </div>
  )
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function App() {
  return (
    <SagekeepProvider>
      <Shell />
    </SagekeepProvider>
  )
}
