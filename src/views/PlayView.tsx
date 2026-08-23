import { acts, scenes } from '../data/campaign'
import { bestiary } from '../data/bestiary'
import { campaignMaps } from '../data/maps'
import { useHyrule } from '../state/store'
import type { Scene, SceneOption, StatBlock } from '../types'
import { MapBoard } from './MapBoard'

export function PlayView() {
  const { state, dispatch } = useHyrule()
  const scene = scenes.find((s) => s.id === state.sceneId) ?? scenes[0]
  const map = campaignMaps.find((m) => m.id === scene.mapId)
  const monsters = (scene.encounterIds ?? [])
    .map((id) => bestiary.find((b) => b.id === id))
    .filter((b): b is StatBlock => Boolean(b))
  const suggested = suggestedScene(state.sessionElapsedMs)

  return (
    <div className="play">
      <div className="play-col">
        <div className="play-col-head">
          <p className="kicker">The table</p>
          <h1>Run the scene</h1>
          <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'home' })}>
            One-shot briefing
          </button>
        </div>
        <ol className="scene-list">
          {acts.map((act) => (
            <li key={act.act} className="act-block">
              <div className="act-label">
                Act {act.act} · {act.title}
                <span>{act.minutes}</span>
              </div>
              {scenes
                .filter((s) => s.act === act.act)
                .map((s) => {
                  const done = state.completedSceneIds.includes(s.id)
                  const active = s.id === scene.id
                  const onClock = suggested?.id === s.id
                  return (
                    <button
                      key={s.id}
                      className={`scene-item${active ? ' active' : ''}${done ? ' done' : ''}${onClock ? ' now' : ''}`}
                      onClick={() => dispatch({ type: 'scene', id: s.id })}
                    >
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={(e) => {
                          e.stopPropagation()
                          dispatch({ type: 'toggle-scene', id: s.id })
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>
                        {s.title}
                        {s.optional ? <em> optional</em> : null}
                      </span>
                      <small>
                        {s.minuteStart}–{s.minuteEnd}m
                      </small>
                    </button>
                  )
                })}
            </li>
          ))}
        </ol>
      </div>
      <div className="play-main">
        <article className="scene-card">
          <header>
            <span className="pill">Act {scene.act}</span>
            <h2>{scene.title}</h2>
            <span className="time-chip">
              Beat {scene.minuteStart}–{scene.minuteEnd} min
            </span>
          </header>
          {scene.summary ? <p className="scene-summary">{scene.summary}</p> : null}
          {map ? (
            <div className="scene-tactics">
              <header className="scene-tactics-head">
                <span>Tactics · {map.title}</span>
                <button
                  className="ghost"
                  onClick={() => {
                    dispatch({ type: 'active-map', id: map.id })
                    dispatch({ type: 'tab', tab: 'maps' })
                  }}
                >
                  Full board
                </button>
              </header>
              <MapBoard mapId={map.id} src={map.artSrc || map.imageUrl} title={map.title} compact />
            </div>
          ) : null}
          <blockquote className="boxed">{scene.boxedText}</blockquote>
          {scene.whatsHappening ? (
            <div className="whats-happening">
              <h3>What’s happening</h3>
              {scene.whatsHappening.split('\n').map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          ) : null}
          {scene.options?.length ? (
            <div className="scene-options">
              <h3>Ways through</h3>
              {scene.options.map((opt) => (
                <OptionCard key={opt.name} option={opt} />
              ))}
            </div>
          ) : null}
          {state.secretsRevealed ? (
            <div className="dm-notes">
              <h3>DM notes</h3>
              <p>{scene.dmNotes}</p>
              {scene.treasure ? (
                <p>
                  <strong>Treasure.</strong> {scene.treasure}
                </p>
              ) : null}
            </div>
          ) : null}
          {scene.skillChecks?.length && !scene.options?.length ? (
            <ul className="checks">
              {scene.skillChecks.map((c) => (
                <li key={c.name}>
                  <strong>
                    {c.name} · DC {c.dc} ({c.ability})
                  </strong>
                  <div>Success: {c.success}</div>
                  <div>Failure: {c.failure}</div>
                </li>
              ))}
            </ul>
          ) : null}
          {monsters.map((m) => (
            <StatCard key={m.id} monster={m} />
          ))}
        </article>
        <aside className="play-dock">
          <TwilightClock />
          <DiceTray />
          <RulesStrip />
          <InitiativeBox />
        </aside>
      </div>
    </div>
  )
}

function suggestedScene(elapsedMs: number): Scene | undefined {
  const minutes = elapsedMs / 60000
  return scenes.find((s) => minutes >= s.minuteStart && minutes < s.minuteEnd) ?? scenes[0]
}

function TwilightClock() {
  const { state, dispatch } = useHyrule()
  return (
    <div className="dock-card">
      <h3>Twilight Clock</h3>
      <div className="segments">
        {Array.from({ length: 6 }, (_, i) => (
          <button
            key={i}
            className={i < state.twilightClock ? 'seg on' : 'seg'}
            onClick={() => dispatch({ type: 'clock', value: i + 1 === state.twilightClock ? i : i + 1 })}
            aria-label={`Set twilight to ${i + 1}`}
          />
        ))}
      </div>
      <p className="hint">
        {state.twilightClock >= 6
          ? 'Ganondorf begins in phase 2. Kakariko is scarred.'
          : state.twilightClock >= 4
            ? 'Kakariko’s well has gone dark.'
            : 'Advance for detours, noisy failures, or Lost Woods rests.'}
      </p>
    </div>
  )
}

function DiceTray() {
  const { state, dispatch } = useHyrule()
  return (
    <div className="dock-card">
      <h3>Dice</h3>
      <div className="dice-row">
        {[4, 6, 8, 10, 12, 20].map((n) => (
          <button key={n} onClick={() => dispatch({ type: 'roll', expr: `1d${n}` })}>
            d{n}
          </button>
        ))}
      </div>
      <ul className="dice-log">
        {state.diceLog.slice(0, 5).map((d) => (
          <li key={d.id}>
            <span>{d.label}</span>
            <strong>{d.result}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RulesStrip() {
  const { dispatch } = useHyrule()
  return (
    <div className="dock-card">
      <h3>Briefing</h3>
      <p className="hint">Story, skip list, ocarina, Triforce, and the Clock live on Home so this page can stay on the scene.</p>
      <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'home' })}>
        Open one-shot briefing
      </button>
    </div>
  )
}

function OptionCard({ option }: { option: SceneOption }) {
  return (
    <article className="option-card">
      <header>
        <h4>{option.name}</h4>
        {option.dc != null && option.dc > 0 ? (
          <span>
            DC {option.dc}
            {option.ability ? ` · ${option.ability}` : ''}
          </span>
        ) : option.ability ? (
          <span>{option.ability}</span>
        ) : null}
      </header>
      <p>{option.text}</p>
      {option.success ? (
        <p>
          <strong>If it works.</strong> {option.success}
        </p>
      ) : null}
      {option.failure ? (
        <p>
          <strong>If it fails.</strong> {option.failure}
        </p>
      ) : null}
      {option.clock ? <p className="clock-note">{option.clock}</p> : null}
    </article>
  )
}

function InitiativeBox() {
  const { state, dispatch } = useHyrule()
  const scene = scenes.find((s) => s.id === state.sceneId)
  return (
    <div className="dock-card">
      <h3>Initiative</h3>
      <button
        className="ghost"
        onClick={() => {
          const players = state.party.map((p) => ({
            id: p.id,
            name: p.name,
            initiative: 1 + Math.floor(Math.random() * 20),
            hp: p.hp.current,
            maxHp: p.hp.max,
            ac: p.ac,
            isPlayer: true,
          }))
          const foes = (scene?.encounterIds ?? []).flatMap((id) => {
            const m = bestiary.find((b) => b.id === id)
            if (!m) return []
            return [
              {
                id: `${m.id}-${Math.random().toString(36).slice(2, 6)}`,
                name: m.name,
                initiative: 1 + Math.floor(Math.random() * 20),
                hp: m.hp,
                maxHp: m.hp,
                ac: m.ac,
                isPlayer: false,
              },
            ]
          })
          dispatch({
            type: 'initiative',
            list: [...players, ...foes].sort((a, b) => b.initiative - a.initiative),
          })
        }}
      >
        Roll party + scene foes
      </button>
      <ul className="init-list">
        {state.initiative.map((c) => (
          <li key={c.id} className={c.isPlayer ? 'pc' : 'foe'}>
            <span>
              {c.name} <small>AC {c.ac}</small>
            </span>
            <strong>{c.initiative}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatCard({ monster }: { monster: StatBlock }) {
  const mods = (n: number) => (n >= 0 ? `+${n}` : `${n}`)
  const m = (s: number) => mods(Math.floor((s - 10) / 2))
  return (
    <div className="statblock">
      <header>
        <h3>{monster.name}</h3>
        <span>
          {monster.type} · CR {monster.cr}
        </span>
      </header>
      <p>
        AC {monster.ac} · HP {monster.hp} · Speed {monster.speed}
      </p>
      <p className="sixstat">
        STR {monster.stats.str} ({m(monster.stats.str)}) DEX {monster.stats.dex} ({m(monster.stats.dex)}) CON{' '}
        {monster.stats.con} ({m(monster.stats.con)}) INT {monster.stats.int} ({m(monster.stats.int)}) WIS{' '}
        {monster.stats.wis} ({m(monster.stats.wis)}) CHA {monster.stats.cha} ({m(monster.stats.cha)})
      </p>
      {monster.traits.map((t) => (
        <p key={t}>
          <em>{t}</em>
        </p>
      ))}
      {monster.actions.map((a) => (
        <p key={a.name}>
          <strong>{a.name}.</strong> {a.text}
        </p>
      ))}
      {monster.legendary?.map((a) => (
        <p key={a.name}>
          <strong>Legendary — {a.name}.</strong> {a.text}
        </p>
      ))}
    </div>
  )
}
