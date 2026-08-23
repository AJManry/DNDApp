import type { Character, InventoryItem, SkillScore } from '../types'
import { ALL_SKILLS } from '../data/skills'
import { isCursorProvider } from './cursorAgent'
import { completeChat, loadLlmSettings, POLLINATIONS_CHAT_URL, type LlmSettings } from './llm'

const ANCESTRIES: { match: RegExp; name: string; speed: number }[] = [
  { match: /\bsheikah\b/, name: 'Sheikah', speed: 30 },
  { match: /\bgoron\b/, name: 'Goron', speed: 25 },
  { match: /\bzora\b/, name: 'Zora', speed: 30 },
  { match: /\bgerudo\b/, name: 'Gerudo', speed: 30 },
  { match: /\brito\b/, name: 'Rito', speed: 30 },
  { match: /\bkokiri\b/, name: 'Kokiri', speed: 25 },
  { match: /\bkorok\b/, name: 'Korok', speed: 25 },
  { match: /\btwili\b/, name: 'Twili', speed: 30 },
  { match: /\bhylian\b/, name: 'Hylian', speed: 30 },
]

const CLASSES: {
  match: RegExp
  className: string
  virtue: Character['virtue']
  abilities: Character['abilities']
  hp: number
  ac: number
  skills: string[]
  kit: { name: string; notes: string; rarity: InventoryItem['rarity'] }[]
}[] = [
  {
    match: /\b(wizard|mage|sorcerer|witch)\b/,
    className: 'Wizard 3 (School of Song)',
    virtue: 'Wisdom',
    abilities: { str: 8, dex: 14, con: 12, int: 16, wis: 13, cha: 10 },
    hp: 17,
    ac: 12,
    skills: ['Arcana', 'History', 'Investigation', 'Insight'],
    kit: [
      { name: 'Quarterstaff', notes: '+1 to hit, 1d6-1 bludgeoning.', rarity: 'common' },
      { name: 'Spellbook of Old Measures', notes: '1st: 4 slots, 2nd: 2. Mage Armor, Magic Missile, Shield, Sleep.', rarity: 'uncommon' },
    ],
  },
  {
    match: /\b(bard|singer|harp)\b/,
    className: 'Bard 3 (College of Lore)',
    virtue: 'Wisdom',
    abilities: { str: 8, dex: 14, con: 12, int: 10, wis: 12, cha: 16 },
    hp: 21,
    ac: 13,
    skills: ['Performance', 'Persuasion', 'Arcana', 'Insight'],
    kit: [
      { name: 'Rapier', notes: '+4 to hit, 1d8+2 piercing.', rarity: 'common' },
      { name: 'Goddess harp', notes: 'Instrument. Knows Zelda’s Lullaby as a performance.', rarity: 'story' },
    ],
  },
  {
    match: /\b(ranger|hunter|scout|archer|bow)\b/,
    className: 'Ranger 3 (Gloom Walker)',
    virtue: 'Courage',
    abilities: { str: 10, dex: 16, con: 14, int: 10, wis: 14, cha: 8 },
    hp: 24,
    ac: 14,
    skills: ['Stealth', 'Survival', 'Nature', 'Perception', 'Athletics'],
    kit: [
      { name: 'Shortbow', notes: '+5 to hit, 1d6+3 piercing, 80/320.', rarity: 'common' },
      { name: 'Two shortswords', notes: '+5 to hit, 1d6+3 piercing.', rarity: 'common' },
    ],
  },
  {
    match: /\b(paladin|knight|oath|cleric|priest)\b/,
    className: 'Paladin 3 (Oath of the Triforce)',
    virtue: 'Power',
    abilities: { str: 16, dex: 8, con: 14, int: 10, wis: 12, cha: 14 },
    hp: 28,
    ac: 18,
    skills: ['Athletics', 'Intimidation', 'Religion', 'Persuasion'],
    kit: [
      { name: 'Warhammer', notes: '+5 to hit, 1d8+3 bludgeoning.', rarity: 'common' },
      { name: 'Holy symbol of the Triforce', notes: 'Lay on Hands 15 hp.', rarity: 'story' },
    ],
  },
  {
    match: /\b(rogue|thief|assassin|ninja|sheikah monk|monk)\b/,
    className: 'Rogue 3 (Arcane Trickster)',
    virtue: 'Wisdom',
    abilities: { str: 8, dex: 16, con: 12, int: 14, wis: 13, cha: 10 },
    hp: 21,
    ac: 14,
    skills: ['Stealth', 'Sleight of Hand', 'Investigation', 'Acrobatics', 'Perception'],
    kit: [
      { name: 'Two shortswords', notes: '+5 to hit, 1d6+3 piercing. Sneak attack 2d6.', rarity: 'common' },
      { name: 'Sheikah wrappings', notes: 'Leather armor, AC 14.', rarity: 'common' },
    ],
  },
  {
    match: /\b(barbarian|berserker|bruiser)\b/,
    className: 'Barbarian 3 (Path of the Beast)',
    virtue: 'Power',
    abilities: { str: 16, dex: 14, con: 16, int: 8, wis: 10, cha: 8 },
    hp: 32,
    ac: 15,
    skills: ['Athletics', 'Intimidation', 'Survival', 'Perception'],
    kit: [
      { name: 'Greataxe', notes: '+5 to hit, 1d12+3 slashing.', rarity: 'common' },
      { name: 'Goron bracers', notes: 'Unarmored defense already in AC.', rarity: 'common' },
    ],
  },
  {
    match: /\b(druid|deku|forest sage)\b/,
    className: 'Druid 3 (Circle of the Land)',
    virtue: 'Wisdom',
    abilities: { str: 8, dex: 12, con: 14, int: 10, wis: 16, cha: 13 },
    hp: 24,
    ac: 13,
    skills: ['Nature', 'Survival', 'Medicine', 'Animal Handling'],
    kit: [
      { name: 'Scimitar', notes: '+3 to hit, 1d6+1 slashing.', rarity: 'common' },
      { name: 'Korok seed pouch', notes: 'Focus. Advantage on the first check with Koroks.', rarity: 'story' },
    ],
  },
  {
    match: /\b(fighter|warrior|swords?wo?man|soldier|champion)\b/,
    className: 'Fighter 3 (Battle Master)',
    virtue: 'Courage',
    abilities: { str: 16, dex: 12, con: 14, int: 8, wis: 10, cha: 13 },
    hp: 28,
    ac: 16,
    skills: ['Athletics', 'Intimidation', 'Perception', 'Survival'],
    kit: [
      { name: 'Longsword', notes: '+5 to hit, 1d8+3 slashing.', rarity: 'common' },
      { name: 'Hylian Shield', notes: '+2 AC, already included.', rarity: 'uncommon' },
    ],
  },
]

