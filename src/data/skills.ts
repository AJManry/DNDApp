import type { SkillScore } from '../types'

export const ALL_SKILLS: SkillScore[] = [
  { name: 'Acrobatics', ability: 'dex', proficient: false },
  { name: 'Animal Handling', ability: 'wis', proficient: false },
  { name: 'Arcana', ability: 'int', proficient: false },
  { name: 'Athletics', ability: 'str', proficient: false },
  { name: 'Deception', ability: 'cha', proficient: false },
  { name: 'History', ability: 'int', proficient: false },
  { name: 'Insight', ability: 'wis', proficient: false },
  { name: 'Intimidation', ability: 'cha', proficient: false },
  { name: 'Investigation', ability: 'int', proficient: false },
  { name: 'Medicine', ability: 'wis', proficient: false },
  { name: 'Nature', ability: 'int', proficient: false },
  { name: 'Perception', ability: 'wis', proficient: false },
  { name: 'Performance', ability: 'cha', proficient: false },
  { name: 'Persuasion', ability: 'cha', proficient: false },
  { name: 'Religion', ability: 'int', proficient: false },
  { name: 'Sleight of Hand', ability: 'dex', proficient: false },
  { name: 'Stealth', ability: 'dex', proficient: false },
  { name: 'Survival', ability: 'wis', proficient: false },
]

export function abilityMod(score: number): number {
  const n = Number(score)
  if (!Number.isFinite(n)) return 0
  return Math.floor((n - 10) / 2)
}

export function skillBonus(
  skill: SkillScore,
  abilities: Record<SkillScore['ability'], number> | undefined,
  proficiency = 2,
): number {
  const key = skill?.ability
  const score = abilities && key ? abilities[key] : 10
  return abilityMod(score) + (skill?.proficient ? proficiency : 0)
}

export function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}
