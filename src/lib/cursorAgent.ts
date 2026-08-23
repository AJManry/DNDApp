import type { ChatMessage, LlmSettings } from './llm'

export const CURSOR_SCHEME = 'cursor://cloud-agent'
export const CURSOR_API_ORIGIN = 'https://api.cursor.com'
export const CURSOR_DASHBOARD_KEYS = 'https://cursor.com/dashboard/api'
export const DEFAULT_CURSOR_REPO = 'https://github.com/AJManry/DNDApp'
export const DEFAULT_CURSOR_REF = 'cursor/zelda-hyrule-theme-3415'

const POLL_MS = 2500
const MAX_WAIT_MS = 8 * 60 * 1000
const BUSY_RETRIES = 8

export interface CursorRunResult {
  text: string
  agentId: string
  agentUrl: string
}

export function isCursorProvider(settings: Pick<LlmSettings, 'baseUrl'>): boolean {
  const url = settings.baseUrl.trim().toLowerCase()
  return url.startsWith('cursor://') || url.includes('api.cursor.com')
}

export function cursorApiUrl(
  path: string,
  opts?: { dev?: boolean; proxyUrl?: string },
): string {
  const suffix = path.startsWith('/') ? path : `/${path}`
  const proxy = opts?.proxyUrl?.trim().replace(/\/$/, '')
  if (proxy) {
    if (proxy.startsWith('cursor://')) return `${CURSOR_API_ORIGIN}${suffix}`
    return `${proxy}${suffix}`
  }
  const dev = opts?.dev ?? Boolean(import.meta.env.DEV)
  if (dev) return `/cursor-api${suffix}`
  return `${CURSOR_API_ORIGIN}${suffix}`
}

export function cursorAgentUrl(agentId: string): string {
  return `https://cursor.com/agents/${agentId}`
}

export function buildCursorPrompt(messages: ChatMessage[]): string {
  const body = messages.map((m) => `### ${m.role}\n${m.content}`).join('\n\n')
  return [
    'You are answering a Hyrule Oracle question from inside a Cursor Cloud Agent.',
    'This is a READ-ONLY lookup. Do not edit, create, delete, commit, or push files.',
    'Do not open a pull request. Do not run git write commands. Do not use computer-use.',
    'You MAY search this repository: Grep/Read src/data/campaign.ts, lore.ts, bestiary.ts, pregens.ts, maps.ts and related files. Treat those files as canon.',
    'Then answer as Impa of the Sheikah. Use Zelda names (Hyrule, Link, Ganondorf, Ocarina of Time, Triforce). Reply with ONLY a JSON object, no markdown fence:',
    '{"answer":"markdown for the user","lore":null,"mapPrompt":null}',
    '',
    body,
  ].join('\n')
}

export function buildCursorForgePrompt(userPrompt: string): string {
  return [
    'You are forging a player character for a Legend of Zelda D&D 5e one-shot (The Song of Time) from inside a Cursor Cloud Agent.',
    'This is a READ-ONLY lookup. Do not edit, create, delete, commit, or push files.',
    'Do not open a pull request. Do not run git write commands. Do not use computer-use.',
    'You MAY search this repository: Grep/Read src/data/pregens.ts, src/data/skills.ts, src/lib/characterForge.ts, src/types.ts, and src/data/lore.ts. Match the sheet shape of the pregens.',
    'Create one 3rd-level adventurer from the player’s prompt. Ancestries: Hylian, Sheikah, Goron, Zora, Gerudo, Rito, Kokiri, Korok, Twili.',
    'Give a Triforce virtue: Courage, Wisdom, or Power. Inventory notes must include attack dice like “+5 to hit, 1d8+3 slashing.”',
    'Reply with ONLY this JSON object, no markdown fence, no Impa voice, no Oracle wrapper object:',
    '{"name":"","ancestry":"","className":"Ranger 3 (Gloom Walker)","virtue":"Courage","hp":24,"ac":14,"speed":30,',
    '"abilities":{"str":10,"dex":16,"con":14,"int":10,"wis":14,"cha":8},"proficientSkills":["Stealth","Survival"],',
    '"inventory":[{"name":"Shortbow","qty":1,"rarity":"common","notes":"+5 to hit, 1d6+3 piercing, 80/320.","equipped":true}],',
    '"notes":"two sentences of backstory"}',
    '',
    '### player prompt',
    userPrompt.trim(),
  ].join('\n')
}

