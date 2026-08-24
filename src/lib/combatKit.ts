import type { Character, CombatMove, InventoryItem, SkillScore } from '../types'
import { ALL_SKILLS } from '../data/skills'

export type CombatMoveDraft = Partial<CombatMove> & { name?: string }

const FIGHTER_KIT = {
  attacks: [
    move('atk-sword', 'Longsword', 'd20+5', '1d8+3 slashing', '5 ft', 'Versatile 1d10+3 if used in two hands.'),
    move('atk-javelin', 'Javelin', 'd20+5', '1d6+3 piercing', '30/120 ft', 'Thrown. Keep a few on the belt.'),
  ],
  spells: [
    move(
      'spl-nayru',
      'Nayru’s Love',
      'reaction',
      '+5 AC until your next turn',
      'self',
      'When you are hit, the Goddess’s barrier may turn it into a miss. 1/short rest or a 1st-level slot.',
    ),
    move(
      'spl-spin',
      'Spin Attack',
      'DC 13 DEX',
      '2d6 slashing',
      '5-ft self',
      'Each creature you choose within 5 feet. Success: half damage. 1 superiority die or a 1st-level slot.',
    ),
  ],
}

const WIZARD_KIT = {
  attacks: [
    move('atk-staff', 'Sheikah staff', 'd20+4', '1d6+2 bludgeoning', '5 ft', 'Also your arcane focus.'),
    move('atk-needles', 'Thrown needles', 'd20+4', '1d4+2 piercing', '20/60 ft', 'Finesse, thrown.'),
  ],
  spells: [
    move(
      'spl-missile',
      'Magic Missile',
      'auto-hit',
      '1d4+1 force × 3',
      '120 ft',
      'No attack. Roll 1d4+1 force for each of 3 darts; all hit. 1st-level slot.',
    ),
    move(
      'spl-shatter',
      'Shatter',
      'DC 13 CON',
      '3d8 thunder',
      '60 ft, 10-ft radius',
      'They roll CON versus DC 13. Fail: full damage. Success: half. 2nd-level slot.',
    ),
  ],
}

const RANGER_KIT = {
  attacks: [
    move('atk-bow', 'Shortbow', 'd20+5', '1d6+3 piercing', '80/320 ft', 'Two-handed. 20 arrows.'),
    move('atk-shortsword', 'Shortsword', 'd20+5', '1d6+3 piercing', '5 ft', 'Finesse. Bonus action: a second shortsword (no Dex to damage).'),
  ],
  spells: [
    move(
      'spl-mark',
      'Hunter’s Mark',
      'bonus action',
      '+1d6 vs marked',
      '90 ft',
      'Until you drop it, extra 1d6 damage on hits against that target. 1st-level slot.',
    ),
    move(
      'spl-thorns',
      'Hail of Thorns',
      'DC 12 DEX',
      '1d10 piercing',
      '5 ft of the target',
      'When you hit with the bow, thorns burst. Fail: 1d10 piercing to the target and creatures within 5 feet. Success: half. 1st-level slot.',
    ),
  ],
}

const PALADIN_KIT = {
  attacks: [
    move('atk-hammer', 'Warhammer', 'd20+5', '1d8+3 bludgeoning', '5 ft', 'Versatile 1d10+3.'),
    move('atk-javelin', 'Javelin', 'd20+5', '1d6+3 piercing', '30/120 ft', 'Thrown.'),
  ],
  spells: [
    move(
      'spl-smite',
      'Divine Smite',
      'on a melee hit',
      '+2d8 radiant',
      '5 ft',
      'Spend a 1st-level slot when you hit. +1d8 more against undead or twilight creatures.',
    ),
    move(
      'spl-breath',
      'Breath of the mountain',
      'DC 12 DEX',
      '2d6 fire',
      '15-ft cone',
      'Fail: full damage. Success: half. 1/short rest, or a 1st-level slot.',
    ),
  ],
}

