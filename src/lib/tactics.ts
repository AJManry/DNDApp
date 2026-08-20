import { asset } from './assets'
import { bestiary } from '../data/bestiary'
import type { Character, MapTactics, MapToken, Scene, TokenRole } from '../types'

const PC_COLORS = ['#8fd4dc', '#e8943a', '#f6c56a', '#3d9b94', '#c8eef2']
const NPC_COLOR = '#8fd4dc'
const FOE_COLOR = '#c4456a'
const MARKER_COLOR = '#f6c56a'

export const DEFAULT_GRID_COLS = 24
export const DEFAULT_FEET = 5

export function emptyTactics(mapId: string): MapTactics {
  return {
    mapId,
    tokens: [],
    showGrid: true,
    gridCols: DEFAULT_GRID_COLS,
    feetPerSquare: DEFAULT_FEET,
  }
}

export function parseSpeed(speed: string | number | undefined): number {
  if (typeof speed === 'number' && Number.isFinite(speed)) return speed
  if (!speed) return 30
  const n = String(speed).match(/(\d+)/)
  return n ? Number(n[1]) : 30
}

export function distanceOnGrid(
  a: { x: number; y: number },
  b: { x: number; y: number },
  gridCols: number,
  aspect: number,
  feetPerSquare: number,
): { squares: number; feet: number } {
  const dxCells = ((b.x - a.x) / 100) * gridCols
  const dyCells = ((b.y - a.y) / 100) * gridCols * Math.max(aspect, 0.01)
  const squares = Math.max(Math.abs(dxCells), Math.abs(dyCells))
  return {
    squares: Math.round(squares * 10) / 10,
    feet: Math.round(squares * feetPerSquare),
  }
}

export function clampPercent(n: number): number {
  return Math.max(1, Math.min(99, n))
}

const MAP_NPCS: Record<string, { id: string; name: string; speed: number; portrait?: string }[]> = {
  'map-hyrule': [{ id: 'impa', name: 'Impa', speed: 30, portrait: asset('art/portrait-impa.jpg') }],
  'map-kakariko': [
    { id: 'impa', name: 'Impa', speed: 30, portrait: asset('art/portrait-impa.jpg') },
    { id: 'navi', name: 'Navi', speed: 40, portrait: asset('art/portrait-navi.jpg') },
  ],
  'map-lost-woods': [
    { id: 'navi', name: 'Navi', speed: 40, portrait: asset('art/portrait-navi.jpg') },
    { id: 'korok', name: 'Korok elder', speed: 25 },
  ],
  'map-forest-temple': [
    { id: 'navi', name: 'Navi', speed: 40, portrait: asset('art/portrait-navi.jpg') },
  ],
  'map-sacred-realm': [
    { id: 'ganondorf', name: 'Ganondorf', speed: 30, portrait: asset('art/portrait-ganondorf.jpg') },
    { id: 'navi', name: 'Navi', speed: 40, portrait: asset('art/portrait-navi.jpg') },
  ],
}

function encounterCount(monsterId: string): number {
  if (monsterId === 'poe' || monsterId === 'bokoblin' || monsterId === 'deku-baba') return 3
  return 1
}

function token(
  id: string,
  name: string,
  role: TokenRole,
  x: number,
  y: number,
  speed: number,
  extra?: Partial<MapToken>,
): MapToken {
  const color = role === 'pc' ? PC_COLORS[(extra?.refId?.length ?? 0) % PC_COLORS.length] : role === 'foe' ? FOE_COLOR : role === 'npc' ? NPC_COLOR : MARKER_COLOR
  return { id, name, role, x, y, speed, color, ...extra }
}

export function seedTokens(mapId: string, party: Character[], scene?: Scene | null): MapToken[] {
  const tokens: MapToken[] = []
  party.forEach((pc, i) => {
    tokens.push(
      token(`pc-${pc.id}`, pc.name, 'pc', 18 + i * 8, 78, pc.speed || 30, {
        refId: pc.id,
        portrait: pc.portrait,
        color: PC_COLORS[i % PC_COLORS.length],
      }),
    )
  })
  const npcs = MAP_NPCS[mapId] ?? []
  npcs.forEach((npc, i) => {
    if (scene?.encounterIds?.includes(npc.id)) return
    tokens.push(
      token(`npc-${npc.id}`, npc.name, 'npc', 48 + (i % 3) * 10, 42 + Math.floor(i / 3) * 10, npc.speed, {
        refId: npc.id,
        portrait: npc.portrait,
      }),
    )
  })
  const ids = scene?.mapId === mapId ? (scene.encounterIds ?? []) : []
  let foeI = 0
  for (const id of ids) {
    const monster = bestiary.find((b) => b.id === id)
    const n = encounterCount(id)
    for (let i = 0; i < n; i += 1) {
      const name = n > 1 ? `${monster?.name ?? id} ${i + 1}` : (monster?.name ?? id)
      tokens.push(
        token(`foe-${id}-${i}`, name, 'foe', 58 + (foeI % 4) * 8, 22 + Math.floor(foeI / 4) * 10, parseSpeed(monster?.speed), {
          refId: id,
        }),
      )
      foeI += 1
    }
  }
  return tokens
}

export function seededBoard(mapId: string, party: Character[], scene?: Scene | null, prev?: MapTactics): MapTactics {
  return {
    mapId,
    tokens: seedTokens(mapId, party, scene),
    showGrid: prev?.showGrid ?? true,
    gridCols: prev?.gridCols ?? DEFAULT_GRID_COLS,
    feetPerSquare: prev?.feetPerSquare ?? DEFAULT_FEET,
  }
}

export function formatRange(feet: number, squares: number, speed?: number): string {
  const sq = Number.isInteger(squares) ? String(squares) : squares.toFixed(1)
  const over = speed != null && feet > speed ? ` · over speed (${speed} ft)` : ''
  return `${feet} ft (${sq} sq)${over}`
}
