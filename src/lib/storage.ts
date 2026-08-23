import { pregens } from '../data/pregens'
import { scenes } from '../data/campaign'
import { battleMapForScene } from '../data/maps'
import { normalizeCharacter } from './combatKit'
import type { AppState } from '../types'

export const STORAGE_KEY = 'hyrule-state-v1'

export function defaultState(): AppState {
  return {
    tab: 'home',
    oracleQuery: '',
    oracleThread: [],
    oracleBusy: false,
    party: structuredClone(pregens).map((c) => normalizeCharacter(c)),
    selectedCharacterId: pregens[0]?.id ?? null,
    initiative: [],
    sceneId: scenes[0]?.id ?? '',
    completedSceneIds: [],
    twilightClock: 0,
    sessionStartedAt: null,
    sessionElapsedMs: 0,
    journal: '',
    customLore: [],
    maps: [],
    secretsRevealed: true,
    diceLog: [],
    tactics: {},
    activeMapId: battleMapForScene(scenes[0]?.id ?? '')?.id ?? scenes[0]?.mapId ?? 'battle-kakariko',
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    const thread = (parsed.oracleThread ?? []).filter((m) => !m.pending)
    const merged = { ...defaultState(), ...parsed, oracleThread: thread, oracleBusy: false }
    return {
      ...merged,
      party: (merged.party ?? []).map((c) => normalizeCharacter(c)),
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      oracleBusy: false,
      oracleThread: state.oracleThread.filter((m) => !m.pending),
    }),
  )
}