const BARD_KIT = {
  attacks: [
    move('atk-rapier', 'Rapier', 'd20+4', '1d8+2 piercing', '5 ft', 'Finesse.'),
    move('atk-dagger', 'Dagger', 'd20+4', '1d4+2 piercing', '20/60 ft', 'Finesse, thrown.'),
  ],
  spells: [
    move(
      'spl-word',
      'Healing Word',
      'bonus action',
      '1d4+3 HP',
      '60 ft',
      'A creature you can see regains 1d4 + Cha HP. 1st-level slot.',
    ),
    move(
      'spl-shatter',
      'Shatter',
      'DC 13 CON',
      '3d8 thunder',
      '60 ft, 10-ft radius',
      'Fail: full damage. Success: half. 2nd-level slot.',
    ),
  ],
}

const ROGUE_KIT = {
  attacks: [
    move('atk-shortsword', 'Shortsword', 'd20+5', '1d6+3 piercing', '5 ft', 'Finesse. Sneak Attack +2d6 once per turn.'),
    move('atk-bow', 'Shortbow', 'd20+5', '1d6+3 piercing', '80/320 ft', 'Two-handed.'),
  ],
  spells: [
    move(
      'spl-bolt',
      'Chromatic Orb',
      'd20+4',
      '3d8 (choose type)',
      '90 ft',
      'Spell attack. Choose fire, cold, lightning, thunder, acid, or poison. 1st-level slot.',
    ),
    move(
      'spl-invis',
      'Invisibility',
      'action',
      'invisible until you attack',
      'touch',
      'You or an ally. Ends if the target attacks or casts. 2nd-level slot.',
    ),
  ],
}

const BARBARIAN_KIT = {
  attacks: [
    move('atk-axe', 'Greataxe', 'd20+5', '1d12+3 slashing', '5 ft', 'Two-handed. +2 damage while raging.'),
    move('atk-javelin', 'Javelin', 'd20+5', '1d6+3 piercing', '30/120 ft', 'Thrown.'),
  ],
  spells: [
    move(
      'spl-daruk',
      'Daruk’s Protection',
      'reaction',
      '+5 AC until your next turn',
      'self',
      'Stone plates when you are hit. 1/short rest.',
    ),
    move(
      'spl-fire',
      'Fire Breath',
      'DC 13 DEX',
      '2d6 fire',
      '15-ft cone',
      'Fail: full damage. Success: half. 1/short rest.',
    ),
  ],
}

const DRUID_KIT = {
  attacks: [
    move('atk-scimitar', 'Scimitar', 'd20+3', '1d6+1 slashing', '5 ft', 'Finesse.'),
    move('atk-flame', 'Produce Flame', 'd20+5', '1d8 fire', '30 ft', 'Cantrip. Also sheds bright light 10 ft.'),
  ],
  spells: [
    move(
      'spl-entangle',
      'Entangle',
      'DC 13 STR',
      'restrained in vines',
      '90 ft, 20-ft square',
      'Fail: restrained until they break free (Athletics vs DC 13). Difficult terrain. 1st-level slot.',
    ),
    move(
      'spl-moon',
      'Moonbeam',
      'DC 13 CON',
      '2d10 radiant',
      '120 ft, 5-ft radius',
      'A silver pillar. Fail: full damage. Success: half. Twilight creatures have disadvantage. 2nd-level slot.',
    ),
  ],
}

function move(
  id: string,
  name: string,
  hit: string,
  damage: string,
  range: string,
  notes: string,
): CombatMove {
  return { id, name, hit, damage, range, notes }
}

