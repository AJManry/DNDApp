import { useMemo, useState } from 'react'
import { battleMapForScene, battleMaps, battleMapsForLocation, campaignMaps } from '../data/maps'
import { asset } from '../lib/assets'
import { makeGeneratedMap, svgMap } from '../lib/mapStudio'
import { useHyrule } from '../state/store'
import { MapBoard } from './MapBoard'

export function MapsView() {
  const { state, dispatch } = useHyrule()
  const pending = state.oracleThread.map((m) => m.mapPrompt).filter((p): p is string => Boolean(p))
  const [prompt, setPrompt] = useState(
    pending.at(-1) ?? 'Hyrule Field at golden hour, sky islands, Sheikah shrine, cream parchment map',
  )
  const selectedBattle = battleMaps.find((m) => m.id === state.activeMapId)
  const painted = state.maps.find((m) => m.id === state.activeMapId && !m.campaign)
  const battle =
    selectedBattle ||
    (painted ? undefined : battleMapForScene(state.sceneId) ?? battleMaps[0])
  const place =
    campaignMaps.find((m) => m.id === selectedBattle?.locationId) ||
    campaignMaps.find((m) => m.id === state.activeMapId) ||
    campaignMaps.find((m) => m.id === battle?.locationId) ||
    campaignMaps[0]
  const relatedBattles = battleMapsForLocation(place?.id ?? '')
  const combatSrc = painted?.imageUrl || battle?.src || asset('art/battle-kakariko.jpg')
  const combatId = painted?.id || battle?.id || 'battle-kakariko'
  const svg = useMemo(() => svgMap(place?.prompt ?? prompt), [place?.prompt, prompt])

  function generate(next = prompt) {
    const q = next.trim()
    if (!q) return
    dispatch({ type: 'add-map', map: makeGeneratedMap(q) })
  }

  return (
    <div className="maps">
      <header className="maps-head">
        <div>
          <p className="kicker">Cartographer</p>
          <h1>Places and combat boards</h1>
          <p className="lede">
            Painted views set the scene. Combat uses a separate bird’s-eye board so tokens sit on a floor, not on a
            landscape painting.
          </p>
        </div>
        <form
          className="map-prompt"
          onSubmit={(e) => {
            e.preventDefault()
            generate()
          }}
        >
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A sky island shrine at golden hour, Zonai stone, cream map…"
            aria-label="Map prompt"
          />
          <button type="submit">Create map</button>
        </form>
      </header>
      {place ? (
        <figure className="scene-art">
          <img src={place.artSrc || place.imageUrl} alt={place.title} />
          <figcaption>Place · {place.title}</figcaption>
        </figure>
      ) : null}
      <MapBoard mapId={combatId} src={combatSrc} title={battle?.title ?? painted?.title} />
      <div className="map-stage">
        <figure className="ink-map">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          <figcaption>Cartographer’s ink (offline schematic of this place)</figcaption>
        </figure>
      </div>
      <h2>Places</h2>
      <p className="hint">Scenic paintings for the table. They are not the combat grid.</p>
      <div className="gallery">
        {campaignMaps.map((m) => (
          <button
            key={m.id}
            className={`thumb${m.id === place?.id ? ' active' : ''}`}
            onClick={() => {
              const first = battleMapsForLocation(m.id)[0]
              dispatch({ type: 'active-map', id: first?.id ?? m.id })
            }}
          >
            <img src={m.artSrc} alt={m.title} />
            <span>{m.title}</span>
          </button>
        ))}
      </div>
      <h2>Combat boards</h2>
      <p className="hint">Top-down floors for movement, range, and cover.</p>
      <div className="gallery">
        {battleMaps.map((m) => (
          <button
            key={m.id}
            className={`thumb${m.id === battle?.id ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'active-map', id: m.id })}
          >
            <img src={m.src} alt={m.title} />
            <span>{m.title}</span>
          </button>
        ))}
      </div>
      {relatedBattles.length > 1 ? (
        <p className="hint">
          {place?.title} has {relatedBattles.length} boards
          {relatedBattles.map((b) => ` · ${b.title}`).join('')}.
        </p>
      ) : null}
      {state.maps.filter((m) => !m.campaign).length > 0 ? (
        <>
          <h2>Your atlas</h2>
          <div className="gallery">
            {state.maps
              .filter((m) => !m.campaign)
              .map((m) => (
                <button
                  key={m.id}
                  className={`thumb${m.id === state.activeMapId ? ' active' : ''}`}
                  onClick={() => dispatch({ type: 'active-map', id: m.id })}
                >
                  <img src={m.imageUrl} alt={m.prompt} />
                  <span>{m.title}</span>
                </button>
              ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
