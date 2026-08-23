import { useState } from 'react'
import { abilityMod, formatMod, skillBonus } from '../data/skills'
import { generateCharacterFromPrompt, assembleCharacter } from '../lib/characterForge'
import { normalizeCharacter } from '../lib/combatKit'
import { CURSOR_DASHBOARD_KEYS } from '../lib/cursorAgent'
import { loadLlmSettings } from '../lib/llm'
import { useHyrule } from '../state/store'
import type { Character, CombatMove, InventoryItem } from '../types'

const CONDITIONS = ['Blinded', 'Charmed', 'Frightened', 'Grappled', 'Poisoned', 'Prone', 'Restrained', 'Stunned']

const SUGGESTIONS = [
  'A Gerudo swordswoman who left the desert after twilight took her sister',
  'A Zora prince from the Domain who followed the Song of Time inland',
  'A Rito sharpshooter from the Flight Range with a great eagle bow',
  'A Sheikah monk from Kakariko who still serves Impa in secret',
  'A Goron paladin of Death Mountain sworn to the Triforce of Power',
]

export function PartyView() {
  const { state, dispatch, llmSettings } = useHyrule()
  const selected = state.party.find((c) => c.id === state.selectedCharacterId) ?? state.party[0]
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const hasCursorKey = Boolean(llmSettings.apiKey.trim() || loadLlmSettings().apiKey.trim())

  async function generate(from = prompt) {
    const q = from.trim()
    if (!q || busy) return
    const settings = loadLlmSettings()
    if (!settings.apiKey.trim()) {
      setStatus('Paste a Cursor API key in Oracle → Model settings. Forge uses your Cursor Cloud Agent only.')
      return
    }
    setBusy(true)
    setStatus('Cursor is forging a 3rd-level sheet. This can take a minute…')
    setPrompt(q)
    try {
      const hero = normalizeCharacter(await generateCharacterFromPrompt(q))
      dispatch({ type: 'add-character', character: hero })
      setStatus(`Created ${hero.name}, ${hero.ancestry} ${hero.className}.`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Cursor could not forge that character.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="party">
      <section className="forge">
        <p className="kicker">Character creation</p>
        <h1>Forge an adventurer</h1>
        <p className="lede">
          Describe a Hyrulean in a sentence — ancestry, vocation, and a wound or hope. A Cursor Cloud Agent forges a
          3rd-level sheet with two attacks and two spells you can edit. It uses your Cursor API key from Oracle → Model
          settings, not Pollinations or another chat API.{' '}
          <a href={CURSOR_DASHBOARD_KEYS} target="_blank" rel="noreferrer">
            Get a key
          </a>
          .
        </p>
        <form
          className="forge-form"
          onSubmit={(e) => {
            e.preventDefault()
            void generate()
          }}
        >
          <textarea
            rows={3}
            value={prompt}
            disabled={busy}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A Gerudo swordswoman who left the desert after twilight took her sister…"
            aria-label="Character prompt"
          />
          <div className="forge-actions">
            <button type="submit" disabled={busy || !prompt.trim()}>
              {busy ? 'Cursor is forging…' : hasCursorKey ? 'Generate from prompt' : 'Add Cursor key to generate'}
            </button>
            <button
              type="button"
              className="ghost"
              disabled={busy}
              onClick={() => dispatch({ type: 'add-character', character: normalizeCharacter(blankHero()) })}
            >
              Blank sheet
            </button>
            <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'handouts' })}>
              Printable handouts
            </button>
          </div>
        </form>
        {status ? <p className="hint">{status}</p> : null}
        <div className="chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" disabled={busy} onClick={() => void generate(s)}>
              {s}
            </button>
          ))}
        </div>
      </section>
      <div className="party-grid">
        {state.party.map((c) => {
          const card = normalizeCharacter(c)
          return (
          <button
            key={card.id}
            className={card.id === selected?.id ? 'pc-card active' : 'pc-card'}
            onClick={() => dispatch({ type: 'select-character', id: card.id })}
          >
            <header>
              <strong>{card.name}</strong>
              <span>{card.virtue ?? '—'}</span>
            </header>
            {card.portrait ? <img className="pc-portrait" src={card.portrait} alt="" /> : null}
            <p>
              {card.ancestry} {card.className}
            </p>
            <HpBar hp={card.hp} />
            <div className="mini-stats">
              <span>AC {card.ac}</span>
              <span>Spd {card.speed}</span>
              <span>{card.inspiration ? 'Inspired' : '—'}</span>
            </div>
          </button>
          )
        })}
      </div>
      {selected ? <Sheet character={normalizeCharacter(selected)} /> : null}
    </div>
  )
}

