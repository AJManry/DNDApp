import { useState } from 'react'
import { ALL_SKILLS, abilityMod, formatMod, skillBonus } from '../data/skills'
import { useHyrule } from '../state/store'
import type { Character, InventoryItem } from '../types'

const CONDITIONS = ['Blinded', 'Charmed', 'Frightened', 'Grappled', 'Poisoned', 'Prone', 'Restrained', 'Stunned']

export function PartyView() {
  const { state, dispatch } = useHyrule()
  const selected = state.party.find((c) => c.id === state.selectedCharacterId) ?? state.party[0]

  return (
    <div className="party">
      <div className="party-grid">
        {state.party.map((c) => (
          <button
            key={c.id}
            className={c.id === selected?.id ? 'pc-card active' : 'pc-card'}
            onClick={() => dispatch({ type: 'select-character', id: c.id })}
          >
            <header>
              <strong>{c.name}</strong>
              <span>{c.virtue ?? '—'}</span>
            </header>
            {c.portrait ? <img className="pc-portrait" src={c.portrait} alt="" /> : null}
            <p>
              {c.ancestry} {c.className}
            </p>
            <HpBar hp={c.hp} />
            <div className="mini-stats">
              <span>AC {c.ac}</span>
              <span>Spd {c.speed}</span>
              <span>{c.inspiration ? 'Inspired' : '—'}</span>
            </div>
          </button>
        ))}
        <button className="pc-card add" onClick={() => dispatch({ type: 'add-character', character: blankHero() })}>
          + New adventurer
        </button>
      </div>
      {selected ? <Sheet character={selected} /> : null}
    </div>
  )
}

function HpBar({ hp }: { hp: { current: number; max: number } }) {
  const pct = hp.max <= 0 ? 0 : Math.max(0, Math.min(100, (hp.current / hp.max) * 100))
  return (
    <div className="hp">
      <div className="hp-fill" style={{ width: `${pct}%` }} />
      <span>
        {hp.current}/{hp.max} hp
      </span>
    </div>
  )
}

