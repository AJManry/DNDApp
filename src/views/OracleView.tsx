import { useEffect, useMemo, useState } from 'react'
import { allLore } from '../data/corpus'
import { asset } from '../lib/assets'
import {
  CURSOR_DASHBOARD_KEYS,
  cursorAgentUrl,
  isCursorProvider,
  verifyCursorApiKey,
} from '../lib/cursorAgent'
import { LLM_PRESETS, type LlmSettings } from '../lib/llm'
import { searchLore } from '../lib/search'
import { useHyrule } from '../state/store'
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
  'Who is Ganondorf, and how should I play him at the table?',
  'Where is the Ocarina of Time and what does a true note do?',
  'How does the Twilight Clock work if we linger in the Lost Woods?',
  'Walk me through the Forest Temple puzzles',
  'Create a lakeside shrine to Lord Jabu-Jabu that still hears the Song of Time',
  'Map of a Korok village in giant roots',
]

export function OracleView() {
  const { state, dispatch, askOracle, llmSettings, setLlmSettings } = useHyrule()
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('all')
  const [showModel, setShowModel] = useState(
    () => isCursorProvider(llmSettings) && !llmSettings.apiKey.trim(),
  )
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
          <img src={asset('art/portrait-impa.jpg')} alt="Impa" />
          <div>
            <h1>Oracle of Hyrule</h1>
            <p>
              Impa of the Sheikah answers through <strong>your Cursor Cloud Agent</strong>, searching this campaign repo
              and billing your Cursor tokens. Paste an API key once, then ask how to run a scene, invent a place, or
              describe a map.
            </p>
            <button className="ghost" type="button" onClick={() => setShowModel((v) => !v)}>
              {showModel ? 'Hide model settings' : 'Model settings'}
            </button>
          </div>
        </div>
        {showModel ? <ModelSettings settings={llmSettings} onSave={setLlmSettings} /> : null}
        <div className="chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} disabled={state.oracleBusy} onClick={() => askOracle(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="thread">
          {state.oracleThread.length === 0 ? (
            <p className="empty">Ask anything about Kakariko, the Triforce, Ganondorf, pacing, or the temple keys.</p>
          ) : (
            state.oracleThread.map((m) => (
              <div key={m.id} className={`bubble ${m.role}${m.pending ? ' pending' : ''}`}>
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
            askOracle(state.oracleQuery)
          }}
        >
          <textarea
            rows={3}
            value={state.oracleQuery}
            disabled={state.oracleBusy}
            onChange={(e) => dispatch({ type: 'query', query: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                askOracle(state.oracleQuery)
              }
            }}
            placeholder="Ask Impa… Cursor will search Hyrule’s bible"
          />
          <button type="submit" disabled={state.oracleBusy}>
            {state.oracleBusy ? 'Listening…' : 'Consult'}
          </button>
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
          {(state.oracleQuery ? liveHits : searchLore(corpus, 'hyrule song of time', 8).concat(liveHits))
            .filter((h, i, arr) => arr.findIndex((x) => x.entry.id === h.entry.id) === i)
            .filter((h) => (kind === 'all' ? true : h.entry.kind === kind))
            .slice(0, 12)
            .map((h) => (
              <li key={h.entry.id}>
                <button disabled={state.oracleBusy} onClick={() => askOracle(h.entry.title)}>
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

function ModelSettings({
  settings,
  onSave,
}: {
  settings: LlmSettings
  onSave: (settings: LlmSettings) => void
}) {
  const [draft, setDraft] = useState(settings)
  const [testMsg, setTestMsg] = useState('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    setDraft((current) =>
      current.cursorAgentId === settings.cursorAgentId
        ? current
        : { ...current, cursorAgentId: settings.cursorAgentId },
    )
  }, [settings.cursorAgentId])
  const cursor = isCursorProvider(draft)
  const presetId = LLM_PRESETS.find((p) => p.baseUrl === draft.baseUrl)?.id ?? 'custom'
  const sessionId = draft.cursorAgentId?.trim()

  return (
    <form
      className="llm-settings"
      onSubmit={(e) => {
        e.preventDefault()
        const repoChanged =
          draft.cursorRepoUrl !== settings.cursorRepoUrl || draft.cursorRef !== settings.cursorRef
        onSave({
          ...draft,
          cursorAgentId: repoChanged ? '' : draft.cursorAgentId,
        })
        setTestMsg('Saved in this browser.')
      }}
    >
      <p className="hint">
        Default is Cursor. Create a user API key at{' '}
        <a href={CURSOR_DASHBOARD_KEYS} target="_blank" rel="noreferrer">
          cursor.com/dashboard/api
        </a>
        . Keys stay in this browser. The first question starts a read-only Cloud Agent on this repo; later questions
        reuse that session.
      </p>
      <label>
        Preset
        <select
          value={presetId}
          onChange={(e) => {
            const preset = LLM_PRESETS.find((p) => p.id === e.target.value)
            if (preset) setDraft({ ...draft, baseUrl: preset.baseUrl, model: preset.model })
          }}
        >
          {LLM_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          <option value="custom">Custom OpenAI-compatible</option>
        </select>
      </label>
      {cursor ? (
        <>
          <label>
            Cursor API key
            <input
              type="password"
              autoComplete="off"
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              placeholder="crsr_…"
            />
          </label>
          <label>
            Model (optional)
            <input
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              placeholder="Leave blank for your Cursor default"
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={draft.cursorSearchRepo !== false}
              onChange={(e) => setDraft({ ...draft, cursorSearchRepo: e.target.checked })}
            />
            Search this GitHub repo with Cursor (recommended)
          </label>
          {draft.cursorSearchRepo !== false ? (
            <>
              <label>
                Repository
                <input
                  value={draft.cursorRepoUrl ?? ''}
                  onChange={(e) => setDraft({ ...draft, cursorRepoUrl: e.target.value })}
                />
              </label>
              <label>
                Branch
                <input
                  value={draft.cursorRef ?? ''}
                  onChange={(e) => setDraft({ ...draft, cursorRef: e.target.value })}
                />
              </label>
            </>
          ) : null}
          <label>
            Cursor API proxy (optional)
            <input
              value={draft.cursorProxyUrl ?? ''}
              onChange={(e) => setDraft({ ...draft, cursorProxyUrl: e.target.value })}
              placeholder="Leave blank. Local dev already uses /cursor-api"
            />
          </label>
          {sessionId ? (
            <p className="hint">
              Active Cursor session:{' '}
              <a href={cursorAgentUrl(sessionId)} target="_blank" rel="noreferrer">
                {sessionId}
              </a>
            </p>
          ) : (
            <p className="hint">No Cursor Oracle session yet. The next question will start one.</p>
          )}
        </>
      ) : (
        <>
          <label>
            Chat completions URL
            <input value={draft.baseUrl} onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })} />
          </label>
          <label>
            Model
            <input value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} />
          </label>
          <label>
            API key (optional)
            <input
              type="password"
              autoComplete="off"
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              placeholder="Leave blank for Puter / Pollinations"
            />
          </label>
        </>
      )}
      <div className="llm-actions">
        <button type="submit">Save model</button>
        {cursor ? (
          <button
            type="button"
            className="ghost"
            disabled={testing || !draft.apiKey.trim()}
            onClick={() => {
              setTesting(true)
              setTestMsg('')
              void verifyCursorApiKey(draft)
                .then((msg) => setTestMsg(msg))
                .catch((err: unknown) => {
                  setTestMsg(err instanceof Error ? err.message : 'Could not reach Cursor.')
                })
                .finally(() => setTesting(false))
            }}
          >
            {testing ? 'Testing…' : 'Test Cursor key'}
          </button>
        ) : null}
        {sessionId ? (
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const next = { ...draft, cursorAgentId: '' }
              setDraft(next)
              onSave(next)
              setTestMsg('Cleared the Cursor Oracle session. The next question starts a new agent.')
            }}
          >
            Reset Cursor session
          </button>
        ) : null}
      </div>
      {testMsg ? <p className="hint">{testMsg}</p> : null}
    </form>
  )
}

function lastUserQuery(state: { oracleQuery: string; oracleThread: { role: string; text: string }[] }): string {
  if (state.oracleQuery.trim()) return state.oracleQuery
  const last = [...state.oracleThread].reverse().find((m) => m.role === 'user')
  return last?.text ?? 'hyrule'
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
