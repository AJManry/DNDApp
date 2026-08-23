import { describe, expect, it } from 'vitest'
import { abilityMod, formatMod, skillBonus } from '../data/skills'
import { allLore } from '../data/corpus'
import { buildCursorPrompt, cursorApiUrl, isCursorProvider } from './cursorAgent'
import { normalizeLlmSettings } from './llm'
import { classifyIntent, createLoreFromPrompt, parseSageReply, buildSageMessages } from './sage'
import { searchLore, tokenize } from './search'
import { detectBiome, extractLabels, svgMap } from './mapStudio'
import { rollDice } from './dice'
import { distanceOnGrid, seedTokens, parseSpeed, formatRange } from './tactics'
import { forgeFromPrompt, nameFromPrompt, parseCharacterReply } from './characterForge'
import { pregens } from '../data/pregens'

describe('search', () => {
  it('tokenizes queries and drops stopwords', () => {
    expect(tokenize('Who is the sage of the village?')).toEqual(['sage', 'village'])
  })

  it('ranks Ganondorf for villain queries', () => {
    const hits = searchLore(allLore(), 'who is ganondorf the king of twilight')
    expect(hits[0]?.entry.title.toLowerCase()).toMatch(/ganondorf/)
  })

  it('finds the Ocarina of Time', () => {
    const hits = searchLore(allLore(), 'ocarina of time key item')
    expect(hits.some((h) => h.entry.id === 'ocarina')).toBe(true)
  })

  it('finds Forest Temple scenes', () => {
    const hits = searchLore(allLore(), 'vine door forest temple')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.some((h) => /temple|vine/i.test(h.entry.title + h.entry.body))).toBe(true)
  })
})

