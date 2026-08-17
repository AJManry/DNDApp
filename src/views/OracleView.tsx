import { useMemo, useState } from 'react'
import { allLore } from '../data/corpus'
import { searchLore } from '../lib/search'
import { useSagekeep } from '../state/store'
import type { LoreKind } from '../types'

const KINDS: { id: LoreKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'location', label: 'Places' },
  { id: 'npc', label: 'People' },
  { id: 'item', label: 'Items' },
  { id: 'creature', label: 'Beasts' },
  { id: 'scene', label: 'Scenes' },
  { id: 'lore', label: 'Lore' },
  { id: 'rule', label: 'Rules' },
  { id: 'custom', label: 'Yours' },
]

const SUGGESTIONS = [
  'Who is Lord Vaelith?',
  'Where is the Echo Flute?',
  'How does the Twilight Clock work?',
  'Temple of the Green Blade puzzles',
  'Create a lakeside shrine to a sky whale',
  'Map of a mossfolk village in giant roots',
]

export function OracleView() {
  const { state, dispatch } = useSagekeep()
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('all')
  const corpus = useMemo(() => allLore(state.customLore), [state.customLore])
  const liveHits = useMemo(() => {
    const hits = searchLore(corpus, state.oracleQuery || lastUserQuery(state), 10)
    if (kind === 'all') return hits
    return hits.filter((h) => h.entry.kind === kind)
  }, [corpus, state, kind])

  return (
    <div className="oracle">
      <div className="oracle-chat">
        <div className="oracle-intro">
          <img src="/art/portrait-sage-nerin.jpg" alt="Sage Nerin" />
          <div>
            <h1>Oracle of Eldara</h1>
            <p>
              This is the in-app Cursor for worldbuilding. Search the bible, ask who/what/where, or invent new
              places — they become searchable. Map-shaped prompts jump to the Maps tab and paint the world.
            </p>
          </div>
        </div>
        <div className="chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => dispatch({ type: 'ask', query: s })}>
              {s}
            </button>
          ))}
        </div>
        <div className="thread">
          {state.oracleThread.length === 0 ? (
            <p className="empty">Ask anything about Windfall, the verses, Vaelith, pacing, or the temple keys.</p>
          ) : (
            state.oracleThread.map((m) => (
              <div key={m.id} className={`bubble ${m.role}`}>
                <RichText text={m.text} />
                {m.mapPrompt ? (
                  <button className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'maps' })}>
                    Open Maps
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ type: 'ask', query: state.oracleQuery })
          }}
        >
          <textarea
            rows={3}
            value={state.oracleQuery}
            onChange={(e) => dispatch({ type: 'query', query: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                dispatch({ type: 'ask', query: state.oracleQuery })
              }
            }}
            placeholder="Ask about the world, or say “create a…” to weave new lore…"
          />
          <button type="submit">Consult</button>
        </form>
      </div>
      <aside className="oracle-hits">
        <div className="kind-row">
          {KINDS.map((k) => (
            <button key={k.id} className={kind === k.id ? 'active' : ''} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
        <ul className="hit-list">
          {(state.oracleQuery ? liveHits : searchLore(corpus, 'eldara waking song', 8).concat(liveHits))
            .filter((h, i, arr) => arr.findIndex((x) => x.entry.id === h.entry.id) === i)
            .filter((h) => (kind === 'all' ? true : h.entry.kind === kind))
            .slice(0, 12)
            .map((h) => (
              <li key={h.entry.id}>
                <button onClick={() => dispatch({ type: 'ask', query: h.entry.title })}>
                  <span className="kind">{h.entry.kind}</span>
                  <strong>{h.entry.title}</strong>
                  <p>{h.snippet || h.entry.summary}</p>
                </button>
              </li>
            ))}
        </ul>
      </aside>
    </div>
  )
}

function lastUserQuery(state: { oracleQuery: string; oracleThread: { role: string; text: string }[] }): string {
  if (state.oracleQuery.trim()) return state.oracleQuery
  const last = [...state.oracleThread].reverse().find((m) => m.role === 'user')
  return last?.text ?? 'eldara'
}

function RichText({ text }: { text: string }) {
  return (
    <div className="rich">
      {text.split('\n').map((line, i) => (
        <p key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
            chunk.startsWith('**') ? <strong key={j}>{chunk.slice(2, -2)}</strong> : <span key={j}>{chunk}</span>,
          )}
        </p>
      ))}
    </div>
  )
}