export function kitForClass(className: string): { attacks: CombatMove[]; spells: CombatMove[] } {
  const c = String(className ?? '').toLowerCase()
  if (/wizard|mage|sorcerer|witch/.test(c)) return cloneKit(WIZARD_KIT)
  if (/\bbard\b|singer|harp/.test(c)) return cloneKit(BARD_KIT)
  if (/ranger|hunter|scout|archer/.test(c)) return cloneKit(RANGER_KIT)
  if (/paladin|cleric|priest|oath/.test(c)) return cloneKit(PALADIN_KIT)
  if (/rogue|thief|assassin|trickster/.test(c)) return cloneKit(ROGUE_KIT)
  if (/barbarian|berserker/.test(c)) return cloneKit(BARBARIAN_KIT)
  if (/druid|deku/.test(c)) return cloneKit(DRUID_KIT)
  if (/fighter|warrior|soldier|champion/.test(c)) return cloneKit(FIGHTER_KIT)
  return cloneKit(RANGER_KIT)
}

function cloneKit(kit: { attacks: CombatMove[]; spells: CombatMove[] }) {
  return {
    attacks: kit.attacks.map((m) => ({ ...m })),
    spells: kit.spells.map((m) => ({ ...m })),
  }
}

export function normalizeMove(raw: CombatMoveDraft | undefined, prefix: string, index: number): CombatMove | null {
  if (!raw || typeof raw !== 'object') return null
  const name = String(raw.name ?? '').trim().slice(0, 48)
  if (!name) return null
  return {
    id: String(raw.id || `${prefix}-${index}`).slice(0, 48),
    name,
    hit: String(raw.hit || 'd20+0').trim().slice(0, 40),
    damage: String(raw.damage || '—').trim().slice(0, 80),
    range: String(raw.range || '5 ft').trim().slice(0, 40),
    notes: String(raw.notes || '').trim().slice(0, 280),
  }
}

export function padMoves(
  existing: CombatMoveDraft[] | unknown,
  fallback: CombatMove[],
  prefix: string,
): CombatMove[] {
  const source = Array.isArray(existing)
    ? existing
    : existing && typeof existing === 'object'
      ? [existing]
      : []
  const list: CombatMove[] = []
  for (const [i, raw] of source.entries()) {
    const next = normalizeMove(raw as CombatMoveDraft, prefix, i)
    if (next) list.push(next)
  }
  for (const fb of fallback) {
    if (list.length >= 2) break
    if (list.some((m) => m.name.toLowerCase() === fb.name.toLowerCase())) continue
    list.push({ ...fb, id: `${prefix}-${list.length}-${fb.id}` })
  }
  while (list.length < 2 && fallback.length) {
    const fb = fallback[list.length % fallback.length]
    list.push({ ...fb, id: `${prefix}-pad-${list.length}` })
  }
  return list
}

export function ensureCombatKit(
  className: string,
  attacks?: CombatMoveDraft[],
  spells?: CombatMoveDraft[],
): { attacks: CombatMove[]; spells: CombatMove[] } {
  const kit = kitForClass(className)
  return {
    attacks: padMoves(attacks, kit.attacks, 'atk'),
    spells: padMoves(spells, kit.spells, 'spl'),
  }
}

