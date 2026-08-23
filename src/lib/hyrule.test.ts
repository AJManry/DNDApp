import { describe, expect, it } from 'vitest'
import { abilityMod, formatMod, skillBonus } from '../data/skills'
import { allLore } from '../data/corpus'
import { buildCursorForgePrompt, buildCursorPrompt, cursorApiUrl, isCursorProvider } from './cursorAgent'
import { normalizeLlmSettings } from './llm'
import { classifyIntent, createLoreFromPrompt, parseSageReply, buildSageMessages } from './sage'
import { searchLore, tokenize } from './search'
import { detectBiome, extractLabels, svgMap } from './mapStudio'
import { rollDice } from './dice'
import { distanceOnGrid, seedTokens, parseSpeed, formatRange } from './tactics'
import { forgeFromPrompt, nameFromPrompt, parseCharacterReply } from './characterForge'
import { buildHandout, parseAttackFromNotes, parseDcEffects } from './handout'
import { pregens } from '../data/pregens'
import { CAMPAIGN, scenes } from '../data/campaign'
import { battleMapForScene, campaignMaps } from '../data/maps'
import { bestiary } from '../data/bestiary'

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

  it('seeds party, Kakariko NPCs, and Poes on the bird’s-eye board', () => {
    const tokens = seedTokens('battle-kakariko', pregens, {
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

  it('seeds four Keese on the mill fight board', () => {
    const keeseScene = scenes.find((s) => s.id === 's1-keese')
    expect(keeseScene).toBeTruthy()
    const tokens = seedTokens('battle-kakariko', pregens, keeseScene)
    expect(tokens.filter((t) => t.role === 'foe' && t.refId === 'keese').length).toBe(4)
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

  it('builds a Cursor Cloud Agent prompt for character forge, not Pollinations', () => {
    const prompt = buildCursorForgePrompt('A Gerudo swordswoman named Nabooru')
    expect(prompt).toMatch(/Hyrule Forge|forging a player character/i)
    expect(prompt).toMatch(/READ-ONLY/)
    expect(prompt).toMatch(/pregens/)
    expect(prompt).toMatch(/Nabooru/)
    expect(prompt).not.toMatch(/pollinations/i)
    expect(prompt).not.toMatch(/"answer"/)
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

  it('unwraps a Cursor Oracle-style answer wrapper', () => {
    const draft = parseCharacterReply(
      '{"answer":"{\\"name\\":\\"Riju-kai\\",\\"ancestry\\":\\"Gerudo\\",\\"className\\":\\"Fighter 3\\",\\"virtue\\":\\"Power\\"}"}',
    )
    expect(draft?.name).toBe('Riju-kai')
    expect(draft?.ancestry).toBe('Gerudo')
  })

  it('defaults unnamed Hylians to Ranger', () => {
    const hero = forgeFromPrompt('a quiet traveler who still hears the Song of Time')
    expect(hero.ancestry).toBe('Hylian')
    expect(hero.className).toMatch(/Ranger/)
  })
})

describe('player handouts', () => {
  it('reads to-hit and damage dice from weapon notes', () => {
    const attack = parseAttackFromNotes(
      'Soldier’s longsword',
      'Ordon / Kakariko blade. +5 to hit, 1d8+3 slashing.',
    )
    expect(attack?.hitRoll).toBe('d20+5')
    expect(attack?.damageRoll).toBe('1d8+3')
    expect(attack?.damageText).toMatch(/slashing/)
    expect(attack?.instruction).toMatch(/d20\+5/)
  })

  it('keeps range on bows', () => {
    const attack = parseAttackFromNotes('Shortbow', '+5 to hit, 1d6+3 piercing, 80/320.')
    expect(attack?.range).toBe('80/320 ft')
  })

  it('parses a save DC feature', () => {
    const [breath] = parseDcEffects(
      'Swore an oath. Breath of the mountain: 15-ft cone, DC 12 Dex, 2d6 fire.',
    )
    expect(breath?.name).toMatch(/Breath/)
    expect(breath?.hitRoll).toBe('DC 12 DEX')
    expect(breath?.damageRoll).toBe('2d6')
  })

  it('builds Link a dice sheet without treating the Hylian Shield as a spell', () => {
    const sheet = buildHandout(pregens[0])
    expect(sheet.attacks.some((a) => a.name.includes('longsword'))).toBe(true)
    expect(sheet.attacks.some((a) => /javelin/i.test(a.name))).toBe(true)
    expect(sheet.attacks.some((a) => a.name === 'Shield' && a.kind === 'spell')).toBe(false)
    expect(sheet.skills.find((s) => s.name === 'Athletics')?.roll).toBe('d20+5')
    expect(sheet.saves.find((s) => s.name === 'STR')?.proficient).toBe(true)
  })

  it('lists Sheik’s prepared spells with the dice to roll', () => {
    const sheet = buildHandout(pregens[1])
    const missile = sheet.attacks.find((a) => a.name === 'Magic Missile')
    expect(missile?.hitRoll).toBe('auto-hit')
    expect(missile?.damageRoll).toBe('1d4+1')
    expect(sheet.attacks.some((a) => a.name === 'Shatter')).toBe(true)
  })
})

describe('one-shot briefing', () => {
  it('gives Home a full story and keeps vine-door text for the Oracle', () => {
    expect(CAMPAIGN.story.length).toBeGreaterThanOrEqual(3)
    expect(CAMPAIGN.howToRun.length).toBeGreaterThan(0)
    const door = scenes.find((s) => s.id === 's3-door')
    expect(door?.boxedText).toMatch(/vine/i)
    expect(door?.options?.length).toBeGreaterThanOrEqual(3)
    expect(door?.whatsHappening).toMatch(/true note/i)
  })

  it('gives every scene a summary and at least two ways through', () => {
    for (const scene of scenes) {
      expect(scene.summary?.length).toBeGreaterThan(20)
      expect(scene.whatsHappening?.length).toBeGreaterThan(80)
      expect(scene.options?.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('gives every scene a top-down combat board separate from scenic art', () => {
    for (const scene of scenes) {
      const battle = battleMapForScene(scene.id)
      expect(battle).toBeTruthy()
      expect(battle?.src).toMatch(/battle-/)
      const place = campaignMaps.find((m) => m.id === scene.mapId)
      expect(place?.artSrc).not.toBe(battle?.src)
    }
  })

  it('puts fights on the main path, not only as optional skips', () => {
    const combat = scenes.filter((s) => (s.encounterIds?.length ?? 0) > 0)
    expect(combat.map((s) => s.id)).toEqual(
      expect.arrayContaining([
        's1-poes',
        's1-keese',
        's2-wolfos',
        's2-bokoblins',
        's3-door',
        's3-gloom',
        's3-shade',
        's3-gohma',
        's4-choir',
        's4-ganondorf',
      ]),
    )
    expect(scenes.find((s) => s.id === 's2-bokoblins')?.optional).toBeFalsy()
    expect(CAMPAIGN.skipIfBehind.some((line) => /Keese|Mill That Bites/i.test(line))).toBe(true)
    expect(CAMPAIGN.skipIfBehind.some((line) => /Wolfos/i.test(line))).toBe(true)
    expect(CAMPAIGN.skipIfBehind.some((line) => /Uncaught Measures|choir/i.test(line))).toBe(true)
  })

  it('gives every combat scene a real stat block', () => {
    const ids = new Set(bestiary.map((m) => m.id))
    for (const scene of scenes) {
      for (const id of scene.encounterIds ?? []) {
        expect(ids.has(id)).toBe(true)
      }
    }
  })
})
