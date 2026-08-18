import type { GeneratedMap } from '../types'

export const BIOMES = [
  'forest',
  'village',
  'dungeon',
  'temple',
  'mountain',
  'coast',
  'desert',
  'swamp',
  'castle',
  'cave',
  'region',
  'twilight',
] as const

export type Biome = (typeof BIOMES)[number]

const BIOME_WORDS: Record<Biome, string[]> = {
  forest: ['forest', 'woods', 'woodland', 'grove', 'jungle', 'echoes', 'trees', 'lost woods', 'kokiri'],
  village: ['village', 'town', 'hamlet', 'kakariko', 'windfall', 'settlement'],
  dungeon: ['dungeon', 'crypt', 'labyrinth', 'rooms', 'keys'],
  temple: ['temple', 'shrine', 'sanctum', 'ziggurat'],
  mountain: ['mountain', 'peak', 'plateau', 'mesa', 'cliff'],
  coast: ['coast', 'sea', 'ocean', 'harbor', 'island', 'shore'],
  desert: ['desert', 'dune', 'sand', 'canyon'],
  swamp: ['swamp', 'marsh', 'bog', 'mire'],
  castle: ['castle', 'keep', 'fort', 'palace', 'citadel'],
  cave: ['cave', 'cavern', 'grotto', 'mine'],
  region: ['region', 'kingdom', 'realm', 'overworld', 'map of'],
  twilight: ['twilight', 'dusk', 'shadow', 'gloom', 'night'],
}

export function detectBiome(prompt: string): Biome {
  const q = prompt.toLowerCase()
  let best: Biome = 'region'
  let n = 0
  for (const biome of BIOMES) {
    const hits = BIOME_WORDS[biome].filter((w) => q.includes(w)).length
    if (hits > n) {
      n = hits
      best = biome
    }
  }
  return best
}

export function enhancePrompt(prompt: string): string {
  const biome = detectBiome(prompt)
  return [
    'Hand-painted Breath of the Wild / Tears of the Kingdom cartography of Hyrule,',
    'golden Hyrule Field hour, Sheikah cyan, Zonai teal-gold, cream parchment, dusk amber, gloom magenta,',
    'no heavy forest-green wash, sky-island light, weathered stone shrines,',
    `biome: ${biome}.`,
    prompt.trim(),
    'Highly detailed, readable landmarks, ornate vine compass rose.',
  ].join(' ')
}

export function pollinationsUrl(prompt: string, seed: number): string {
  const enhanced = enhancePrompt(prompt)
  const encoded = encodeURIComponent(enhanced)
  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`
}

export function makeGeneratedMap(prompt: string): GeneratedMap {
  const seed = Date.now() % 1_000_000
  return {
    id: `map-${seed}`,
    prompt,
    enhancedPrompt: enhancePrompt(prompt),
    imageUrl: pollinationsUrl(prompt, seed),
    biome: detectBiome(prompt),
    createdAt: Date.now(),
    title: prompt.slice(0, 48),
  }
}

export function extractLabels(prompt: string): string[] {
  const parts = prompt
    .split(/[,;/]| and | with | featuring /i)
    .map((p) => p.replace(/\b(a|an|the|map of|fantasy|please)\b/gi, ' ').replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 2 && p.length < 32)
  const unique = [...new Set(parts)]
  return unique.slice(0, 6)
}

const BIOME_COLORS: Record<Biome, { fill: string; ink: string; water: string }> = {
  forest: { fill: '#4a5340', ink: '#f0e2b8', water: '#3d7a88' },
  village: { fill: '#5a4030', ink: '#f4e0b0', water: '#4a7a88' },
  dungeon: { fill: '#2a2420', ink: '#e6d2a8', water: '#3a4a55' },
  temple: { fill: '#3a4038', ink: '#e8dcc0', water: '#3d9b94' },
  mountain: { fill: '#3a4858', ink: '#e8e4dc', water: '#5a8aa0' },
  coast: { fill: '#1c3a44', ink: '#f2e6c4', water: '#2a6a88' },
  desert: { fill: '#8a5a30', ink: '#f4e0b0', water: '#6a8aa0' },
  swamp: { fill: '#3a4030', ink: '#e6d4a8', water: '#3a5a58' },
  castle: { fill: '#2a2834', ink: '#e8dcc0', water: '#4a6078' },
  cave: { fill: '#1a1816', ink: '#d8c8a8', water: '#2a3840' },
  region: { fill: '#5a5340', ink: '#ead9a8', water: '#3d7a88' },
  twilight: { fill: '#4a2030', ink: '#e4c8a0', water: '#6b1f3a' },
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number): () => number {
  let a = seed || 1
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function svgMap(prompt: string, width = 640, height = 400): string {
  const biome = detectBiome(prompt)
  const colors = BIOME_COLORS[biome]
  const rand = rng(hash(prompt) || 1)
  const labels = extractLabels(prompt)
  if (labels.length === 0) labels.push(biome)

  const blobs: string[] = []
  for (let i = 0; i < 7; i++) {
    const cx = 80 + rand() * (width - 160)
    const cy = 70 + rand() * (height - 140)
    const rx = 40 + rand() * 90
    const ry = 30 + rand() * 70
    blobs.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${colors.fill}" opacity="${(0.35 + rand() * 0.35).toFixed(2)}"/>`,
    )
  }

  const pathPts: string[] = []
  let x = 60
  let y = height * (0.4 + rand() * 0.2)
  pathPts.push(`M ${x.toFixed(0)} ${y.toFixed(0)}`)
  while (x < width - 60) {
    x += 40 + rand() * 50
    y += (rand() - 0.5) * 50
    y = Math.max(80, Math.min(height - 80, y))
    pathPts.push(`Q ${x - 20} ${y.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`)
  }

  const markers = labels.map((label, i) => {
    const lx = 90 + ((i * 97 + hash(label) % 80) % (width - 180))
    const ly = 90 + ((i * 67 + 40) % (height - 160))
    return `<g>
      <circle cx="${lx}" cy="${ly}" r="6" fill="#c9a227" stroke="#f4e4b0" stroke-width="1.5"/>
      <text x="${lx + 10}" y="${ly + 4}" fill="${colors.ink}" font-family="Georgia, serif" font-size="13">${escapeXml(label)}</text>
    </g>`
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
    <defs>
      <filter id="paper">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="n"/>
        <feColorMatrix in="n" type="luminanceToAlpha"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="#c4b392"/>
    <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="#e8dcc0" stroke="#8a6a3a" stroke-width="4"/>
    <rect x="18" y="18" width="${width - 36}" height="${height - 36}" fill="${colors.water}" opacity="0.25"/>
    ${blobs.join('\n')}
    <path d="${pathPts.join(' ')}" fill="none" stroke="#c9a227" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
    ${markers.join('\n')}
    <text x="${width / 2}" y="36" text-anchor="middle" fill="#4a3420" font-family="Georgia, serif" font-size="16" font-style="italic">${escapeXml(prompt.slice(0, 48))}</text>
    <g transform="translate(${width - 70}, ${height - 70})">
      <circle r="22" fill="none" stroke="#4a3420" stroke-width="1.5"/>
      <polygon points="0,-18 5,0 0,6 -5,0" fill="#c9a227"/>
      <text y="32" text-anchor="middle" font-size="10" fill="#4a3420">N</text>
    </g>
  </svg>`
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
