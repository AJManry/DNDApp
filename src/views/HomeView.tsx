import { acts, CAMPAIGN, scenes, virtueRules } from '../data/campaign'
import { pregens } from '../data/pregens'
import { asset } from '../lib/assets'
import { useHyrule } from '../state/store'

export function HomeView() {
  const { dispatch } = useHyrule()

  function openTable(sceneId?: string) {
    if (sceneId) dispatch({ type: 'scene', id: sceneId })
    dispatch({ type: 'tab', tab: 'play' })
  }

  return (
    <div className="home">
      <header className="home-hero">
        <img src={asset('art/hyrule-emblem.jpg')} alt="" className="home-emblem" />
        <div>
          <p className="kicker">One-shot briefing</p>
          <h1>{CAMPAIGN.title}</h1>
          <p className="lede">{CAMPAIGN.subtitle}</p>
          <p className="home-meta">
            {CAMPAIGN.players} · {CAMPAIGN.duration}
          </p>
        </div>
      </header>
      <div className="home-actions">
        <button type="button" onClick={() => openTable()}>
          Open the table
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            dispatch({ type: 'start-session' })
            openTable(scenes[0]?.id)
          }}
        >
          Start the 3-hour clock
        </button>
        <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'party' })}>
          Forge a hero
        </button>
        <button type="button" className="ghost" onClick={() => dispatch({ type: 'tab', tab: 'handouts' })}>
          Print dice sheets
        </button>
      </div>
      <p className="fineprint">{CAMPAIGN.inspiration}</p>

      <section className="home-story">
        <h2>What is happening</h2>
        {CAMPAIGN.story.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </section>

      <section>
        <h2>The five acts</h2>
        <div className="home-acts">
          {acts.map((act) => (
            <article key={act.act} className="home-act">
              <header>
                <span>Act {act.act}</span>
                <small>{act.minutes}</small>
              </header>
              <h3>{act.title}</h3>
              <p>{act.hook}</p>
              <ul>
                {scenes
                  .filter((s) => s.act === act.act)
                  .map((s) => (
                    <li key={s.id}>
                      <button type="button" className="ghost scene-link" onClick={() => openTable(s.id)}>
                        {s.title}
                        {s.optional ? <em> optional</em> : null}
                      </button>
                      {s.summary ? <span>{s.summary}</span> : null}
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="home-split">
        <section>
          <h2>How to run tonight</h2>
          <ul className="home-list">
            {CAMPAIGN.howToRun.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3>If you are behind</h3>
          <ul className="home-list">
            {CAMPAIGN.skipIfBehind.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Table rules</h2>
          <ul className="home-list rules">
            {virtueRules.map((r) => (
              <li key={r.name}>
                <strong>{r.name}.</strong> {r.text}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="home-split">
        <section className="home-villain">
          <h2>The villain</h2>
          <p>{CAMPAIGN.villain}</p>
          <h3>How it should end</h3>
          <p>{CAMPAIGN.ending}</p>
        </section>
        <section>
          <h2>Pregenerated chorus</h2>
          <ul className="home-pregens">
            {pregens.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <span>
                  {p.ancestry} {p.className} · {p.virtue}
                </span>
              </li>
            ))}
          </ul>
          <p className="hint">Forge someone new on Party, then print a dice sheet on Handouts.</p>
        </section>
      </div>
    </div>
  )
}