export async function runCursorOracle(
  messages: ChatMessage[],
  settings: LlmSettings,
): Promise<CursorRunResult> {
  return runCursorJob(buildCursorPrompt(messages), settings, {
    name: 'Hyrule Oracle',
    reuseAgent: true,
    emptyError: 'Cursor returned an empty Oracle answer.',
  })
}

export async function runCursorForge(userPrompt: string, settings: LlmSettings): Promise<CursorRunResult> {
  const q = userPrompt.replace(/\s+/g, ' ').trim()
  if (!q) throw new Error('Describe the adventurer before asking Cursor to forge them.')
  return runCursorJob(buildCursorForgePrompt(q), settings, {
    name: 'Hyrule Forge',
    reuseAgent: false,
    emptyError: 'Cursor returned an empty character sheet.',
  })
}

async function runCursorJob(
  prompt: string,
  settings: LlmSettings,
  opts: { name: string; reuseAgent: boolean; emptyError: string },
): Promise<CursorRunResult> {
  const key = settings.apiKey.trim()
  if (!key) {
    throw new Error(
      `Paste a Cursor API key from ${CURSOR_DASHBOARD_KEYS}. Character forge uses your Cursor Cloud Agent, not another model.`,
    )
  }

  let agentId = opts.reuseAgent ? settings.cursorAgentId?.trim() || '' : ''
  let runId = ''

  if (agentId) {
    try {
      const follow = await createFollowUp(agentId, prompt, settings)
      agentId = follow.agentId
      runId = follow.runId
    } catch (err) {
      if (!isRecoverableAgentError(err)) throw err
      agentId = ''
    }
  }

  if (!agentId || !runId) {
    const created = await createAgent(prompt, settings, opts.name)
    agentId = created.agentId
    runId = created.runId
  }

  const text = await pollRun(agentId, runId, settings)
  if (!text.trim()) throw new Error(opts.emptyError)
  return { text, agentId, agentUrl: cursorAgentUrl(agentId) }
}

export async function verifyCursorApiKey(settings: LlmSettings): Promise<string> {
  const data = await cursorFetch<Record<string, unknown>>('/v1/me', settings)
  const name =
    pickString(data.name) ||
    pickString(data.email) ||
    pickString(data.userId) ||
    pickString(data.id) ||
    'ok'
  return `Connected to Cursor as ${name}.`
}

