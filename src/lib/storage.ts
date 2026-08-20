import { pregens } from '../data/pregens'
import { scenes } from '../data/campaign'
import type { AppState } from '../types'

export const STORAGE_KEY = 'hyrule-state-v1'

export function defaultState(): AppState {
  return {
    tab: 'play',
    oracleQuery: '',
    oracleThread: [],
    oracleBusy: false,
    party: structuredClone(pregens),
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
    activeMapId: scenes[0]?.mapId ?? 'map-kakariko',
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    const thread = (parsed.oracleThread ?? []).filter((m) => !m.pending)
    return { ...defaultState(), ...parsed, oracleThread: thread, oracleBusy: false }
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
