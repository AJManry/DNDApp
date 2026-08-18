export interface LlmSettings {
  baseUrl: string
  apiKey: string
  model: string
}

export const LLM_STORAGE_KEY = 'sagekeep-llm-v1'

export const POLLINATIONS_CHAT_URL = 'https://text.pollinations.ai/openai'

export const LLM_PRESETS: { id: string; label: string; baseUrl: string; model: string }[] = [
  {
    id: 'puter',
    label: 'Puter (browser, no key)',
    baseUrl: 'puter://chat',
    model: 'gpt-4o-mini',
  },
  {
    id: 'pollinations',
    label: 'Pollinations (free)',
    baseUrl: POLLINATIONS_CHAT_URL,
    model: 'openai',
  },
  {
    id: 'groq',
    label: 'Groq (free key)',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-4o-mini',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
  },
]

export function defaultLlmSettings(): LlmSettings {
  return {
    baseUrl: 'puter://chat',
    apiKey: '',
    model: 'gpt-4o-mini',
  }
}

export function loadLlmSettings(): LlmSettings {
  try {
    const raw = localStorage.getItem(LLM_STORAGE_KEY)
    if (!raw) return defaultLlmSettings()
    return { ...defaultLlmSettings(), ...(JSON.parse(raw) as Partial<LlmSettings>) }
  } catch {
    return defaultLlmSettings()
  }
}

export function saveLlmSettings(settings: LlmSettings): void {
  localStorage.setItem(LLM_STORAGE_KEY, JSON.stringify(settings))
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function completeChat(messages: ChatMessage[], settings: LlmSettings): Promise<string> {
  const url = settings.baseUrl.trim() || 'puter://chat'
  if (settings.apiKey.trim()) {
    return completeOpenAI(messages, settings)
  }
  if (url.startsWith('puter://')) {
    try {
      return await completePuter(messages, settings.model)
    } catch (err) {
      try {
        return await completeOpenAI(messages, {
          ...settings,
          baseUrl: POLLINATIONS_CHAT_URL,
          model: 'openai',
          apiKey: '',
        })
      } catch (fallbackErr) {
        const a = err instanceof Error ? err.message : String(err)
        const b = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)
        throw new Error(
          `${a} ${b} Add a free Groq API key in Model settings if the built-in providers are busy.`,
        )
      }
    }
  }
  const errors: string[] = []
  try {
    return await completeOpenAI(messages, settings)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  try {
    return await completePuter(messages, settings.model)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  throw new Error(
    `${errors.filter(Boolean).join(' ')} Add a free Groq API key in Model settings if the built-in providers are busy.`,
  )
}

async function completeOpenAI(messages: ChatMessage[], settings: LlmSettings): Promise<string> {
  const url = settings.baseUrl.trim() || POLLINATIONS_CHAT_URL
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (settings.apiKey.trim()) {
    headers.Authorization = `Bearer ${settings.apiKey.trim()}`
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: settings.model.trim() || 'openai',
      messages,
      temperature: 0.55,
    }),
  })
  const raw = await res.text()
  if (!res.ok) {
    throw new Error(shortError(raw, res.status))
  }
  let data: unknown
  try {
    data = JSON.parse(raw) as unknown
  } catch {
    if (raw.trim()) return raw.trim()
    throw new Error('The model returned an empty answer.')
  }
  const text = extractContent(data)
  if (!text) throw new Error('The model returned an empty answer.')
  return text
}

type PuterChat = (
  prompt: unknown,
  options?: Record<string, unknown>,
) => Promise<unknown>

async function completePuter(messages: ChatMessage[], model: string): Promise<string> {
  const chat = await waitForPuterChat()
  const options = model.trim() ? { model: model.trim() } : {}
  try {
    return normalizePuter(await chat(messages, options))
  } catch {
    const flat = messages.map((m) => `${m.role.toUpperCase()}:\n${m.content}`).join('\n\n')
    return normalizePuter(await chat(flat, options))
  }
}

function waitForPuterChat(timeoutMs = 8000): Promise<PuterChat> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      if (typeof window === 'undefined') {
        reject(new Error('Puter is browser-only.'))
        return
      }
      const chat = (window as unknown as { puter?: { ai?: { chat?: PuterChat } } }).puter?.ai?.chat
      if (chat) {
        resolve(chat)
        return
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error('Puter.js did not load. Check the network or add an API key.'))
        return
      }
      window.setTimeout(tick, 120)
    }
    tick()
  })
}

function normalizePuter(result: unknown): string {
  if (typeof result === 'string' && result.trim()) return result.trim()
  if (result && typeof result === 'object') {
    const obj = result as Record<string, unknown>
    if (typeof obj.text === 'string' && obj.text.trim()) return obj.text.trim()
    const message = obj.message
    if (message && typeof message === 'object') {
      const content = (message as Record<string, unknown>).content
      if (typeof content === 'string' && content.trim()) return content.trim()
    }
    const extracted = extractContent(obj)
    if (extracted) return extracted
  }
  throw new Error('Puter returned an empty answer.')
}

function extractContent(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const obj = data as Record<string, unknown>
  const choices = obj.choices
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === 'object') {
    const choice = choices[0] as Record<string, unknown>
    const message = choice.message
    if (message && typeof message === 'object') {
      const content = (message as Record<string, unknown>).content
      if (typeof content === 'string') return content.trim()
    }
    if (typeof choice.text === 'string') return choice.text.trim()
  }
  if (typeof obj.content === 'string') return obj.content.trim()
  if (typeof obj.output === 'string') return obj.output.trim()
  return ''
}

function shortError(body: string, status: number): string {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } | string }
    if (typeof parsed.error === 'string') return parsed.error
    if (parsed.error?.message) return parsed.error.message
  } catch {
    /* ignore */
  }
  const clip = body.replace(/\s+/g, ' ').slice(0, 180)
  return clip || `Oracle model failed (${status})`
}
