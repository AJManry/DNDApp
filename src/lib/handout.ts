import { abilityMod, formatMod, skillBonus } from '../data/skills'
import type { Character, InventoryItem, SkillScore } from '../types'

const DAMAGE_TYPES =
  'slashing|piercing|bludgeoning|fire|cold|lightning|thunder|force|necrotic|radiant|poison|psychic|acid'

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const
type Ability = (typeof ABILITIES)[number]

export interface HandoutAttack {
  name: string
  kind: 'weapon' | 'spell' | 'feature'
  hitRoll: string
  damageRoll: string
  damageText: string
  range: string
  instruction: string
}

export interface HandoutLine {
  name: string
  roll: string
  proficient: boolean
  ability: string
}

export interface PlayerHandout {
  id: string
  name: string
  subtitle: string
  virtue?: Character['virtue']
  hp: string
  ac: number
  speed: number
  proficiency: number
  abilities: { key: string; score: number; mod: string }[]
  attacks: HandoutAttack[]
  skills: HandoutLine[]
  saves: HandoutLine[]
  tricks: string[]
  reminders: string[]
}

export function proficiencyBonus(level: number): number {
  if (level >= 17) return 6
  if (level >= 13) return 5
  if (level >= 9) return 4
  if (level >= 5) return 3
  return 2
}

export function buildHandout(character: Character): PlayerHandout {
  const prof = proficiencyBonus(character.level || 3)
  const attacks = collectAttacks(character, prof)
  const skills = [...character.skills]
    .sort((a, b) => Number(b.proficient) - Number(a.proficient) || a.name.localeCompare(b.name))
    .map((sk) => skillLine(sk, character.abilities, prof))
  const saveKeys = saveProficiencies(character.className)
  const saves = ABILITIES.map((ab) => {
    const proficient = saveKeys.includes(ab)
    const bonus = abilityMod(character.abilities[ab]) + (proficient ? prof : 0)
    return {
      name: ab.toUpperCase(),
      roll: `d20${formatMod(bonus)}`,
      proficient,
      ability: ab,
    }
  })
  return {
    id: character.id,
    name: character.name,
    subtitle: `${character.ancestry} ${character.className}`,
    virtue: character.virtue,
    hp: `${character.hp.max}`,
    ac: character.ac,
    speed: character.speed,
    proficiency: prof,
    abilities: ABILITIES.map((key) => ({
      key: key.toUpperCase(),
      score: character.abilities[key],
      mod: formatMod(abilityMod(character.abilities[key])),
    })),
    attacks,
    skills,
    saves,
    tricks: classTricks(character, prof),
    reminders: [
      'Attack: roll the Hit dice versus their AC. If you meet or beat it, roll Damage.',
      'Skill or save: roll the listed d20. High is good.',
      'Advantage: roll 2d20, keep the higher. Disadvantage: keep the lower.',
      `Numbers already include proficiency (+${prof}). Do not add it again.`,
    ],
  }
}

function skillLine(
  skill: SkillScore,
  abilities: Character['abilities'],
  prof: number,
): HandoutLine {
  const bonus = skillBonus(skill, abilities, prof)
  return {
    name: skill.name,
    roll: `d20${formatMod(bonus)}`,
    proficient: skill.proficient,
    ability: skill.ability.toUpperCase(),
  }
}

export function parseAttackFromNotes(name: string, notes: string): HandoutAttack | null {
  const toHitM = notes.match(/([+-]\d+)\s*to hit/i)
  const dmgRe = new RegExp(`(\\d+d\\d+(?:\\s*[+\\u2212-]\\s*\\d+)?)(?:\\s+(${DAMAGE_TYPES}))?`, 'i')
  const dmgM = notes.match(dmgRe)
  if (!toHitM && !(dmgM?.[2])) return null
  const toHit = toHitM ? Number(toHitM[1]) : null
  const dice = compactDice(dmgM?.[1] ?? '')
  const dtype = (dmgM?.[2] ?? '').toLowerCase()
  const range = parseRange(notes)
  const hitRoll = toHit == null ? '—' : `d20${formatMod(toHit)}`
  const damageText = [dice, dtype].filter(Boolean).join(' ')
  return {
    name: tidyName(name),
    kind: 'weapon',
    hitRoll,
    damageRoll: dice || '—',
    damageText: damageText || '—',
    range,
    instruction:
      toHit == null
        ? `Roll ${damageText || 'damage'}${range ? ` (${range})` : ''}.`
        : `Roll ${hitRoll} versus AC. Hit: roll ${damageText || 'damage'}${range ? ` (${range})` : ''}.`,
  }
}