export function normalizeCharacter(character: Partial<Character> & { id?: string; name?: string }): Character {
  try {
    const className = String(character.className || 'Fighter 3').slice(0, 48)
    const kit = ensureCombatKit(className, character.attacks, character.spells)
    const hpMax = num(character.hp && typeof character.hp === 'object' ? character.hp.max : character.hp, 22)
    const hpCurrent = num(character.hp && typeof character.hp === 'object' ? character.hp.current : hpMax, hpMax)
    return {
      id: String(character.id || 'pc-new'),
      name: String(character.name || 'New adventurer').slice(0, 40),
      ancestry: String(character.ancestry || 'Hylian').slice(0, 24),
      className,
      level: num(character.level, 3) || 3,
      portrait: typeof character.portrait === 'string' ? character.portrait : undefined,
      hp: { current: hpCurrent, max: Math.max(1, hpMax) },
      ac: num(character.ac, 14),
      speed: num(character.speed, 30),
      abilities: {
        str: num(character.abilities?.str, 12),
        dex: num(character.abilities?.dex, 12),
        con: num(character.abilities?.con, 12),
        int: num(character.abilities?.int, 10),
        wis: num(character.abilities?.wis, 12),
        cha: num(character.abilities?.cha, 10),
      },
      skills: sanitizeSkills(character.skills),
      attacks: kit.attacks,
      spells: kit.spells,
      inventory: sanitizeInventory(character.inventory),
      conditions: Array.isArray(character.conditions)
        ? character.conditions.filter((c): c is string => typeof c === 'string')
        : [],
      inspiration: Boolean(character.inspiration),
      deathSaves: {
        success: num(character.deathSaves?.success, 0),
        fail: num(character.deathSaves?.fail, 0),
      },
      notes: typeof character.notes === 'string' ? character.notes : '',
      virtue:
        character.virtue === 'Courage' || character.virtue === 'Wisdom' || character.virtue === 'Power'
          ? character.virtue
          : undefined,
    }
  } catch {
    const kit = kitForClass('Fighter 3')
    return {
      id: String(character?.id || 'pc-new'),
      name: String(character?.name || 'New adventurer').slice(0, 40),
      ancestry: 'Hylian',
      className: 'Fighter 3',
      level: 3,
      hp: { current: 22, max: 22 },
      ac: 15,
      speed: 30,
      abilities: { str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8 },
      skills: ALL_SKILLS.map((s) => ({ ...s })),
      attacks: kit.attacks,
      spells: kit.spells,
      inventory: [],
      conditions: [],
      inspiration: false,
      deathSaves: { success: 0, fail: 0 },
      notes: '',
      virtue: 'Courage',
    }
  }
}

function num(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return fallback
}

function sanitizeSkills(raw: unknown): SkillScore[] {
  if (!Array.isArray(raw) || raw.length === 0) return ALL_SKILLS.map((s) => ({ ...s }))
  const names = new Set<string>()
  const fromObjects = new Map<string, boolean>()
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) names.add(item.toLowerCase())
    if (item && typeof item === 'object' && 'name' in item) {
      const row = item as SkillScore
      if (typeof row.name === 'string') fromObjects.set(row.name, Boolean(row.proficient))
    }
  }
  if (fromObjects.size) {
    const byName = new Map(ALL_SKILLS.map((s) => [s.name, { ...s, proficient: fromObjects.get(s.name) ?? false }]))
    for (const [name, proficient] of fromObjects) {
      const prev = byName.get(name)
      if (prev) byName.set(name, { ...prev, proficient })
    }
    return ALL_SKILLS.map((s) => byName.get(s.name) ?? { ...s })
  }
  if (names.size) {
    return ALL_SKILLS.map((s) => ({ ...s, proficient: names.has(s.name.toLowerCase()) }))
  }
  return ALL_SKILLS.map((s) => ({ ...s }))
}

function sanitizeInventory(raw: unknown): InventoryItem[] {
  if (!Array.isArray(raw)) return []
  const rarities: InventoryItem['rarity'][] = ['common', 'uncommon', 'rare', 'legendary', 'story']
  return raw
    .map((it, i): InventoryItem | null => {
      if (typeof it === 'string' && it.trim()) {
        return { id: `it-${i}`, name: it.slice(0, 48), qty: 1, rarity: 'common', notes: '', equipped: false }
      }
      if (!it || typeof it !== 'object') return null
      const row = it as Record<string, unknown>
      const rarity = rarities.includes(row.rarity as InventoryItem['rarity'])
        ? (row.rarity as InventoryItem['rarity'])
        : 'common'
      return {
        id: String(row.id || `it-${i}`),
        name: String(row.name || 'Item').slice(0, 48),
        qty: Math.max(0, num(row.qty, 1)),
        rarity,
        notes: typeof row.notes === 'string' ? row.notes : '',
        equipped: Boolean(row.equipped),
      }
    })
    .filter((it): it is InventoryItem => Boolean(it))
}