const DEFAULT_CLASS = CLASSES.find((c) => c.className.startsWith('Ranger')) ?? CLASSES[0]

const NAME_BANK: Record<string, string[]> = {
  Hylian: ['Tarin', 'Mila', 'Ordon', 'Kael'],
  Sheikah: ['Impazu', 'Kina', 'Paya-kin', 'Sheikari'],
  Goron: ['Darukor', 'Bludo-kin', 'Yun', 'Goro'],
  Zora: ['Luto', 'Sidonel', 'Ruta', 'Tila'],
  Gerudo: ['Aveil', 'Nabira', 'Riju-kai', 'Sara'],
  Rito: ['Tebael', 'Harth', 'Kosal', 'Revali-kin'],
  Kokiri: ['Fado', 'Saria-kin', 'Midoel', 'Know-It'],
  Korok: ['Hestu-kin', 'Peeka', 'Chio', 'Yaha'],
  Twili: ['Midnael', 'Zantari', 'Lani', 'Shade'],
}

export interface CharacterDraft {
  name?: string
  ancestry?: string
  className?: string
  level?: number
  virtue?: Character['virtue']
  hp?: number
  ac?: number
  speed?: number
  abilities?: Partial<Character['abilities']>
  proficientSkills?: string[]
  inventory?: { name: string; qty?: number; rarity?: InventoryItem['rarity']; notes?: string; equipped?: boolean }[]
  notes?: string
}