export function parseDcEffects(text: string, fallbackName = 'Special'): HandoutAttack[] {
  const attacks: HandoutAttack[] = []
  const re =
    /(?:^|[.\n]\s*)([^:]{3,48}?):\s*([^.]{0,100}?DC\s*(\d+)\s*(Str|Dex|Con|Int|Wis|Cha)\w*[^.]*)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const chunk = m[2]
    const dc = Number(m[3])
    const save = titleSave(m[4])
    const dmgRe = new RegExp(`(\\d+d\\d+(?:\\s*[+\\u2212-]\\s*\\d+)?)(?:\\s+(${DAMAGE_TYPES}))?`, 'i')
    const dmgM = chunk.match(dmgRe)
    const dice = compactDice(dmgM?.[1] ?? '')
    const dtype = (dmgM?.[2] ?? '').toLowerCase()
    const damageText = [dice, dtype].filter(Boolean).join(' ')
    const range = parseRange(chunk) || parseRange(m[0])
    attacks.push({
      name: tidyName(m[1] || fallbackName),
      kind: 'feature',
      hitRoll: `DC ${dc} ${save}`,
      damageRoll: dice || '—',
      damageText: damageText || '—',
      range,
      instruction: `They roll ${save} versus DC ${dc}. Fail: ${damageText || 'the effect'}${
        dice ? '; success: half damage' : ''
      }.${range ? ` ${range}.` : ''}`,
    })
  }
  return attacks
}

function collectAttacks(character: Character, prof: number): HandoutAttack[] {
  const attacks: HandoutAttack[] = []
  const seen = new Set<string>()
  const push = (row: HandoutAttack | null) => {
    if (!row) return
    const key = `${row.name}|${row.hitRoll}|${row.damageRoll}`
    if (seen.has(key)) return
    seen.add(key)
    attacks.push(row)
  }

  for (const item of character.inventory) {
    if (isGear(item)) continue
    push(parseAttackFromNotes(item.name, item.notes || ''))
  }

  const blob = [character.notes, ...character.inventory.map((it) => `${it.name}. ${it.notes}`)].join('\n')
  for (const row of parseDcEffects(blob)) push(row)
  const spellText = character.inventory
    .filter((it) => /prepared|spell slot|spellbook|knows /i.test(it.notes || ''))
    .map((it) => it.notes)
    .join('\n')
  for (const row of spellsFromText(spellText, character, prof)) push(row)

  return attacks
}

function isGear(item: InventoryItem): boolean {
  const name = item.name.toLowerCase()
  const notes = (item.notes || '').toLowerCase()
  if (/to hit/.test(notes) || /dc\s*\d+/.test(notes)) return false
  if (
    /arrow|armor|mail|tunic|hide|shield|pouch|satchel|component|ocarina splinter|seed$/.test(name)
  ) {
    return true
  }
  return !new RegExp(DAMAGE_TYPES).test(notes)
}

function parseRange(notes: string): string {
  const pair = notes.match(/(\d+\s*\/\s*\d+)/)
  if (pair) return `${pair[1].replace(/\s+/g, '')} ft`
  const cone = notes.match(/(\d+)\s*-?\s*ft\.?\s*(cone|radius|line|sphere|cube)/i)
  if (cone) return `${cone[1]}-ft ${cone[2].toLowerCase()}`
  const ft = notes.match(/(\d+)\s*(?:ft\.?|feet)(?!\s*cone)/i)
  if (ft && Number(ft[1]) >= 10) return `${ft[1]} ft`
  return ''
}

function compactDice(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/\u2212/g, '-')
}

function tidyName(name: string): string {
  return name.replace(/\s+/g, ' ').trim().replace(/[.:]+$/, '')
}