async function createAgent(
  prompt: string,
  settings: LlmSettings,
  name = 'Hyrule Oracle',
): Promise<{ agentId: string; runId: string }> {
  const body: Record<string, unknown> = {
    prompt: { text: prompt },
    name,
    autoCreatePR: false,
    workOnCurrentBranch: false,
  }
  const model = settings.model.trim()
  if (model) body.model = { id: model }
  if (settings.cursorSearchRepo !== false) {
    const url = (settings.cursorRepoUrl || DEFAULT_CURSOR_REPO).trim()
    const startingRef = (settings.cursorRef || DEFAULT_CURSOR_REF).trim()
    if (url) {
      body.repos = [{ url, ...(startingRef ? { startingRef } : {}) }]
    }
  }

  const data = await cursorFetch<Record<string, unknown>>('/v1/agents', settings, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return extractIds(data, 'create')
}

async function createFollowUp(
  agentId: string,
  prompt: string,
  settings: LlmSettings,
): Promise<{ agentId: string; runId: string }> {
  let lastErr: unknown
  for (let i = 0; i < BUSY_RETRIES; i += 1) {
    try {
      const data = await cursorFetch<Record<string, unknown>>(
        `/v1/agents/${encodeURIComponent(agentId)}/runs`,
        settings,
        {
          method: 'POST',
          body: JSON.stringify({ prompt: { text: prompt } }),
        },
      )
      const ids = extractIds(data, 'follow-up')
      return { agentId: ids.agentId || agentId, runId: ids.runId }
    } catch (err) {
      lastErr = err
      if (isBusyError(err)) {
        await sleep(POLL_MS)
        continue
      }
      throw err
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Cursor agent is busy.')
}

async function pollRun(agentId: string, runId: string, settings: LlmSettings): Promise<string> {
  const deadline = Date.now() + MAX_WAIT_MS
  while (Date.now() < deadline) {
    const data = await cursorFetch<Record<string, unknown>>(
      `/v1/agents/${encodeURIComponent(agentId)}/runs/${encodeURIComponent(runId)}`,
      settings,
    )
    const status = pickString(data.status)?.toUpperCase() || ''
    if (status === 'FINISHED' || status === 'COMPLETED') {
      const text = pickString(data.result) || pickNestedText(data)
      if (!text) throw new Error('Cursor finished without an Oracle reply.')
      return text
    }
    if (status === 'ERROR' || status === 'FAILED') {
      throw new Error(pickString(data.result) || pickString(data.error) || 'Cursor agent run failed.')
    }
    if (status === 'CANCELLED' || status === 'CANCELED' || status === 'EXPIRED') {
      throw new Error(`Cursor agent run ${status.toLowerCase()}.`)
    }
    await sleep(POLL_MS)
  }
  throw new Error('Cursor is still working on that question. Try again in a moment; the same Oracle session will be reused.')
}

function extractIds(
  data: Record<string, unknown>,
  kind: string,
): { agentId: string; runId: string } {
  const agent = asRecord(data.agent)
  const run = asRecord(data.run)
  const agentId =
    pickString(agent?.id) || pickString(data.agentId) || pickString(data.id) || ''
  const runId = pickString(run?.id) || pickString(data.runId) || pickString(data.latestRunId) || ''
  if (!agentId || !runId) {
    throw new Error(`Cursor ${kind} response was missing agent or run id.`)
  }
  return { agentId, runId }
}

async function cursorFetch<T>(path: string, settings: LlmSettings, init: RequestInit = {}): Promise<T> {
  const key = settings.apiKey.trim()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${key}`)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const url = cursorApiUrl(path, { proxyUrl: settings.cursorProxyUrl })
  try {
    const res = await fetch(url, { ...init, headers })
    const raw = await res.text()
    if (res.status === 409 && /busy/i.test(raw)) {
      throw Object.assign(new Error('Cursor agent is busy.'), { code: 'busy' })
    }
    if (res.status === 404 || res.status === 410) {
      throw Object.assign(new Error(shortCursorError(raw, res.status)), { code: 'gone' })
    }
    if (!res.ok) {
      throw new Error(shortCursorError(raw, res.status))
    }
    if (!raw.trim()) return {} as T
    try {
      return JSON.parse(raw) as T
    } catch {
      throw new Error('Cursor returned a non-JSON response.')
    }
  } catch (err) {
    if (isCorsFailure(err)) {
      throw new Error(
        'The browser blocked api.cursor.com (CORS). Run Hyrule with `npm run dev` (Vite proxies Cursor), or set a same-origin Cursor API proxy in Model settings.',
      )
    }
    throw err
  }
}

function isRecoverableAgentError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const code = (err as { code?: string }).code
  if (code === 'gone') return true
  const message = err instanceof Error ? err.message : String(err)
  return /not found|expired|archived|inactive/i.test(message)
}

function isBusyError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  if ((err as { code?: string }).code === 'busy') return true
  const message = err instanceof Error ? err.message : String(err)
  return /agent_busy|\bbusy\b/i.test(message)
}

function isCorsFailure(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  return /failed to fetch|networkerror|load failed|cors/i.test(err.message)
}

function shortCursorError(body: string, status: number): string {
  try {
    const parsed = JSON.parse(body) as {
      error?: { message?: string; code?: string } | string
      message?: string
    }
    if (typeof parsed.error === 'string' && parsed.error.trim()) return parsed.error
    if (parsed.error && typeof parsed.error === 'object' && parsed.error.message) {
      return parsed.error.message
    }
    if (parsed.message?.trim()) return parsed.message
  } catch {
    /* ignore */
  }
  const clip = body.replace(/\s+/g, ' ').slice(0, 180)
  if (status === 401 || status === 403) {
    return `Cursor rejected the API key (${status}). Create a user key at ${CURSOR_DASHBOARD_KEYS}.`
  }
  return clip || `Cursor API failed (${status})`
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function pickString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function pickNestedText(data: Record<string, unknown>): string | null {
  const result = asRecord(data.result)
  return pickString(result?.text) || pickString(result?.result)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}