export function forgeFromPrompt(prompt: string): Character {
  const q = prompt.replace(/\s+/g, ' ').trim()
  const lower = q.toLowerCase()
  const ancestry = ANCESTRIES.find((a) => a.match.test(lower)) ?? { name: 'Hylian', speed: 30, match: /./ }
  const kit = CLASSES.find((c) => c.match.test(lower)) ?? DEFAULT_CLASS
  const virtue = virtueFrom(lower, kit.virtue)
  const name = nameFromPrompt(q) || pickName(ancestry.name, q)
  const notes = q
    ? `${q.replace(/^[A-Z]/, (c) => c.toLowerCase())} Forged for The Song of Time at 3rd level.`
    : kit.className
  return assembleCharacter({
    name,
    ancestry: ancestry.name,
    className: kit.className,
    virtue,
    hp: kit.hp,
    ac: kit.ac,
    speed: ancestry.speed,
    abilities: kit.abilities,
    proficientSkills: kit.skills,
    inventory: kit.kit.map((item) => ({ ...item, qty: 1, equipped: true })),
    notes,
  }, q)
}

function virtueFrom(lower: string, fallback: Character['virtue']): Character['virtue'] {
  if (/\bpower\b/.test(lower)) return 'Power'
  if (/\bwisdom\b/.test(lower)) return 'Wisdom'
  if (/\bcourage\b/.test(lower)) return 'Courage'
  return fallback
}

