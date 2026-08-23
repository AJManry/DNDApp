import { useMemo, useState } from 'react'
import { buildHandout, type HandoutAttack, type PlayerHandout } from '../lib/handout'
import { useHyrule } from '../state/store'

export function HandoutsView() {
  const { state } = useHyrule()
  const [onlyId, setOnlyId] = useState<string>('all')
  const sheets = useMemo(() => {
    const party = onlyId === 'all' ? state.party : state.party.filter((c) => c.id === onlyId)
    return party.map(buildHandout)
  }, [onlyId, state.party])

  return (
    <div className="handouts">
      <div className="handouts-toolbar no-print">
        <div>
          <p className="kicker">Player sheets</p>
          <h1>Printable handouts</h1>
          <p className="lede">
            One page per adventurer: two attacks, two spells, the dice to roll, skills, and saves. Print these and put
            them at the seats.
          </p>
        </div>
        <div className="handouts-actions">
          <div className="chips">
            <button type="button" className={onlyId === 'all' ? 'on' : ''} onClick={() => setOnlyId('all')}>
              Whole party
            </button>
            {state.party.map((c) => (
              <button
                key={c.id}
                type="button"
                className={onlyId === c.id ? 'on' : ''}
                onClick={() => setOnlyId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button type="button" className="print-btn" onClick={() => window.print()}>
            Print {onlyId === 'all' ? `${sheets.length} sheets` : 'this sheet'}
          </button>
        </div>
      </div>
      {sheets.length === 0 ? <p className="empty">No adventurers to print. Forge one on the Party tab.</p> : null}
      <div className="handout-stack">
        {sheets.map((sheet) => (
          <HandoutCard key={sheet.id} sheet={sheet} />
        ))}
      </div>
    </div>
  )
}

function HandoutCard({ sheet }: { sheet: PlayerHandout }) {
  return (
    <article className="handout-card">
      <header className="handout-top">
        <div>
          <p className="handout-kicker">The Song of Time · player sheet</p>
          <h2>{sheet.name}</h2>
          <p>
            {sheet.subtitle}
            {sheet.virtue ? ` · Triforce of ${sheet.virtue}` : ''}
          </p>
        </div>
        <ul className="handout-vitals">
          <li>
            <span>HP</span>
            <strong>{sheet.hp}</strong>
          </li>
          <li>
            <span>AC</span>
            <strong>{sheet.ac}</strong>
          </li>
          <li>
            <span>Speed</span>
            <strong>{sheet.speed} ft</strong>
          </li>
          <li>
            <span>Prof</span>
            <strong>+{sheet.proficiency}</strong>
          </li>
        </ul>
      </header>
      <div className="handout-abilities">
        {sheet.abilities.map((ab) => (
          <div key={ab.key}>
            <span>{ab.key}</span>
            <strong>{ab.mod}</strong>
            <em>{ab.score}</em>
          </div>
        ))}
      </div>
      <section>
        <h3>Attacks — pick one and roll</h3>
        <MoveTable rows={sheet.attacks.filter((a) => a.kind !== 'spell')} empty="No attacks on this sheet yet." />
      </section>
      <section>
        <h3>Spells — pick one and roll</h3>
        <MoveTable rows={sheet.attacks.filter((a) => a.kind === 'spell')} empty="No spells on this sheet yet." />
      </section>
      <div className="handout-split">
        <section>
          <h3>Skills — roll the dice shown</h3>
          <ul className="handout-skills">
            {sheet.skills.map((sk) => (
              <li key={sk.name} className={sk.proficient ? 'pro' : ''}>
                <span>
                  {sk.proficient ? '● ' : ''}
                  {sk.name}
                  <small>{sk.ability}</small>
                </span>
                <strong>{sk.roll}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Saving throws</h3>
          <ul className="handout-saves">
            {sheet.saves.map((sv) => (
              <li key={sv.name} className={sv.proficient ? 'pro' : ''}>
                <span>
                  {sv.proficient ? '● ' : ''}
                  {sv.name}
                </span>
                <strong>{sv.roll}</strong>
              </li>
            ))}
          </ul>
          {sheet.tricks.length ? (
            <>
              <h3>Once-per-rest tricks</h3>
              <ul className="handout-tricks">
                {sheet.tricks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>
      <footer className="handout-how">
        <h3>How to roll</h3>
        <ol>
          {sheet.reminders.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </footer>
    </article>
  )
}

function MoveTable({ rows, empty }: { rows: HandoutAttack[]; empty: string }) {
  if (!rows.length) return <p className="handout-empty">{empty}</p>
  return (
    <table className="handout-table">
      <thead>
        <tr>
          <th>Do this</th>
          <th>Hit / save</th>
          <th>Damage dice</th>
          <th>Range</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <AttackRows key={`${row.name}-${row.hitRoll}`} row={row} />
        ))}
      </tbody>
    </table>
  )
}

function AttackRows({ row }: { row: HandoutAttack }) {
  return (
    <>
      <tr>
        <td>
          <strong>{row.name}</strong>
          <span className="kind-tag">{row.kind}</span>
        </td>
        <td className="die-cell">{row.hitRoll}</td>
        <td className="die-cell">
          {row.damageRoll}
          {row.damageText && row.damageText !== row.damageRoll ? (
            <small>{row.damageText.replace(row.damageRoll, '').trim()}</small>
          ) : null}
        </td>
        <td>{row.range || '—'}</td>
      </tr>
      <tr className="instruction">
        <td colSpan={4}>{row.instruction}</td>
      </tr>
    </>
  )
}