function titleSave(raw: string): string {
  const k = raw.slice(0, 3).toLowerCase()
  return ({ str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' } as Record<string, string>)[k] ?? raw.toUpperCase()
}

function saveProficiencies(className: string): Ability[] {
  const c = className.toLowerCase()
  if (/barbarian|fighter/.test(c)) return ['str', 'con']
  if (/paladin/.test(c)) return ['wis', 'cha']
  if (/ranger/.test(c)) return ['str', 'dex']
  if (/rogue/.test(c)) return ['dex', 'int']
  if (/\bbard\b/.test(c)) return ['dex', 'cha']
  if (/cleric|druid/.test(c)) return ['wis', 'cha']
  if (/\bmonk\b/.test(c)) return ['str', 'dex']
  if (/sorcerer/.test(c)) return ['con', 'cha']
  if (/warlock/.test(c)) return ['wis', 'cha']
  if (/wizard/.test(c)) return ['int', 'wis']
  return []
}

function casterAbility(className: string): Ability {
  const c = className.toLowerCase()
  if (/wizard/.test(c)) return 'int'
  if (/cleric|druid|ranger/.test(c)) return 'wis'
  return 'cha'
}

function classTricks(character: Character, prof: number): string[] {
  const c = character.className.toLowerCase()
  const str = abilityMod(character.abilities.str)
  const cha = abilityMod(character.abilities.cha)
  const wis = abilityMod(character.abilities.wis)
  const tricks: string[] = []
  if (/fighter/.test(c)) {
    tricks.push(`Second Wind (bonus action): roll 1d10+${character.level} and heal that HP. 1/short rest.`)
    tricks.push('Action Surge: take one extra action. 1/short rest.')
    if (/battle master/.test(c)) {
      tricks.push(
        `Maneuvers: 4 superiority dice (d8). Add a d8 to a hit or damage, or force a DC ${8 + prof + str} save.`,
      )
    }
  }
  if (/wizard|sorcerer|bard/.test(c)) {
    const ab = casterAbility(character.className)
    const mod = abilityMod(character.abilities[ab])
    tricks.push(
      `Spell slots: 4 first-level, 2 second-level. Save DC ${8 + prof + mod}. Spell attack d20${formatMod(mod + prof)}.`,
    )
  }
  if (/ranger/.test(c)) {
    tricks.push(`Hunter’s Mark (bonus, 1st slot): extra 1d6 damage to one marked creature.`)
    tricks.push('Two-Weapon Fighting: after a shortsword attack, bonus action for a second shortsword (no Dex to damage).')
  }
  if (/paladin/.test(c)) {
    tricks.push('Divine Smite (on a melee hit): spend a 1st slot, extra 2d8 radiant (3d8 vs undead or fiends).')
    tricks.push(`Lay on Hands: heal up to ${character.level * 5} HP, split as you like.`)
    tricks.push(`Channel Divinity 1/short rest. Spell save DC ${8 + prof + cha}.`)
  }
  if (/rogue/.test(c)) tricks.push('Sneak Attack: once per turn, extra 2d6 if you have advantage or an ally within 5 ft.')
  if (/barbarian/.test(c)) tricks.push('Rage (bonus): 2/long rest. Advantage on STR checks/saves, +2 melee damage.')
  if (/druid/.test(c)) {
    tricks.push(`Spell slots: 4 first-level, 2 second-level. Save DC ${8 + prof + wis}.`)
  }
  const extra = character.notes
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => /\b(1d\d+|2d\d+|bonus action|advantage)\b/i.test(s) && !/DC\s*\d+/i.test(s))
  for (const line of extra.slice(0, 2)) {
    if (line.length > 12 && line.length < 140) tricks.push(line.replace(/^[a-z]/, (ch) => ch.toUpperCase()) + '.')
  }
  return tricks
}

interface SpellKit {
  match: RegExp
  name: string
  hit: (dc: number, attack: string) => string
  damage: string
  dice: string
  range: string
  instruction: (dc: number, attack: string) => string
}

const SPELLS: SpellKit[] = [
  {
    match: /magic missile/i,
    name: 'Magic Missile',
    hit: () => 'auto-hit',
    damage: '1d4+1 force × 3 darts',
    dice: '1d4+1',
    range: '120 ft',
    instruction: () => 'No attack roll. Roll 1d4+1 force for each of 3 darts (all hit).',
  },
  {
    match: /\bsleep\b/i,
    name: 'Sleep',
    hit: () => 'no attack',
    damage: '5d8 hp of creatures',
    dice: '5d8',
    range: '90 ft',
    instruction: () => 'Roll 5d8. Creatures in 20 ft fall asleep, lowest current HP first.',
  },
  {
    match: /\bshatter\b/i,
    name: 'Shatter',
    hit: (dc) => `DC ${dc} CON`,
    damage: '3d8 thunder',
    dice: '3d8',
    range: '60 ft, 10-ft radius',
    instruction: (dc) => `They roll CON versus DC ${dc}. Fail: 3d8 thunder. Success: half.`,
  },
  {
    match: /\bshield\b/i,
    name: 'Shield',
    hit: () => 'reaction',
    damage: '+5 AC until your next turn',
    dice: '—',
    range: 'self',
    instruction: () => 'When you are hit, AC becomes +5 until the start of your next turn (may make it miss).',
  },
  {
    match: /mage armor/i,
    name: 'Mage Armor',
    hit: () => '1st, 8 hours',
    damage: 'AC 13 + Dex',
    dice: '—',
    range: 'touch',
    instruction: () => 'Cast on yourself or an ally. AC = 13 + Dex modifier for 8 hours.',
  },
  {
    match: /hunter'?s mark/i,
    name: 'Hunter’s Mark',
    hit: () => 'bonus action',
    damage: '+1d6 vs marked',
    dice: '1d6',
    range: '90 ft',
    instruction: () => 'Bonus action. Until you drop it, extra 1d6 damage on hits against that target.',
  },
]

function spellsFromText(text: string, character: Character, prof: number): HandoutAttack[] {
  const ab = casterAbility(character.className)
  const mod = abilityMod(character.abilities[ab])
  const dc = 8 + prof + mod
  const attack = `d20${formatMod(mod + prof)}`
  const isCaster = /wizard|sorcerer|bard|cleric|druid|paladin|ranger|warlock/i.test(character.className)
  if (!isCaster && !/prepared|spell/i.test(text)) return []
  return SPELLS.filter((sp) => sp.match.test(text)).map((sp) => ({
    name: sp.name,
    kind: 'spell' as const,
    hitRoll: sp.hit(dc, attack),
    damageRoll: sp.dice,
    damageText: sp.damage,
    range: sp.range,
    instruction: sp.instruction(dc, attack),
  }))
}
