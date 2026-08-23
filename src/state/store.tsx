import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react'
import { allLore } from '../data/corpus'
import { scenes } from '../data/campaign'
import { battleMapForScene } from '../data/maps'
import { rollDice } from '../lib/dice'
import { isCursorProvider } from '../lib/cursorAgent'
import { loadLlmSettings, saveLlmSettings, type LlmSettings } from '../lib/llm'
import { makeGeneratedMap } from '../lib/mapStudio'
import { askSage, type SageAskResult } from '../lib/sage'
import { defaultState, loadState, saveState } from '../lib/storage'
import { emptyTactics } from '../lib/tactics'
import type {
  AppState,
  Character,
  Combatant,
  GeneratedMap,
  InventoryItem,
  LoreEntry,
  MapTactics,
  MapToken,
  TabId,
} from '../types'

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'tab'; tab: TabId }
  | { type: 'query'; query: string }
  | { type: 'ask-start'; query: string; pendingText?: string }
  | { type: 'ask-finish'; payload: SageAskResult }
  | { type: 'ask-error'; message: string }
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
  | { type: 'set-tactics'; board: MapTactics }
  | { type: 'move-token'; mapId: string; tokenId: string; x: number; y: number }
  | { type: 'add-token'; mapId: string; token: MapToken }
  | { type: 'remove-token'; mapId: string; tokenId: string }
  | { type: 'patch-tactics'; mapId: string; patch: Partial<Pick<MapTactics, 'showGrid' | 'gridCols' | 'feetPerSquare'>> }
  | { type: 'active-map'; id: string }
  | { type: 'reset' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'tab':
      return { ...state, tab: action.tab }
    case 'query':
      return { ...state, oracleQuery: action.query }
    case 'ask-start': {
      const q = action.query.trim()
      if (!q || state.oracleBusy) return state
      return {
        ...state,
        oracleQuery: '',
        tab: 'oracle',
        oracleBusy: true,
        oracleThread: [
          ...state.oracleThread,
          { id: `u-${Date.now()}`, role: 'user', text: q, query: q },
          {
            id: 's-pending',
            role: 'sage',
            text: action.pendingText || 'Impa is listening to the Goddesses…',
            pending: true,
          },
        ],
      }
    }
    case 'ask-finish': {
      const created: LoreEntry[] = action.payload.created
        ? [...state.customLore, action.payload.created]
        : state.customLore
      return {
        ...state,
        oracleBusy: false,
        customLore: created,
        tab: action.payload.mapPrompt ? 'maps' : state.tab,
        oracleThread: state.oracleThread.map((m) =>
          m.pending
            ? {
                id: `s-${Date.now()}`,
                role: 'sage',
                text: action.payload.text,
                hitIds: action.payload.hitIds,
                createdLoreId: action.payload.createdLoreId,
                mapPrompt: action.payload.mapPrompt,
              }
            : m,
        ),
        maps: action.payload.mapPrompt
          ? upsertMap(state.maps, makeGeneratedMap(action.payload.mapPrompt))
          : state.maps,
      }
    }
    case 'ask-error':
      return {
        ...state,
        oracleBusy: false,
        oracleThread: state.oracleThread.map((m) =>
          m.pending
            ? {
                id: `s-${Date.now()}`,
                role: 'sage',
                text: `The oracle could not reach a model. ${action.message}`,
              }
            : m,
        ),
      }
    case 'scene': {
      const next = scenes.find((s) => s.id === action.id)
      return {
        ...state,
        sceneId: action.id,
        activeMapId: battleMapForScene(action.id)?.id ?? next?.mapId ?? state.activeMapId,
      }
    }
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
        tactics: stripTokenRef(state.tactics, `pc-${action.id}`),
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
      return { ...state, maps: upsertMap(state.maps, action.map), activeMapId: action.map.id }
    case 'set-tactics':
      return { ...state, tactics: { ...state.tactics, [action.board.mapId]: action.board } }
    case 'move-token': {
      const board = state.tactics[action.mapId] ?? emptyTactics(action.mapId)
      return {
        ...state,
        tactics: {
          ...state.tactics,
          [action.mapId]: {
            ...board,
            tokens: board.tokens.map((t) =>
              t.id === action.tokenId ? { ...t, x: action.x, y: action.y } : t,
            ),
          },
        },
      }
    }
    case 'add-token': {
      const board = state.tactics[action.mapId] ?? emptyTactics(action.mapId)
      return {
        ...state,
        tactics: {
          ...state.tactics,
          [action.mapId]: { ...board, tokens: [...board.tokens, action.token] },
        },
      }
    }
    case 'remove-token': {
      const board = state.tactics[action.mapId]
      if (!board) return state
      return {
        ...state,
        tactics: {
          ...state.tactics,
          [action.mapId]: { ...board, tokens: board.tokens.filter((t) => t.id !== action.tokenId) },
        },
      }
    }
    case 'patch-tactics': {
      const board = state.tactics[action.mapId] ?? emptyTactics(action.mapId)
      return {
        ...state,
        tactics: { ...state.tactics, [action.mapId]: { ...board, ...action.patch } },
      }
    }
    case 'active-map':
      return { ...state, activeMapId: action.id }
    case 'reset':
      return defaultState()
    default:
      return state
  }
}

function upsertMap(maps: GeneratedMap[], map: GeneratedMap): GeneratedMap[] {
  return [map, ...maps.filter((m) => m.id !== map.id)].slice(0, 24)
}

function stripTokenRef(tactics: Record<string, MapTactics>, tokenId: string): Record<string, MapTactics> {
  const next: Record<string, MapTactics> = {}
  for (const [id, board] of Object.entries(tactics)) {
    next[id] = { ...board, tokens: board.tokens.filter((t) => t.id !== tokenId && t.refId !== tokenId.replace(/^pc-/, '')) }
  }
  return next
}

interface StoreValue {
  state: AppState
  dispatch: Dispatch<Action>
  askOracle: (query: string) => void
  llmSettings: LlmSettings
  setLlmSettings: (settings: LlmSettings) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function HyruleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const stateRef = useRef(state)
  stateRef.current = state
  const [llmSettings, setLlmSettingsState] = useState(loadLlmSettings)

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

  const askOracle = useCallback((query: string) => {
    const q = query.trim()
    const snap = stateRef.current
    if (!q || snap.oracleBusy) return
    const settings = loadLlmSettings()
    dispatch({
      type: 'ask-start',
      query: q,
      pendingText: isCursorProvider(settings)
        ? 'Impa is searching the Sheikah records through Cursor… the first answer can take a minute.'
        : 'Impa is listening to the Goddesses…',
    })
    void askSage({
      query: q,
      entries: allLore(snap.customLore),
      secretsRevealed: snap.secretsRevealed,
      history: snap.oracleThread,
      settings,
    })
      .then((payload) => {
        if (payload.cursorAgentId) {
          const next = { ...loadLlmSettings(), cursorAgentId: payload.cursorAgentId }
          saveLlmSettings(next)
          setLlmSettingsState(next)
        }
        dispatch({ type: 'ask-finish', payload })
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error'
        dispatch({ type: 'ask-error', message })
      })
  }, [])

  const setLlmSettings = useCallback((settings: LlmSettings) => {
    saveLlmSettings(settings)
    setLlmSettingsState(settings)
  }, [])

  const value = useMemo(
    () => ({ state, dispatch, askOracle, llmSettings, setLlmSettings }),
    [state, askOracle, llmSettings, setLlmSettings],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// Hook colocated with the provider so table views share one store.
// oxlint-disable-next-line react/only-export-components
export function useHyrule() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('Hyrule store missing')
  return ctx
}
