export function HpBar({ hp }: { hp?: { current?: number; max?: number } | null }) {
  const max = Number(hp?.max)
  const current = Number(hp?.current)
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1
  const safeCurrent = Number.isFinite(current) ? current : 0
  const pct = Math.max(0, Math.min(100, (safeCurrent / safeMax) * 100))
  return (
    <div className="hp">
      <div className="hp-fill" style={{ width: `${pct}%` }} />
      <span>
        {safeCurrent}/{Number.isFinite(max) ? max : 0} hp
      </span>
    </div>
  )
}
