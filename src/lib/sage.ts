import type { LoreEntry, OracleMessage } from '../types'
import { searchLore, tokenize } from './search'

const CREATE_RE =
  /\b(create|invent|add|write|design|generate|new|build me|make me|make a|homebrew)\b/i

export type SageIntent = 'search' | 'create' | 'map'

export function classifyIntent(query: string): SageIntent {
  const q = query.toLowerCase()
  if (/\b(map|cartograph|draw|paint|landscape|overworld)\b/.test(q) && !/\bwhere is\b/.test(q)) {
    return 'map'
  }
  if (CREATE_RE.test(query)) return 'create'
  return 'search'
}

const KIND_HINTS: { re: RegExp; kind: LoreEntry['kind']; label: string }[] = [
  { re: /\b(village|town|hamlet|city|port)\b/i, kind: 'location', label: 'settlement' },
  { re: /\b(dungeon|temple|ruin|shrine|castle|keep|cave)\b/i, kind: 'location', label: 'site' },
  { re: /\b(forest|wood|swamp|desert|mountain|island|coast)\b/i, kind: 'location', label: 'region' },
  { re: /\b(npc|villager|sage|knight|merchant|innkeep|captain)\b/i, kind: 'npc', label: 'person' },
  { re: /\b(monster|beast|dragon|spirit|undead|construct)\b/i, kind: 'creature', label: 'creature' },
  { re: /\b(sword|item|relic|flute|potion|armor|artifact)\b/i, kind: 'item', label: 'item' },
  { re: /\b(guild|cult|order|faction|tribe)\b/i, kind: 'faction', label: 'faction' },
]

function guessKind(query: string): { kind: LoreEntry['kind']; label: string } {
  for (const h of KIND_HINTS) {
    if (h.re.test(query)) return { kind: h.kind, label: h.label }
  }
  return { kind: 'lore', label: 'lore' }
}

function titleFromQuery(query: string): string {
  const named = query.match(/\b(?:called|named)\s+["']?([A-Z][\w\s']{1,40})/i)
  if (named?.[1]) return named[1].trim().replace(/[?.!]+$/, '')
  const quoted = query.match(/["']([^"']{2,40})["']/)
  if (quoted?.[1]) return quoted[1]
  const cleaned = query
    .replace(CREATE_RE, '')
    .replace(/\b(a|an|the|please|for me|in eldara|in the world)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = cleaned.split(' ').slice(0, 6)
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unnamed Thread'
}

export function createLoreFromPrompt(query: string): LoreEntry {
  const { kind, label } = guessKind(query)
  const title = titleFromQuery(query)
  const id = `custom-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
  const body = weaveBody(title, kind, label, query)
  return {
    id,
    title,
    kind: 'custom',
    tags: ['custom', 'worldbuilding', kind, label, ...tokenize(query).slice(0, 6)],
    summary: `Homebrew ${label} woven into Eldara from your prompt.`,
    body,
  }
}

function weaveBody(title: string, kind: LoreEntry['kind'], label: string, query: string): string {
  const q = query.replace(/\s+/g, ' ').trim()
  const hooks = [
    `How it touches the Waking Song: it either keeps a measure, steals one, or has forgotten it owns one.`,
    `A rumor in Windfall: someone at The Second Note will swear they saw ${title} at dusk.`,
    `Adventure use: a 10-minute scene, a skill check at DC 13, or a map prompt in the Maps tab.`,
  ]
  return `${title} enters the chronicle as a ${label} (${kind}). Seed: “${q}”\n\n${hooks.join('\n')}\n\nDM note: Keep Nintendo trademarks out of the spoken fiction. If this idea leans on a famous dungeon or fairy, rename it and keep the rhythm.`
}

export function answerFromHits(query: string, hits: ReturnType<typeof searchLore>): string {
  if (hits.length === 0) {
    return `Nothing in the Eldara bible matches “${query}” yet. Ask a narrower question (try Windfall, Luma, Vaelith, Echo Flute, or Temple), or invent a new corner of the world with words like “create a coastal shrine…”`
  }
  const top = hits[0]
  const extras = hits.slice(1, 4).map((h) => h.entry.title)
  const secret = top.entry.secrets
  let text = `**${top.entry.title}** (${top.entry.kind})\n\n${top.entry.summary}\n\n${top.entry.body}`
  if (secret) {
    text += `\n\n*DM-only thread:* ${secret}`
  }
  if (extras.length) {
    text += `\n\nAlso see: ${extras.join(' · ')}`
  }
  return text
}

export function consultSage(
  query: string,
  entries: LoreEntry[],
): Pick<OracleMessage, 'text' | 'hitIds' | 'createdLoreId' | 'mapPrompt'> & {
  created?: LoreEntry
} {
  const intent = classifyIntent(query)
  if (intent === 'map') {
    return {
      text: `I’ll take that to the cartographer. Open the **Maps** tab — the prompt is ready to paint a graphic of this place.\n\nPrompt: ${query}`,
      hitIds: searchLore(entries, query, 3).map((h) => h.entry.id),
      mapPrompt: query,
    }
  }
  if (intent === 'create') {
    const created = createLoreFromPrompt(query)
    return {
      text: `Woven into the world bible as **${created.title}**. It is searchable from now on.\n\n${created.body}`,
      hitIds: [],
      createdLoreId: created.id,
      created,
    }
  }
  const hits = searchLore(entries, query, 6)
  return {
    text: answerFromHits(query, hits),
    hitIds: hits.map((h) => h.entry.id),
  }
}
