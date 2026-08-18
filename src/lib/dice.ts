export function roll(sides: number): number {
  return 1 + Math.floor(Math.random() * sides)
}

export function rollDice(expr: string): { label: string; sides: number; result: number; detail: string } {
  const m = expr.trim().toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/)
  if (!m) {
    const sides = Number(expr) || 20
    const result = roll(sides)
    return { label: `d${sides}`, sides, result, detail: `${result}` }
  }
  const count = Number(m[1] || '1')
  const sides = Number(m[2])
  const mod = m[3] ? Number(m[3]) : 0
  const parts: number[] = []
  for (let i = 0; i < Math.min(count, 20); i++) parts.push(roll(sides))
  const result = parts.reduce((a, b) => a + b, 0) + mod
  const detail = `${parts.join('+')}${mod ? (mod > 0 ? `+${mod}` : `${mod}`) : ''}=${result}`
  return { label: expr, sides, result, detail }
}
