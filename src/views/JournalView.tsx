import { CAMPAIGN, scenes } from '../data/campaign'
import { useSagekeep } from '../state/store'

export function JournalView() {
  const { state, dispatch } = useSagekeep()
  const recap = scenes
    .filter((s) => state.completedSceneIds.includes(s.id))
    .map((s) => `• ${s.title}: ${s.boxedText.slice(0, 120)}…`)
    .join('\n')

  return (
    <div className="journal">
      <div>
        <p className="kicker">Chronicle</p>
        <h1>Session notes</h1>
        <textarea
          className="journal-pad"
          value={state.journal}
          onChange={(e) => dispatch({ type: 'journal', text: e.target.value })}
          placeholder="What did the table do? Names they loved, clocks you advanced, promises you made…"
        />
        <div className="journal-actions">
          <button
            onClick={() =>
              dispatch({
                type: 'journal',
                text: `${state.journal}\n\n— Recap —\n${recap || 'No scenes checked yet.'}`,
              })
            }
          >
            Append recap from completed scenes
          </button>
          <button
            className="danger"
            onClick={() => {
              if (window.confirm('Reset Sagekeep table state? Party, maps, and notes will return to defaults.')) {
                dispatch({ type: 'reset' })
              }
            }}
          >
            Reset table
          </button>
        </div>
      </div>
      <aside>
        <h2>Custom lore</h2>
        {state.customLore.length === 0 ? (
          <p className="empty">Invent places in the Oracle (“create a…”) and they will gather here.</p>
        ) : (
          <ul className="custom-lore">
            {state.customLore.map((l) => (
              <li key={l.id}>
                <strong>{l.title}</strong>
                <p>{l.summary}</p>
              </li>
            ))}
          </ul>
        )}
        <h2>How to keep this in the cloud</h2>
        <p>
          Sagekeep stores the table in this browser. Commit the repo, push, and open it on another machine — the
          <em> module</em> travels with git. Party HP and invented lore stay on the device unless you copy the Chronicle
          into your notes. Continue worldbuilding with a Cursor Cloud Agent from any signed-in device at{' '}
          <a href="https://cursor.com/agents" target="_blank" rel="noreferrer">
            cursor.com/agents
          </a>
          .
        </p>
        <p className="fineprint">{CAMPAIGN.inspiration}</p>
      </aside>
    </div>
  )
}
