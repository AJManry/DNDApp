import { describe, expect, it } from 'vitest'
import { abilityMod, formatMod, skillBonus } from '../data/skills'
import { allLore } from '../data/corpus'
import { classifyIntent, consultSage, createLoreFromPrompt } from './sage'
import { searchLore, tokenize } from './search'
import { detectBiome, extractLabels, svgMap } from './mapStudio'
import { rollDice } from './dice'

describe('search', () => {
  it('tokenizes queries and drops stopwords', () => {
    expect(tokenize('Who is the sage of the village?')).toEqual(['sage', 'village'])
  })

  it('ranks Vaelith for villain queries', () => {
    const hits = searchLore(allLore(), 'who is lord vaelith the usurper')
    expect(hits[0]?.entry.title.toLowerCase()).toMatch(/vaelith/)
  })

  it('finds the Echo Flute', () => {
    const hits = searchLore(allLore(), 'echo flute ocarina key item')
    expect(hits.some((h) => h.entry.id === 'echo-flute')).toBe(true)
  })

  it('finds temple scenes', () => {
    const hits = searchLore(allLore(), 'vine door temple green blade')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.some((h) => /temple|vine/i.test(h.entry.title + h.entry.body))).toBe(true)
  })
})

describe('sage', () => {
  it('classifies map and create intents', () => {
    expect(classifyIntent('map of a coastal shrine')).toBe('map')
    expect(classifyIntent('create a fishing village')).toBe('create')
    expect(classifyIntent('who is luma')).toBe('search')
  })

  it('answers from the bible', () => {
    const result = consultSage('Where is Windfall Village?', allLore())
    expect(result.text).toMatch(/Windfall/)
    expect(result.hitIds?.length).toBeGreaterThan(0)
  })

  it('weaves new lore from a prompt', () => {
    const entry = createLoreFromPrompt('create a coastal village called Tideglass that worships a sky whale')
    expect(entry.title).toMatch(/Tideglass/)
    expect(entry.body).toMatch(/sky whale/)
    expect(entry.kind).toBe('custom')
  })
})

describe('maps and dice', () => {
  it('detects biomes and labels', () => {
    expect(detectBiome('misty forest shrine')).toBe('forest')
    expect(extractLabels('Windfall, Forest of Echoes, Sacred Plateau').length).toBeGreaterThan(1)
    expect(svgMap('forest temple')).toContain('<svg')
  })

  it('rolls dice in range', () => {
    const r = rollDice('1d20')
    expect(r.result).toBeGreaterThanOrEqual(1)
    expect(r.result).toBeLessThanOrEqual(20)
    const r2 = rollDice('2d6+1')
    expect(r2.result).toBeGreaterThanOrEqual(3)
    expect(r2.result).toBeLessThanOrEqual(13)
  })
})

describe('skills', () => {
  it('computes modifiers', () => {
    expect(abilityMod(16)).toBe(3)
    expect(abilityMod(9)).toBe(-1)
    expect(formatMod(3)).toBe('+3')
    expect(
      skillBonus(
        { name: 'Stealth', ability: 'dex', proficient: true },
        { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        2,
      ),
    ).toBe(5)
  })
})