function HpBar({ hp }: { hp?: { current?: number; max?: number } | null }) {
  const max = Number(hp?.max)
  const current = Number(hp?.current)
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1
  const safeCurrent = Number.isFinite(current) ? current : 0
  const pct = Math.max(0, Math.min(100, (safeCurrent / safeMax) * 100))
  return (
    <div className="hp">
      <div className="hp-fill" style={{ width: `${pct}%` }} />
      <span>
        {safeCurrent}/{Number.isFinite(max) ? max : 0} hp
      </span>
    </div>
  )
}

function Sheet({ character }: { character: Character }) {
  const { dispatch } = useHyrule()
  const [itemName, setItemName] = useState('')
  const prof = 2
  const sheet = normalizeCharacter(character)
  const patch = (p: Partial<Character>) => dispatch({ type: 'patch-character', id: sheet.id, patch: p })

  return (
    <div className="sheet">
      <div className="sheet-top">
        <label>
          Name
          <input value={str(sheet.name)} onChange={(e) => patch({ name: e.target.value })} />
        </label>
        <label>
          Ancestry
          <input value={str(sheet.ancestry)} onChange={(e) => patch({ ancestry: e.target.value })} />
        </label>
        <label>
          Class
          <input value={str(sheet.className)} onChange={(e) => patch({ className: e.target.value })} />
        </label>
        <label>
          Virtue
          <select
            value={sheet.virtue ?? ''}
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
        <button onClick={() => patch({ hp: { ...sheet.hp, current: Math.max(0, sheet.hp.current - 1) } })}>
          −
        </button>
        <HpBar hp={sheet.hp} />
        <button
          onClick={() =>
            patch({ hp: { ...sheet.hp, current: Math.min(sheet.hp.max, sheet.hp.current + 1) } })
          }
        >
          +
        </button>
        <label>
          Max
          <input
            type="number"
            value={sheet.hp.max}
            onChange={(e) => {
              const max = Number(e.target.value) || 0
              patch({ hp: { max, current: Math.min(sheet.hp.current, max) } })
            }}
          />
        </label>
        <label>
          AC
          <input
            type="number"
            value={sheet.ac}
            onChange={(e) => patch({ ac: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={Boolean(sheet.inspiration)}
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
              value={sheet.abilities[ab]}
              onChange={(e) =>
                patch({
                  abilities: { ...sheet.abilities, [ab]: Number(e.target.value) || 0 },
                })
              }
            />
            <span>{formatMod(abilityMod(sheet.abilities[ab]))}</span>
          </label>
        ))}
      </div>
      <div className="combat-kit">
        <MoveEditor
          title="Attacks"
          hint="Two weapons or strikes. Hit dice versus AC, then damage."
          moves={sheet.attacks}
          onChange={(attacks) => patch({ attacks })}
        />
        <MoveEditor
          title="Spells"
          hint="Two spells even for martial heroes — Zelda gifts, smites, or slots."
          moves={sheet.spells}
          onChange={(spells) => patch({ spells })}
        />
      </div>
      <div className="split">
        <section>
          <h3>Skills</h3>
          <ul className="skills">
            {sheet.skills.map((sk) => (
              <li key={sk.name}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(sk.proficient)}
                    onChange={(e) =>
                      patch({
                        skills: sheet.skills.map((s) =>
                          s.name === sk.name ? { ...s, proficient: e.target.checked } : s,
                        ),
                      })
                    }
                  />
                  {sk.name}
                </label>
                <strong>{formatMod(skillBonus(sk, sheet.abilities, prof))}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Inventory</h3>
          <ul className="inventory">
            {sheet.inventory.map((it) => (
              <li key={it.id}>
                <input
                  value={str(it.name)}
                  onChange={(e) =>
                    dispatch({
                      type: 'patch-item',
                      characterId: sheet.id,
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
                      characterId: sheet.id,
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
                      characterId: sheet.id,
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
                    dispatch({ type: 'remove-item', characterId: sheet.id, itemId: it.id })
                  }
                >
                  ×
                </button>
                <textarea
                  value={str(it.notes)}
                  placeholder="Notes"
                  onChange={(e) =>
                    dispatch({
                      type: 'patch-item',
                      characterId: sheet.id,
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
                characterId: sheet.id,
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
              const on = sheet.conditions.includes(c)
              return (
                <button
                  key={c}
                  className={on ? 'on' : ''}
                  onClick={() =>
                    patch({
                      conditions: on
                        ? sheet.conditions.filter((x) => x !== c)
                        : [...sheet.conditions, c],
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
            <span>Success {sheet.deathSaves.success}/3</span>
            <button
              onClick={() =>
                patch({
                  deathSaves: {
                    ...sheet.deathSaves,
                    success: Math.min(3, sheet.deathSaves.success + 1),
                  },
                })
              }
            >
              +S
            </button>
            <span>Fail {sheet.deathSaves.fail}/3</span>
            <button
              onClick={() =>
                patch({
                  deathSaves: {
                    ...sheet.deathSaves,
                    fail: Math.min(3, sheet.deathSaves.fail + 1),
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
            <textarea value={str(sheet.notes)} onChange={(e) => patch({ notes: e.target.value })} />
          </label>
          <button className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'handouts' })}>
            Print this party’s dice sheets
          </button>
          <button className="danger" onClick={() => dispatch({ type: 'remove-character', id: sheet.id })}>
            Remove from party
          </button>
        </section>
      </div>
    </div>
  )
}

function str(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (value == null) return fallback
  return String(value)
}

function MoveEditor({
  title,
  hint,
  moves,
  onChange,
}: {
  title: string
  hint: string
  moves: CombatMove[]
  onChange: (next: CombatMove[]) => void
}) {
  const list = Array.isArray(moves) ? moves : []
  function patchMove(id: string, patch: Partial<CombatMove>) {
    onChange(list.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }
  function addMove() {
    onChange([
      ...list,
      {
        id: `${title.slice(0, 3).toLowerCase()}-${Date.now().toString(36)}`,
        name: title === 'Spells' ? 'New spell' : 'New attack',
        hit: 'd20+5',
        damage: '1d6',
        range: '5 ft',
        notes: '',
      },
    ])
  }
  return (
    <section>
      <h3>{title}</h3>
      <p className="hint">{hint}</p>
      <ul className="combat-moves">
        {list.map((m) => (
          <li key={m.id} className="combat-move">
            <label>
              Name
              <input value={str(m.name)} onChange={(e) => patchMove(m.id, { name: e.target.value })} />
            </label>
            <label>
              Hit / save
              <input value={str(m.hit)} onChange={(e) => patchMove(m.id, { hit: e.target.value })} />
            </label>
            <label>
              Damage
              <input value={str(m.damage)} onChange={(e) => patchMove(m.id, { damage: e.target.value })} />
            </label>
            <label>
              Range
              <input value={str(m.range)} onChange={(e) => patchMove(m.id, { range: e.target.value })} />
            </label>
            <label className="notes">
              How to roll
              <textarea value={str(m.notes)} onChange={(e) => patchMove(m.id, { notes: e.target.value })} />
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="ghost" onClick={addMove}>
        Add {title === 'Spells' ? 'spell' : 'attack'}
      </button>
    </section>
  )
}

function blankHero(): Character {
  return assembleCharacter({
    name: 'New adventurer',
    ancestry: 'Hylian',
    className: 'Fighter 3',
    virtue: 'Courage',
    hp: 22,
    ac: 15,
    speed: 30,
    abilities: { str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8 },
    notes: '',
  })
}
