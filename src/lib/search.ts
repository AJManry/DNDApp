import type { LoreEntry } from '../types'

export interface SearchHit {
  entry: LoreEntry
  score: number
  snippet: string
}

const STOP = new Set([
  'a',
  'an',
  'the',
  'of',
  'and',
  'or',
  'to',
  'in',
  'on',
  'for',
  'is',
  'it',
  'what',
  'who',
  'where',
  'when',
  'how',
  'why',
  'does',
  'do',
  'can',
  'with',
  'from',
  'about',
  'me',
  'please',
  'tell',
])

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t))
}

function haystack(entry: LoreEntry): string {
  return [entry.title, entry.kind, entry.tags.join(' '), entry.summary, entry.body, entry.secrets ?? '']
    .join('\n')
    .toLowerCase()
}

function snippetFor(entry: LoreEntry, tokens: string[]): string {
  const text = `${entry.summary} ${entry.body}`
  if (tokens.length === 0) return entry.summary
  const lower = text.toLowerCase()
  const idx = tokens.reduce((best, t) => {
    const i = lower.indexOf(t)
    if (i === -1) return best
    if (best === -1 || i < best) return i
    return best
  }, -1)
  if (idx < 0) return entry.summary
  const start = Math.max(0, idx - 60)
  const slice = text.slice(start, start + 180).trim()
  return `${start > 0 ? '…' : ''}${slice}${start + 180 < text.length ? '…' : ''}`
}

export function scoreEntry(entry: LoreEntry, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const title = entry.title.toLowerCase()
  const tags = entry.tags.map((t) => t.toLowerCase())
  const hay = haystack(entry)
  let score = 0
  for (const t of tokens) {
    if (title === t) score += 12
    else if (title.startsWith(t)) score += 8
    else if (title.includes(t)) score += 6
    if (tags.some((tag) => tag === t || tag.includes(t))) score += 4
    if (entry.kind === t) score += 3
    const occ = hay.split(t).length - 1
    score += Math.min(occ, 6)
  }
  if (entry.kind === 'secret') score -= 1
  return score
}

export function searchLore(entries: LoreEntry[], query: string, limit = 8): SearchHit[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []
  return entries
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, tokens),
      snippet: snippetFor(entry, tokens),
    }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
}