describe('sage', () => {
  it('classifies map and create intents', () => {
    expect(classifyIntent('map of a coastal shrine')).toBe('map')
    expect(classifyIntent('create a fishing village')).toBe('create')
    expect(classifyIntent('who is navi')).toBe('search')
  })

  it('packs bible context for the model', () => {
    const packed = buildSageMessages({
      query: 'Where is Kakariko Village?',
      entries: allLore(),
      secretsRevealed: true,
      history: [],
    })
    expect(packed.hitIds.length).toBeGreaterThan(0)
    expect(packed.messages.some((m) => /Kakariko/.test(m.content))).toBe(true)
  })

  it('parses JSON model replies', () => {
    const parsed = parseSageReply(
      '{"answer":"Ganondorf stole the song.","lore":null,"mapPrompt":null}',
    )
    expect(parsed.answer).toMatch(/Ganondorf/)
    expect(parsed.lore).toBeNull()
  })

  it('extracts lore drafts from fenced JSON', () => {
    const parsed = parseSageReply(
      '```json\n{"answer":"A new dock.","lore":{"title":"Lake Hylia","summary":"Coastal village","body":"They worship Jabu-Jabu."},"mapPrompt":"coastal village dusk"}\n```',
    )
    expect(parsed.lore?.title).toBe('Lake Hylia')
    expect(parsed.mapPrompt).toMatch(/coastal/)
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
    expect(extractLabels('Kakariko, Lost Woods, Sacred Realm').length).toBeGreaterThan(1)
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

describe('tactics board', () => {
  it('uses 5e diagonal distance (max of axes)', () => {
    const d = distanceOnGrid({ x: 0, y: 0 }, { x: 50, y: 0 }, 20, 1, 5)
    expect(d.squares).toBe(10)
    expect(d.feet).toBe(50)
    const diag = distanceOnGrid({ x: 0, y: 0 }, { x: 50, y: 50 }, 20, 1, 5)
    expect(diag.squares).toBe(10)
    expect(diag.feet).toBe(50)
  })

  it('seeds party, Kakariko NPCs, and Poes', () => {
    const tokens = seedTokens('map-kakariko', pregens, {
      id: 's1-poes',
      act: 1,
      title: 'Poes',
      minuteStart: 20,
      minuteEnd: 30,
      boxedText: '',
      dmNotes: '',
      mapId: 'map-kakariko',
      encounterIds: ['poe'],
    })
    expect(tokens.some((t) => t.name === 'Link')).toBe(true)
    expect(tokens.some((t) => t.name === 'Impa')).toBe(true)
    expect(tokens.filter((t) => t.role === 'foe').length).toBe(3)
  })

  it('parses monster speed and formats range', () => {
    expect(parseSpeed('30 ft., fly 40 ft. (hover)')).toBe(30)
    expect(formatRange(35, 7, 30)).toMatch(/over speed/)
  })
})

describe('cursor oracle', () => {
  it('detects the Cursor provider and builds a read-only search prompt', () => {
    expect(isCursorProvider({ baseUrl: 'cursor://cloud-agent' })).toBe(true)
    expect(isCursorProvider({ baseUrl: 'puter://chat' })).toBe(false)
    const prompt = buildCursorPrompt([{ role: 'user', content: 'Who is Navi?' }])
    expect(prompt).toMatch(/READ-ONLY/)
    expect(prompt).toMatch(/src\/data/)
    expect(prompt).toMatch(/Who is Navi/)
    expect(prompt).toMatch(/"answer"/)
    expect(prompt).toMatch(/Impa/)
  })

  it('routes Cursor API calls through the Vite proxy in dev', () => {
    expect(cursorApiUrl('/v1/agents', { dev: true })).toBe('/cursor-api/v1/agents')
    expect(cursorApiUrl('/v1/agents', { dev: false })).toBe('https://api.cursor.com/v1/agents')
    expect(cursorApiUrl('/v1/me', { proxyUrl: 'https://proxy.example/cursor' })).toBe(
      'https://proxy.example/cursor/v1/me',
    )
  })

  it('migrates the old Puter default onto Cursor', () => {
    const migrated = normalizeLlmSettings({ baseUrl: 'puter://chat', apiKey: '', model: 'gpt-4o-mini' })
    expect(migrated.baseUrl).toBe('cursor://cloud-agent')
    expect(migrated.cursorSearchRepo).toBe(true)
    const groq = normalizeLlmSettings({
      baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: 'gsk_test',
      model: 'llama-3.3-70b-versatile',
    })
    expect(groq.baseUrl).toContain('groq')
    expect(groq.apiKey).toBe('gsk_test')
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

describe('character forge', () => {
  it('builds a Gerudo fighter from a prompt', () => {
    const hero = forgeFromPrompt('A Gerudo swordswoman who left the desert after twilight took her sister')
    expect(hero.ancestry).toBe('Gerudo')
    expect(hero.className).toMatch(/Fighter/)
    expect(hero.level).toBe(3)
    expect(hero.inventory.length).toBeGreaterThan(0)
    expect(hero.portrait).toMatch(/pollinations/)
  })

  it('extracts a given name', () => {
    expect(nameFromPrompt('A scout named Mipha who left the Domain')).toBe('Mipha')
    const hero = forgeFromPrompt('A Zora ranger named Mipha who left the Domain')
    expect(hero.name).toBe('Mipha')
    expect(hero.ancestry).toBe('Zora')
    expect(hero.className).toMatch(/Ranger/)
  })

  it('parses a model JSON sheet', () => {
    const draft = parseCharacterReply(
      '{"name":"Tebael","ancestry":"Rito","className":"Ranger 3","virtue":"Courage","hp":24,"ac":14,"speed":30,"abilities":{"str":10,"dex":16,"con":14,"int":10,"wis":14,"cha":8},"proficientSkills":["Stealth"],"inventory":[{"name":"Eagle bow","qty":1,"rarity":"uncommon","notes":"+5","equipped":true}],"notes":"Flight Range scout."}',
    )
    expect(draft?.name).toBe('Tebael')
    expect(draft?.ancestry).toBe('Rito')
    expect(draft?.proficientSkills).toContain('Stealth')
  })

  it('defaults unnamed Hylians to Ranger', () => {
    const hero = forgeFromPrompt('a quiet traveler who still hears the Song of Time')
    expect(hero.ancestry).toBe('Hylian')
    expect(hero.className).toMatch(/Ranger/)
  })
})
