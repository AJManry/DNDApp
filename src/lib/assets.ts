/** Prefix public files so they work on GitHub Pages and other subdirectory hosts. */
export function asset(path: string): string {
  const base = import.meta.env?.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}
