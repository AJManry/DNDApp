import type { LoreEntry, OracleMessage } from '../types'
import { isCursorProvider, runCursorOracle } from './cursorAgent'
import { completeChat, type ChatMessage, type LlmSettings } from './llm'
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
  { re: /\b(sword|item|relic|flute|ocarina|potion|armor|artifact|triforce)\b/i, kind: 'item', label: 'item' },
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
    .replace(/\b(a|an|the|please|for me|in eldara|in hyrule|in the world)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = cleaned.split(' ').slice(0, 6)
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unnamed Thread'
}

export function createLoreFromPrompt(query: string, body?: string): LoreEntry {
  const { kind, label } = guessKind(query)
  const title = titleFromQuery(query)
  const id = `custom-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`
  return {
    id,
    title,
    kind: 'custom',
    tags: ['custom', 'worldbuilding', kind, label, ...tokenize(query).slice(0, 6)],
    summary: `Homebrew ${label} woven into Hyrule from your prompt.`,
    body: body?.trim() || weaveBody(title, kind, label, query),
  }
}

function weaveBody(title: string, kind: LoreEntry['kind'], label: string, query: string): string {
  const q = query.replace(/\s+/g, ' ').trim()
  return `${title} enters the chronicle as a ${label} (${kind}). Seed: “${q}”`
}

export interface SageLoreDraft {
  title: string
  summary: string
  body: string
  kind?: LoreEntry['kind']
}

export interface SageReply {
  answer: string
  lore: SageLoreDraft | null
  mapPrompt: string | null
}

export function parseSageReply(raw: string): SageReply {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced?.[1]?.trim() ?? trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start >= 0 && end > start) {
    try {
      const obj = JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>
      const answer = pickString(obj.answer) || pickString(obj.text) || trimmed
      return {
        answer,
        lore: parseLoreDraft(obj.lore),
        mapPrompt: pickString(obj.mapPrompt) || pickString(obj.map_prompt),
      }
    } catch {
      /* fall through */
    }
  }
  return { answer: trimmed, lore: null, mapPrompt: null }
}

function pickString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function parseLoreDraft(value: unknown): SageLoreDraft | null {
  if (!value || typeof value !== 'object') return null
  const obj = value as Record<string, unknown>
  const title = pickString(obj.title)
  const body = pickString(obj.body)
  if (!title || !body) return null
  const kind = pickString(obj.kind) as LoreEntry['kind'] | null
  return {
    title,
    summary: pickString(obj.summary) || body.slice(0, 160),
    body,
    kind: kind || 'custom',
  }
}

export function formatLoreContext(
  entries: LoreEntry[],
  query: string,
  secretsRevealed: boolean,
  limit = 5,
): { hits: ReturnType<typeof searchLore>; block: string } {
  const hits = searchLore(entries, query, limit)
  if (hits.length === 0) {
    return {
      hits,
      block: 'No indexed entries matched this question. Answer from Hyrule’s tone and invent carefully, marking guesses.',
    }
  }
  const block = hits
    .map((h) => {
      const e = h.entry
      const secret = secretsRevealed && e.secrets ? `\nDM secret: ${e.secrets}` : ''
      const body = e.body.length > 900 ? `${e.body.slice(0, 900)}…` : e.body
      return `### ${e.title} (${e.kind})\n${e.summary}\n${body}${secret}`
    })
    .join('\n\n')
  return { hits, block }
}

export function sageSystemPrompt(secretsRevealed: boolean, intent: SageIntent): string {
  return [
    'You are Impa of the Sheikah, the in-app Dungeon Master oracle for Hyrule, a Legend of Zelda 5e one-shot called The Song of Time, set in the kingdom of Hyrule.',
    'Speak as a warm, precise Sheikah sage. Use the supplied campaign bible as canon. If the bible does not cover something, say so and offer a useful invention marked as new.',
    'Use Zelda names freely: Hyrule, Link, Zelda, Sheik, Ganondorf, Ganon, Impa, Navi, Saria, Darunia, Koroks, Bokoblins, the Triforce, the Ocarina of Time, Kakariko, the Lost Woods, the Forest Temple, the Sacred Realm.',
    secretsRevealed
      ? 'The user is the DM. You may share secrets, stat tactics, and spoilers.'
      : 'The user may be a player. Hide DM secrets and spoilers unless they clearly ask as the referee.',
    intent === 'create'
      ? 'They want new worldbuilding. Invent something that fits Hyrule and return it in lore.'
      : '',
    intent === 'map'
      ? 'They want a place visualized. Put a short image-generation prompt in mapPrompt (English, Zelda/Hyrule names allowed).'
      : 'Set mapPrompt to null unless they clearly asked for a map or painting.',
    'Reply with ONLY a JSON object, no markdown fence:',
    '{"answer":"markdown for the user","lore":null,"mapPrompt":null}',
    'If you invented a lasting place/person/item, set lore to {"title","summary","body","kind"} where kind is location|npc|item|creature|faction|lore.',
    'answer should be 1–4 short paragraphs, specific and playable. Use **bold** for names.',
  ]
    .filter(Boolean)
    .join(' ')
}

export function buildSageMessages(opts: {
  query: string
  entries: LoreEntry[]
  secretsRevealed: boolean
  history: OracleMessage[]
}): { intent: SageIntent; hitIds: string[]; messages: ChatMessage[] } {
  const intent = classifyIntent(opts.query)
  const { hits, block } = formatLoreContext(opts.entries, opts.query, opts.secretsRevealed)
  const history = opts.history
    .filter((m) => !m.pending && m.text.trim())
    .slice(-6)
    .map((m) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text,
    }))
  const messages: ChatMessage[] = [
    { role: 'system', content: sageSystemPrompt(opts.secretsRevealed, intent) },
    {
      role: 'system',
      content: `Campaign bible excerpts:\n${block}`,
    },
    ...history,
    { role: 'user', content: opts.query },
  ]
  return { intent, hitIds: hits.map((h) => h.entry.id), messages }
}

export interface SageAskResult {
  text: string
  hitIds: string[]
  created?: LoreEntry
  createdLoreId?: string
  mapPrompt?: string
  cursorAgentId?: string
}

export async function askSage(opts: {
  query: string
  entries: LoreEntry[]
  secretsRevealed: boolean
  history: OracleMessage[]
  settings: LlmSettings
}): Promise<SageAskResult> {
  const packed = buildSageMessages(opts)
  let raw: string
  let cursorAgentId: string | undefined
  if (isCursorProvider(opts.settings)) {
    const cursor = await runCursorOracle(packed.messages, opts.settings)
    raw = cursor.text
    cursorAgentId = cursor.agentId
  } else {
    raw = await completeChat(packed.messages, opts.settings)
  }
  const parsed = parseSageReply(raw)
  let created: LoreEntry | undefined
  if (parsed.lore) {
    created = {
      id: `custom-${Date.now().toString(36)}`,
      title: parsed.lore.title,
      kind: 'custom',
      tags: ['custom', 'worldbuilding', parsed.lore.kind || 'lore', ...tokenize(opts.query).slice(0, 6)],
      summary: parsed.lore.summary,
      body: parsed.lore.body,
    }
  } else if (packed.intent === 'create') {
    created = createLoreFromPrompt(opts.query, parsed.answer)
  }
  const mapPrompt = packed.intent === 'map' ? parsed.mapPrompt || opts.query : parsed.mapPrompt || undefined
  return {
    text: parsed.answer,
    hitIds: packed.hitIds,
    created,
    createdLoreId: created?.id,
    mapPrompt: mapPrompt || undefined,
    cursorAgentId,
  }
}
