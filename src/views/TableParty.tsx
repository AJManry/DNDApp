import { formatMod, skillBonus } from '../data/skills'
import { normalizeCharacter } from '../lib/combatKit'
import { useHyrule } from '../state/store'
import type { Character } from '../types'
import { HpBar } from './HpBar'

export function TableParty() {
  const { state, dispatch } = useHyrule()
  const selected = state.party.find((c) => c.id === state.selectedCharacterId) ?? state.party[0]

  if (!state.party.length) {
    return (
      <section className="table-party">
        <header className="table-party-head">
          <div>
            <p className="kicker">Party</p>
            <h2>No adventurers at the table</h2>
          </div>
          <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'party' })}>
            Forge a hero
          </button>
        </header>
        <p className="hint">Add someone on Party, then come back here to track hit points and skills without leaving the scene.</p>
      </section>
    )
  }

  return (
    <section className="table-party">
      <header className="table-party-head">
        <div>
          <p className="kicker">Party</p>
          <h2>Hit points and skills</h2>
        </div>
        <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'party' })}>
          Full sheets
        </button>
      </header>
      <div className="table-party-cards">
        {state.party.map((c) => {
          const card = normalizeCharacter(c)
          const active = card.id === selected?.id
          return (
            <article
              key={card.id}
              className={`table-party-card${active ? ' active' : ''}${card.hp.current <= 0 ? ' down' : ''}`}
            >
              <button
                type="button"
                className="table-party-select"
                onClick={() => dispatch({ type: 'select-character', id: card.id })}
              >
                <header>
                  <strong>{card.name}</strong>
                  <span>{card.virtue ?? '—'}</span>
                </header>
                <p>
                  {card.ancestry} {card.className} · AC {card.ac}
                </p>
              </button>
              <TableHp character={card} />
            </article>
          )
        })}
      </div>
      {selected ? <SkillStrip character={normalizeCharacter(selected)} /> : null}
    </section>
  )
}

function TableHp({ character }: { character: Character }) {
  const { dispatch } = useHyrule()
  const max = Math.max(1, Number(character.hp.max) || 1)
  const current = Number.isFinite(character.hp.current) ? character.hp.current : 0
  const setHp = (next: number) => {
    const hp = Math.max(0, Math.min(max, Math.round(next)))
    dispatch({ type: 'patch-character', id: character.id, patch: { hp: { ...character.hp, current: hp, max } } })
  }

  return (
    <div
      className="table-party-hp"
    >
      <button type="button" className="ghost" aria-label={`Damage ${character.name} by 5`} onClick={() => setHp(current - 5)}>
        −5
      </button>
      <button type="button" aria-label={`Damage ${character.name}`} onClick={() => setHp(current - 1)}>
        −
      </button>
      <HpBar hp={{ current, max }} />
      <button type="button" aria-label={`Heal ${character.name}`} onClick={() => setHp(current + 1)}>
        +
      </button>
    </div>
  )
}

function SkillStrip({ character }: { character: Character }) {
  const prof = 2
  const ready = [...character.skills].sort((a, b) => Number(b.proficient) - Number(a.proficient) || a.name.localeCompare(b.name))
  return (
    <div className="table-party-skills">
      <p>
        <strong>{character.name}</strong>
        <span> skills · proficiency +{prof}</span>
      </p>
      <ul>
        {ready.map((sk) => (
          <li key={sk.name} className={sk.proficient ? 'pro' : undefined}>
            <span>{sk.name}</span>
            <strong>{formatMod(skillBonus(sk, character.abilities, prof))}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