export function nameFromPrompt(prompt: string): string | null {
  const named = prompt.match(/\b(?:called|named)\s+["']?([A-Z][\w'-]{1,24})/)
  if (named?.[1]) return named[1]
  const leading = prompt.match(/^([A-Z][\w'-]{1,24})\s+(?:is|the|a|an)\b/)
  if (leading?.[1] && !/^(A|An|The|My)$/.test(leading[1])) return leading[1]
  return null
}

function pickName(ancestry: string, prompt: string): string {
  const bank = NAME_BANK[ancestry] ?? NAME_BANK.Hylian
  let h = 2166136261
  for (let i = 0; i < prompt.length; i += 1) {
    h ^= prompt.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return bank[(h >>> 0) % bank.length]
}

function skillsFrom(proficient: string[] = []): SkillScore[] {
  const set = new Set(proficient.map((s) => s.toLowerCase()))
  return ALL_SKILLS.map((s) => ({ ...s, proficient: set.has(s.name.toLowerCase()) }))
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.max(min, Math.min(max, Math.round(n)))
}

export function assembleCharacter(draft: CharacterDraft, prompt = ''): Character {
  const abilities = {
    str: clamp(draft.abilities?.str ?? 12, 8, 18),
    dex: clamp(draft.abilities?.dex ?? 12, 8, 18),
    con: clamp(draft.abilities?.con ?? 12, 8, 18),
    int: clamp(draft.abilities?.int ?? 10, 8, 18),
    wis: clamp(draft.abilities?.wis ?? 12, 8, 18),
    cha: clamp(draft.abilities?.cha ?? 10, 8, 18),
  }
  const hp = clamp(draft.hp ?? 22, 10, 40)
  const inventory: InventoryItem[] = (draft.inventory ?? []).slice(0, 8).map((it, i) => ({
    id: `it-${Date.now().toString(36)}-${i}`,
    name: it.name.slice(0, 48),
    qty: clamp(it.qty ?? 1, 1, 99),
    rarity: it.rarity ?? 'common',
    notes: (it.notes ?? '').slice(0, 180),
    equipped: Boolean(it.equipped),
  }))
  const virtue = draft.virtue === 'Courage' || draft.virtue === 'Wisdom' || draft.virtue === 'Power' ? draft.virtue : 'Courage'
  const hero: Character = {
    id: `pc-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    name: (draft.name || 'New adventurer').slice(0, 40),
    ancestry: (draft.ancestry || 'Hylian').slice(0, 24),
    className: (draft.className || 'Fighter 3').slice(0, 48),
    level: 3,
    hp: { current: hp, max: hp },
    ac: clamp(draft.ac ?? 14, 10, 20),
    speed: clamp(draft.speed ?? 30, 20, 40),
    abilities,
    skills: skillsFrom(draft.proficientSkills),
    inventory,
    conditions: [],
    inspiration: false,
    deathSaves: { success: 0, fail: 0 },
    notes: (draft.notes || prompt).slice(0, 500),
    virtue,
    portrait: portraitUrl(draft.name || 'adventurer', draft.ancestry || 'Hylian', prompt),
  }
  return hero
}

export function portraitUrl(name: string, ancestry: string, prompt: string): string {
  const text = [
    'Oil painting portrait, Breath of the Wild and Tears of the Kingdom style,',
    `${name}, a ${ancestry} adventurer of Hyrule,`,
    prompt.slice(0, 140),
    'chest-up, dusk light, no text, no watermark',
  ].join(' ')
  let seed = 1
  for (let i = 0; i < text.length; i += 1) seed = (seed * 31 + text.charCodeAt(i)) % 1_000_000
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=640&height=640&nologo=true&seed=${seed}`
}

export function parseCharacterReply(raw: string): CharacterDraft | null {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced?.[1]?.trim() ?? trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try {
    const obj = JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>
    if (!obj || typeof obj !== 'object') return null
    const abilities = asRecord(obj.abilities)
    const inventory = Array.isArray(obj.inventory) ? obj.inventory : []
    const skills = Array.isArray(obj.proficientSkills)
      ? obj.proficientSkills.filter((s): s is string => typeof s === 'string')
      : []
    return {
      name: asString(obj.name),
      ancestry: asString(obj.ancestry),
      className: asString(obj.className),
      virtue: asString(obj.virtue) as Character['virtue'],
      hp: asNumber(obj.hp) ?? asNumber(obj.hpMax),
      ac: asNumber(obj.ac),
      speed: asNumber(obj.speed),
      abilities: abilities
        ? {
            str: asNumber(abilities.str),
            dex: asNumber(abilities.dex),
            con: asNumber(abilities.con),
            int: asNumber(abilities.int),
            wis: asNumber(abilities.wis),
            cha: asNumber(abilities.cha),
          }
        : undefined,
      proficientSkills: skills,
      inventory: inventory
        .filter((it): it is Record<string, unknown> => Boolean(it) && typeof it === 'object')
        .map((it) => ({
          name: asString(it.name) || 'Item',
          qty: asNumber(it.qty) ?? 1,
          rarity: (asString(it.rarity) as InventoryItem['rarity']) || 'common',
          notes: asString(it.notes) || '',
          equipped: Boolean(it.equipped),
        })),
      notes: asString(obj.notes),
    }
  } catch {
    return null
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

export function forgeSystemPrompt(): string {
  return [
    'You create a 3rd-level D&D 5e player character for a Legend of Zelda one-shot set in Hyrule (The Song of Time).',
    'Ancestries: Hylian, Sheikah, Goron, Zora, Gerudo, Rito, Kokiri, Korok, Twili.',
    'Give a Triforce virtue: Courage, Wisdom, or Power.',
    'Reply with ONLY JSON, no markdown fence:',
    '{"name":"","ancestry":"","className":"Ranger 3 (Gloom Walker)","virtue":"Courage","hp":24,"ac":14,"speed":30,',
    '"abilities":{"str":10,"dex":16,"con":14,"int":10,"wis":14,"cha":8},"proficientSkills":["Stealth","Survival"],',
    '"inventory":[{"name":"Shortbow","qty":1,"rarity":"common","notes":"+5 to hit","equipped":true}],',
    '"notes":"two sentences of backstory"}',
  ].join(' ')
}

function settingsForForge(settings: LlmSettings): LlmSettings {
  if (isCursorProvider(settings)) {
    return { ...settings, baseUrl: POLLINATIONS_CHAT_URL, model: 'openai', apiKey: '' }
  }
  return settings
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Character forge timed out')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

export async function generateCharacterFromPrompt(prompt: string): Promise<Character> {
  const q = prompt.replace(/\s+/g, ' ').trim()
  const local = forgeFromPrompt(q)
  if (!q) return local
  try {
    const raw = await withTimeout(
      completeChat(
        [
          { role: 'system', content: forgeSystemPrompt() },
          { role: 'user', content: q },
        ],
        settingsForForge(loadLlmSettings()),
      ),
      12000,
    )
    const draft = parseCharacterReply(raw)
    if (!draft?.name) return local
    const localSkills = local.skills.filter((s) => s.proficient).map((s) => s.name)
    return assembleCharacter(
      {
        ...draft,
        proficientSkills: draft.proficientSkills?.length ? draft.proficientSkills : localSkills,
        inventory: draft.inventory?.length
          ? draft.inventory
          : local.inventory.map((it) => ({
              name: it.name,
              qty: it.qty,
              rarity: it.rarity,
              notes: it.notes,
              equipped: it.equipped,
            })),
        notes: draft.notes || q,
      },
      q,
    )
  } catch {
    return local
  }
}
