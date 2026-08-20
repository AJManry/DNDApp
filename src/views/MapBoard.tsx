import { useEffect, useMemo, useRef, useState } from 'react'
import { scenes } from '../data/campaign'
import { emptyTactics, formatRange, seededBoard, distanceOnGrid, clampPercent } from '../lib/tactics'
import { useHyrule } from '../state/store'
import type { MapToken } from '../types'

type Mode = 'move' | 'measure' | 'place'

export function MapBoard({
  mapId,
  src,
  title,
  compact = false,
}: {
  mapId: string
  src: string
  title?: string
  compact?: boolean
}) {
  const { state, dispatch } = useHyrule()
  const board = state.tactics[mapId] ?? emptyTactics(mapId)
  const scene = scenes.find((s) => s.id === state.sceneId)
  const stageRef = useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = useState(9 / 16)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('move')
  const [measure, setMeasure] = useState<{ x: number; y: number }[]>([])
  const [drag, setDrag] = useState<{ id: string; fromX: number; fromY: number; x: number; y: number } | null>(null)
  const [placeName, setPlaceName] = useState('Marker')

  const hasBoard = Boolean(state.tactics[mapId])
  useEffect(() => {
    if (hasBoard) return
    dispatch({ type: 'set-tactics', board: seededBoard(mapId, state.party, scene) })
  }, [dispatch, hasBoard, mapId, scene, state.party])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measureBox = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0) setAspect(r.height / r.width)
    }
    measureBox()
    const obs = new ResizeObserver(measureBox)
    obs.observe(el)
    return () => obs.disconnect()
  }, [src])

  const selected = board.tokens.find((t) => t.id === selectedId) ?? null
  const liveTokens = useMemo(() => {
    if (!drag) return board.tokens
    return board.tokens.map((t) => (t.id === drag.id ? { ...t, x: drag.x, y: drag.y } : t))
  }, [board.tokens, drag])

  const dragDist = drag
    ? distanceOnGrid(
        { x: drag.fromX, y: drag.fromY },
        { x: drag.x, y: drag.y },
        board.gridCols,
        aspect,
        board.feetPerSquare,
      )
    : null
  const moving = drag ? board.tokens.find((t) => t.id === drag.id) : null

  const measureDist =
    measure.length === 2
      ? distanceOnGrid(measure[0], measure[1], board.gridCols, aspect, board.feetPerSquare)
      : null

  function toPercent(e: React.PointerEvent | PointerEvent): { x: number; y: number } {
    const el = stageRef.current
    if (!el) return { x: 50, y: 50 }
    const r = el.getBoundingClientRect()
    return {
      x: clampPercent(((e.clientX - r.left) / r.width) * 100),
      y: clampPercent(((e.clientY - r.top) / r.height) * 100),
    }
  }

  function onStagePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('.token')) return
    const pt = toPercent(e)
    if (mode === 'place') {
      dispatch({
        type: 'add-token',
        mapId,
        token: {
          id: `mk-${Date.now()}`,
          name: placeName.trim() || 'Marker',
          role: 'marker',
          x: pt.x,
          y: pt.y,
          speed: 0,
          color: '#f6c56a',
        },
      })
      setMode('move')
      return
    }
    if (mode === 'measure') {
      setMeasure((m) => (m.length >= 2 ? [pt] : [...m, pt]))
      return
    }
    setSelectedId(null)
  }

  function onTokenPointerDown(e: React.PointerEvent<HTMLButtonElement>, token: MapToken) {
    e.stopPropagation()
    if (mode === 'measure') {
      setMeasure((m) => (m.length >= 2 ? [{ x: token.x, y: token.y }] : [...m, { x: token.x, y: token.y }]))
      setSelectedId(token.id)
      return
    }
    setSelectedId(token.id)
    if (mode !== 'move') return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ id: token.id, fromX: token.x, fromY: token.y, x: token.x, y: token.y })
  }

  function onTokenPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag) return
    const pt = toPercent(e)
    setDrag({ ...drag, x: pt.x, y: pt.y })
  }

  function onTokenPointerUp() {
    if (!drag) return
    dispatch({ type: 'move-token', mapId, tokenId: drag.id, x: drag.x, y: drag.y })
    setDrag(null)
  }

  function nudge(dx: number, dy: number) {
    if (!selected) return
    dispatch({
      type: 'move-token',
      mapId,
      tokenId: selected.id,
      x: clampPercent(selected.x + dx),
      y: clampPercent(selected.y + dy),
    })
  }

  const rows = Math.max(1, Math.round(board.gridCols * aspect))
  const speedRing =
    selected && selected.speed > 0
      ? (selected.speed / board.feetPerSquare / board.gridCols) * 100
      : 0

  return (
    <div className={`tactics${compact ? ' compact' : ''}`}>
      <div className="tactics-toolbar">
        <div className="chips">
          <button className={mode === 'move' ? 'on' : ''} onClick={() => setMode('move')}>
            Move
          </button>
          <button
            className={mode === 'measure' ? 'on' : ''}
            onClick={() => {
              setMode('measure')
              setMeasure([])
            }}
          >
            Measure
          </button>
          <button className={mode === 'place' ? 'on' : ''} onClick={() => setMode('place')}>
            Place
          </button>
          <button
            className={board.showGrid ? 'on' : ''}
            onClick={() => dispatch({ type: 'patch-tactics', mapId, patch: { showGrid: !board.showGrid } })}
          >
            Grid
          </button>
        </div>
        <label className="tactics-scale">
          {board.feetPerSquare} ft / sq
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={board.feetPerSquare}
            onChange={(e) =>
              dispatch({ type: 'patch-tactics', mapId, patch: { feetPerSquare: Number(e.target.value) } })
            }
          />
        </label>
        {!compact ? (
          <button
            className="ghost"
            onClick={() => dispatch({ type: 'set-tactics', board: seededBoard(mapId, state.party, scene, board) })}
          >
            Deploy party & scene
          </button>
        ) : (
          <button
            className="ghost"
            onClick={() => dispatch({ type: 'set-tactics', board: seededBoard(mapId, state.party, scene, board) })}
          >
            Deploy
          </button>
        )}
      </div>
      <div
        ref={stageRef}
        className={`tactics-stage${mode === 'place' ? ' placing' : ''}${mode === 'measure' ? ' measuring' : ''}`}
        onPointerDown={onStagePointerDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') nudge(-2, 0)
          if (e.key === 'ArrowRight') nudge(2, 0)
          if (e.key === 'ArrowUp') nudge(0, -2)
          if (e.key === 'ArrowDown') nudge(0, 2)
        }}
        tabIndex={0}
        role="application"
        aria-label={`${title ?? 'Map'} tactics board`}
      >
        <img src={src} alt={title ?? 'Map'} draggable={false} />
        {board.showGrid ? (
          <svg className="tactics-grid" viewBox={`0 0 ${board.gridCols} ${rows}`} preserveAspectRatio="none">
            {Array.from({ length: board.gridCols + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i} y1={0} x2={i} y2={rows} />
            ))}
            {Array.from({ length: rows + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i} x2={board.gridCols} y2={i} />
            ))}
          </svg>
        ) : null}
        {selected && speedRing > 0 ? (
          <div
            className="speed-ring"
            style={{ left: `${selected.x}%`, top: `${selected.y}%`, width: `${speedRing * 2}%` }}
          />
        ) : null}
        {drag ? (
          <svg className="measure-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1={drag.fromX} y1={drag.fromY} x2={drag.x} y2={drag.y} />
          </svg>
        ) : null}
        {measure.length === 2 ? (
          <svg className="measure-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1={measure[0].x} y1={measure[0].y} x2={measure[1].x} y2={measure[1].y} />
          </svg>
        ) : null}
        {liveTokens.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`token ${t.role}${t.id === selectedId ? ' selected' : ''}`}
            style={{ left: `${t.x}%`, top: `${t.y}%`, borderColor: t.color, ['--token' as string]: t.color }}
            onPointerDown={(e) => onTokenPointerDown(e, t)}
            onPointerMove={onTokenPointerMove}
            onPointerUp={onTokenPointerUp}
            onPointerCancel={onTokenPointerUp}
            title={`${t.name} · ${t.speed ? `${t.speed} ft` : 'marker'}`}
          >
            {t.portrait ? <img src={t.portrait} alt="" /> : <span>{t.name.slice(0, 1)}</span>}
            <em>{t.name}</em>
          </button>
        ))}
        {dragDist && moving ? (
          <div className="tactics-float">
            {moving.name}: {formatRange(dragDist.feet, dragDist.squares, moving.speed || undefined)}
          </div>
        ) : null}
        {measureDist ? (
          <div className="tactics-float">Measure: {formatRange(measureDist.feet, measureDist.squares)}</div>
        ) : null}
      </div>
      <div className="tactics-roster">
        {mode === 'place' ? (
          <label>
            Marker name
            <input value={placeName} onChange={(e) => setPlaceName(e.target.value)} />
          </label>
        ) : (
          <p className="hint">
            {mode === 'measure'
              ? 'Click two tokens or two points on the map. Distances use 5e diagonals (max of X/Y squares).'
              : 'Drag tokens to move. The ring is one round of speed. Arrow keys nudge the selected token.'}
          </p>
        )}
        <ul>
          {liveTokens.map((t) => {
            const dist =
              selected && t.id !== selected.id
                ? distanceOnGrid(selected, t, board.gridCols, aspect, board.feetPerSquare)
                : null
            return (
              <li key={t.id}>
                <button type="button" className={t.id === selectedId ? 'on' : ''} onClick={() => setSelectedId(t.id)}>
                  <span className={`dot ${t.role}`} style={{ background: t.color }} />
                  <strong>{t.name}</strong>
                  <small>
                    {t.speed ? `${t.speed} ft` : 'marker'}
                    {dist ? ` · ${dist.feet} ft` : ''}
                  </small>
                </button>
                <button
                  type="button"
                  className="ghost"
                  aria-label={`Remove ${t.name}`}
                  onClick={() => dispatch({ type: 'remove-token', mapId, tokenId: t.id })}
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
