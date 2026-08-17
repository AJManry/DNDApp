import { useMemo, useState } from 'react'
import { campaignMaps } from '../data/maps'
import { makeGeneratedMap, svgMap } from '../lib/mapStudio'
import { useSagekeep } from '../state/store'

export function MapsView() {
  const { state, dispatch } = useSagekeep()
  const pending = state.oracleThread.map((m) => m.mapPrompt).filter((p): p is string => Boolean(p))
  const [prompt, setPrompt] = useState(pending.at(-1) ?? 'Twilight forest shrine with three leaf-stones and a gold path')
  const latest = state.maps[0]
  const svg = useMemo(() => svgMap(latest?.prompt ?? prompt), [latest?.prompt, prompt])

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
          <h1>Paint the world from a prompt</h1>
          <p className="lede">
            Describe a place. Sagekeep renders a graphic painting (via a cloud image model) and an inked table map you
            can use immediately. Campaign maps for the Zelda-inspired one-shot live in the gallery below.
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
            placeholder="A cliffside village under a waterfall, dusk, gold lanterns…"
            aria-label="Map prompt"
          />
          <button type="submit">Create map</button>
        </form>
      </header>
      <div className="map-stage">
        <figure className="painting">
          {latest ? (
            <img src={latest.imageUrl} alt={latest.prompt} />
          ) : (
            <img src="/art/map-eldara-region.jpg" alt="Eldara" />
          )}
          <figcaption>
            {latest ? (
              <>
                Painted from: {latest.prompt} · biome {latest.biome}
              </>
            ) : (
              'Regional map of Eldara — generate your own above'
            )}
          </figcaption>
        </figure>
        <figure className="ink-map">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          <figcaption>Cartographer’s ink (always available offline)</figcaption>
        </figure>
      </div>
      <h2>The Song That Wakes the Green</h2>
      <div className="gallery">
        {campaignMaps.map((m) => (
          <button
            key={m.id}
            className="thumb"
            onClick={() => {
              setPrompt(m.prompt)
              dispatch({ type: 'add-map', map: { ...m, createdAt: Date.now() } })
            }}
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
                <button key={m.id} className="thumb" onClick={() => dispatch({ type: 'add-map', map: m })}>
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
