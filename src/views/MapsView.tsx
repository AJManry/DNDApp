import { useMemo, useState } from 'react'
import { campaignMaps } from '../data/maps'
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
  const active =
    campaignMaps.find((m) => m.id === state.activeMapId) ||
    state.maps.find((m) => m.id === state.activeMapId) ||
    campaignMaps[0]
  const src = active?.artSrc || active?.imageUrl || asset('art/map-hyrule-region.jpg')
  const svg = useMemo(() => svgMap(active?.prompt ?? prompt), [active?.prompt, prompt])

  function generate(next = prompt) {
    const q = next.trim()
    if (!q) return
    dispatch({ type: 'add-map', map: makeGeneratedMap(q) })
  }

  function openMap(id: string, nextPrompt?: string) {
    if (nextPrompt) setPrompt(nextPrompt)
    dispatch({ type: 'active-map', id })
  }

  return (
    <div className="maps">
      <header className="maps-head">
        <div>
          <p className="kicker">Cartographer</p>
          <h1>Tactics on every map</h1>
          <p className="lede">
            Deploy the party, NPCs, and scene foes as tokens. Drag to move, measure distance in 5e feet, and scale the
            grid. Every campaign map and every painted map keeps its own positions.
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
      <MapBoard mapId={active?.id ?? 'map-hyrule'} src={src} title={active?.title ?? active?.prompt} />
      <div className="map-stage">
        <figure className="ink-map">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          <figcaption>Cartographer’s ink (offline schematic of this place)</figcaption>
        </figure>
      </div>
      <h2>Campaign maps</h2>
      <div className="gallery">
        {campaignMaps.map((m) => (
          <button
            key={m.id}
            className={`thumb${m.id === state.activeMapId ? ' active' : ''}`}
            onClick={() => openMap(m.id, m.prompt)}
          >
            <img src={m.artSrc} alt={m.title} />
            <span>{m.title}</span>
          </button>
        ))}
      </div>
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
                  onClick={() => openMap(m.id, m.prompt)}
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