function Sheet({ character }: { character: Character }) {
  const { dispatch } = useHyrule()
  const [itemName, setItemName] = useState('')
  const prof = 2
  const patch = (p: Partial<Character>) => dispatch({ type: 'patch-character', id: character.id, patch: p })

  return (
    <div className="sheet">
      <div className="sheet-top">
        <label>
          Name
          <input value={character.name} onChange={(e) => patch({ name: e.target.value })} />
        </label>
        <label>
          Ancestry
          <input value={character.ancestry} onChange={(e) => patch({ ancestry: e.target.value })} />
        </label>
        <label>
          Class
          <input value={character.className} onChange={(e) => patch({ className: e.target.value })} />
        </label>
        <label>
          Virtue
          <select
            value={character.virtue ?? ''}
            onChange={(e) =>
              patch({ virtue: (e.target.value || undefined) as Character['virtue'] })
            }
          >
            <option value="">—</option>
            <option>Courage</option>
            <option>Wisdom</option>
            <option>Power</option>
          </select>
        </label>
      </div>
      <div className="hp-edit">
        <button onClick={() => patch({ hp: { ...character.hp, current: Math.max(0, character.hp.current - 1) } })}>
          −
        </button>
        <HpBar hp={character.hp} />
        <button
          onClick={() =>
            patch({ hp: { ...character.hp, current: Math.min(character.hp.max, character.hp.current + 1) } })
          }
        >
          +
        </button>
        <label>
          Max
          <input
            type="number"
            value={character.hp.max}
            onChange={(e) => {
              const max = Number(e.target.value) || 0
              patch({ hp: { max, current: Math.min(character.hp.current, max) } })
            }}
          />
        </label>
        <label>
          AC
          <input
            type="number"
            value={character.ac}
            onChange={(e) => patch({ ac: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={character.inspiration}
            onChange={(e) => patch({ inspiration: e.target.checked })}
          />
          Inspiration
        </label>
      </div>
      <div className="abilities">
        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((ab) => (
          <label key={ab}>
            {ab.toUpperCase()}
            <input
              type="number"
              value={character.abilities[ab]}
              onChange={(e) =>
                patch({
                  abilities: { ...character.abilities, [ab]: Number(e.target.value) || 0 },
                })
              }
            />
            <span>{formatMod(abilityMod(character.abilities[ab]))}</span>
          </label>
        ))}
      </div>
      <div className="split">
        <section>
          <h3>Skills</h3>
          <ul className="skills">
            {character.skills.map((sk) => (
              <li key={sk.name}>
                <label>
                  <input
                    type="checkbox"
                    checked={sk.proficient}
                    onChange={(e) =>
                      patch({
                        skills: character.skills.map((s) =>
                          s.name === sk.name ? { ...s, proficient: e.target.checked } : s,
                        ),
                      })
                    }
                  />
                  {sk.name}
                </label>
                <strong>{formatMod(skillBonus(sk, character.abilities, prof))}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Inventory</h3>
          <ul className="inventory">
            {character.inventory.map((it) => (
              <li key={it.id}>
                <input
                  value={it.name}
                  onChange={(e) =>
                    dispatch({
                      type: 'patch-item',
                      characterId: character.id,
                      itemId: it.id,
                      patch: { name: e.target.value },
                    })
                  }
                />
                <input
                  className="qty"
                  type="number"
                  value={it.qty}
                  onChange={(e) =>
                    dispatch({
                      type: 'patch-item',
                      characterId: character.id,
                      itemId: it.id,
                      patch: { qty: Number(e.target.value) || 0 },
                    })
                  }
                />
                <select
                  value={it.rarity}
                  onChange={(e) =>
                    dispatch({
                      type: 'patch-item',
                      characterId: character.id,
                      itemId: it.id,
                      patch: { rarity: e.target.value as InventoryItem['rarity'] },
                    })
                  }
                >
                  <option>common</option>
                  <option>uncommon</option>
                  <option>rare</option>
                  <option>legendary</option>
                  <option>story</option>
                </select>
                <button
                  className="ghost"
                  onClick={() =>
                    dispatch({ type: 'remove-item', characterId: character.id, itemId: it.id })
                  }
                >
                  ×
                </button>
                <textarea
                  value={it.notes}
                  placeholder="Notes"
                  onChange={(e) =>
                    dispatch({
                      type: 'patch-item',
                      characterId: character.id,
                      itemId: it.id,
                      patch: { notes: e.target.value },
                    })
                  }
                />
              </li>
            ))}
          </ul>
          <form
            className="add-item"
            onSubmit={(e) => {
              e.preventDefault()
              if (!itemName.trim()) return
              dispatch({
                type: 'add-item',
                characterId: character.id,
                item: {
                  id: `it-${Date.now()}`,
                  name: itemName.trim(),
                  qty: 1,
                  rarity: 'common',
                  notes: '',
                },
              })
              setItemName('')
            }}
          >
            <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Add item…" />
            <button type="submit">Add</button>
          </form>
          <h3>Conditions</h3>
          <div className="chips">
            {CONDITIONS.map((c) => {
              const on = character.conditions.includes(c)
              return (
                <button
                  key={c}
                  className={on ? 'on' : ''}
                  onClick={() =>
                    patch({
                      conditions: on
                        ? character.conditions.filter((x) => x !== c)
                        : [...character.conditions, c],
                    })
                  }
                >
                  {c}
                </button>
              )
            })}
          </div>
          <h3>Death saves</h3>
          <div className="death">
            <span>Success {character.deathSaves.success}/3</span>
            <button
              onClick={() =>
                patch({
                  deathSaves: {
                    ...character.deathSaves,
                    success: Math.min(3, character.deathSaves.success + 1),
                  },
                })
              }
            >
              +S
            </button>
            <span>Fail {character.deathSaves.fail}/3</span>
            <button
              onClick={() =>
                patch({
                  deathSaves: {
                    ...character.deathSaves,
                    fail: Math.min(3, character.deathSaves.fail + 1),
                  },
                })
              }
            >
              +F
            </button>
            <button onClick={() => patch({ deathSaves: { success: 0, fail: 0 } })}>Reset</button>
          </div>
          <label className="notes">
            Character notes
            <textarea value={character.notes} onChange={(e) => patch({ notes: e.target.value })} />
          </label>
          <button className="danger" onClick={() => dispatch({ type: 'remove-character', id: character.id })}>
            Remove from party
          </button>
        </section>
      </div>
    </div>
  )
}

function blankHero(): Character {
  return {
    id: `pc-${Date.now()}`,
    name: 'New adventurer',
    ancestry: 'Hylian',
    className: 'Fighter 3',
    level: 3,
    hp: { current: 22, max: 22 },
    ac: 15,
    speed: 30,
    abilities: { str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8 },
    skills: ALL_SKILLS.map((s) => ({ ...s })),
    inventory: [],
    conditions: [],
    inspiration: false,
    deathSaves: { success: 0, fail: 0 },
    notes: '',
  }
}
