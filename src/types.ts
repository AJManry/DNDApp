export type TabId = 'home' | 'play' | 'oracle' | 'maps' | 'party' | 'handouts' | 'journal'

export type LoreKind =
  | 'location'
  | 'npc'
  | 'item'
  | 'faction'
  | 'creature'
  | 'lore'
  | 'rule'
  | 'scene'
  | 'secret'
  | 'custom'

export interface LoreEntry {
  id: string
  title: string
  kind: LoreKind
  tags: string[]
  summary: string
  body: string
  secrets?: string
  relatedIds?: string[]
  image?: string
}

export interface SkillCheck {
  name: string
  dc: number
  ability: string
  success: string
  failure: string
}

export interface SceneOption {
  name: string
  text: string
  dc?: number
  ability?: string
  success?: string
  failure?: string
  clock?: string
}

export interface Scene {
  id: string
  act: 1 | 2 | 3 | 4 | 5
  title: string
  minuteStart: number
  minuteEnd: number
  boxedText: string
  dmNotes: string
  summary?: string
  whatsHappening?: string
  options?: SceneOption[]
  npcs?: string[]
  skillChecks?: SkillCheck[]
  encounterIds?: string[]
  mapId?: string
  battleMapId?: string
  treasure?: string
  optional?: boolean
}

export interface MonsterAction {
  name: string
  text: string
}

export interface StatBlock {
  id: string
  name: string
  cr: string
  type: string
  ac: number
  hp: number
  speed: string
  stats: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
  traits: string[]
  actions: MonsterAction[]
  legendary?: MonsterAction[]
}

export interface InventoryItem {
  id: string
  name: string
  qty: number
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'story'
  notes: string
  equipped?: boolean
}

export interface SkillScore {
  name: string
  ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'
  proficient: boolean
}

export interface Character {
  id: string
  name: string
  ancestry: string
  className: string
  level: number
  portrait?: string
  hp: { current: number; max: number }
  ac: number
  speed: number
  abilities: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
  skills: SkillScore[]
  inventory: InventoryItem[]
  conditions: string[]
  inspiration: boolean
  deathSaves: { success: number; fail: number }
  notes: string
  virtue?: 'Courage' | 'Wisdom' | 'Power'
}

export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number
  maxHp: number
  ac: number
  isPlayer: boolean
}

export interface GeneratedMap {
  id: string
  prompt: string
  enhancedPrompt: string
  imageUrl: string
  biome: string
  createdAt: number
  campaign?: boolean
  title?: string
  artSrc?: string
}

export type TokenRole = 'pc' | 'npc' | 'foe' | 'marker'

export interface MapToken {
  id: string
  name: string
  role: TokenRole
  refId?: string
  x: number
  y: number
  speed: number
  portrait?: string
  color: string
}

export interface MapTactics {
  mapId: string
  tokens: MapToken[]
  showGrid: boolean
  gridCols: number
  feetPerSquare: number
}

export interface OracleMessage {
  id: string
  role: 'user' | 'sage'
  text: string
  query?: string
  hitIds?: string[]
  createdLoreId?: string
  mapPrompt?: string
  pending?: boolean
}

export interface DiceLog {
  id: string
  label: string
  sides: number
  result: number
  at: number
}

export interface AppState {
  tab: TabId
  oracleQuery: string
  oracleThread: OracleMessage[]
  oracleBusy: boolean
  party: Character[]
  selectedCharacterId: string | null
  initiative: Combatant[]
  sceneId: string
  completedSceneIds: string[]
  twilightClock: number
  sessionStartedAt: number | null
  sessionElapsedMs: number
  journal: string
  customLore: LoreEntry[]
  maps: GeneratedMap[]
  secretsRevealed: boolean
  diceLog: DiceLog[]
  tactics: Record<string, MapTactics>
  activeMapId: string
}
