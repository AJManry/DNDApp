import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { allLore } from '../data/corpus'
import { rollDice } from '../lib/dice'
import { consultSage } from '../lib/sage'
import { makeGeneratedMap } from '../lib/mapStudio'
import { defaultState, loadState, saveState } from '../lib/storage'
import type {
  AppState,
  Character,
  Combatant,
  GeneratedMap,
  InventoryItem,
  LoreEntry,
  TabId,
} from '../types'

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'tab'; tab: TabId }
  | { type: 'query'; query: string }
  | { type: 'ask'; query: string }
  | { type: 'scene'; id: string }
  | { type: 'toggle-scene'; id: string }
  | { type: 'clock'; value: number }
  | { type: 'secrets'; value: boolean }
  | { type: 'start-session' }
  | { type: 'tick'; ms: number }
  | { type: 'journal'; text: string }
  | { type: 'select-character'; id: string | null }
  | { type: 'patch-character'; id: string; patch: Partial<Character> }
  | { type: 'add-character'; character: Character }
  | { type: 'remove-character'; id: string }
  | { type: 'add-item'; characterId: string; item: InventoryItem }
  | { type: 'patch-item'; characterId: string; itemId: string; patch: Partial<InventoryItem> }
  | { type: 'remove-item'; characterId: string; itemId: string }
  | { type: 'initiative'; list: Combatant[] }
  | { type: 'roll'; expr: string; label?: string }
  | { type: 'add-map'; map: GeneratedMap }
  | { type: 'reset' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'tab':
      return { ...state, tab: action.tab }
    case 'query':
      return { ...state, oracleQuery: action.query }
    case 'ask': {
      const q = action.query.trim()
      if (!q) return state
      const entries = allLore(state.customLore)
      const result = consultSage(q, entries)
      const created: LoreEntry[] = result.created ? [...state.customLore, result.created] : state.customLore
      return {
        ...state,
        oracleQuery: '',
        customLore: created,
        tab: result.mapPrompt ? 'maps' : state.tab,
        oracleThread: [
          ...state.oracleThread,
          {
            id: `u-${Date.now()}`,
            role: 'user',
            text: q,
            query: q,
          },
          {
            id: `s-${Date.now()}`,
            role: 'sage',
            text: result.text,
            query: q,
            hitIds: result.hitIds,
            createdLoreId: result.createdLoreId,
            mapPrompt: result.mapPrompt,
          },
        ],
        maps: result.mapPrompt
          ? upsertMap(state.maps, makeGeneratedMap(result.mapPrompt))
          : state.maps,
      }
    }
    case 'scene':
      return { ...state, sceneId: action.id }
    case 'toggle-scene': {
      const has = state.completedSceneIds.includes(action.id)
      return {
        ...state,
        completedSceneIds: has
          ? state.completedSceneIds.filter((id) => id !== action.id)
          : [...state.completedSceneIds, action.id],
      }
    }
    case 'clock':
      return { ...state, twilightClock: Math.max(0, Math.min(6, action.value)) }
    case 'secrets':
      return { ...state, secretsRevealed: action.value }
    case 'start-session':
      return { ...state, sessionStartedAt: Date.now(), sessionElapsedMs: 0 }
    case 'tick':
      return { ...state, sessionElapsedMs: action.ms }
    case 'journal':
      return { ...state, journal: action.text }
    case 'select-character':
      return { ...state, selectedCharacterId: action.id }
    case 'patch-character':
      return {
        ...state,
        party: state.party.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
      }
    case 'add-character':
      return {
        ...state,
        party: [...state.party, action.character],
        selectedCharacterId: action.character.id,
      }
    case 'remove-character':
      return {
        ...state,
        party: state.party.filter((c) => c.id !== action.id),
        selectedCharacterId:
          state.selectedCharacterId === action.id ? (state.party[0]?.id ?? null) : state.selectedCharacterId,
      }
    case 'add-item':
      return {
        ...state,
        party: state.party.map((c) =>
          c.id === action.characterId ? { ...c, inventory: [...c.inventory, action.item] } : c,
        ),
      }
    case 'patch-item':
      return {
        ...state,
        party: state.party.map((c) =>
          c.id === action.characterId
            ? {
                ...c,
                inventory: c.inventory.map((it) => (it.id === action.itemId ? { ...it, ...action.patch } : it)),
              }
            : c,
        ),
      }
    case 'remove-item':
      return {
        ...state,
        party: state.party.map((c) =>
          c.id === action.characterId
            ? { ...c, inventory: c.inventory.filter((it) => it.id !== action.itemId) }
            : c,
        ),
      }
    case 'initiative':
      return { ...state, initiative: action.list }
    case 'roll': {
      const rolled = rollDice(action.expr)
      return {
        ...state,
        diceLog: [
          {
            id: `d-${Date.now()}`,
            label: action.label ?? rolled.label,
            sides: rolled.sides,
            result: rolled.result,
            at: Date.now(),
          },
          ...state.diceLog,
        ].slice(0, 12),
      }
    }
    case 'add-map':
      return { ...state, maps: upsertMap(state.maps, action.map) }
    case 'reset':
      return defaultState()
    default:
      return state
  }
}

function upsertMap(maps: GeneratedMap[], map: GeneratedMap): GeneratedMap[] {
  return [map, ...maps.filter((m) => m.id !== map.id)].slice(0, 24)
}

const StoreContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null)

export function SagekeepProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    if (!state.sessionStartedAt) return
    const id = window.setInterval(() => {
      dispatch({ type: 'tick', ms: Date.now() - (state.sessionStartedAt as number) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [state.sessionStartedAt])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// Hook colocated with the provider so table views share one store.
// oxlint-disable-next-line react/only-export-components
export function useSagekeep() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('Sagekeep store missing')
  return ctx
}
