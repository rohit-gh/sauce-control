export interface DiffLine {
  type: 'add' | 'del' | 'ctx' | 'meta' | 'hunk'
  text: string
  oldNo?: number
  newNo?: number
}

/** Parse a unified diff string into renderable lines. */
export function parseUnifiedDiff(raw: string): DiffLine[] {
  if (!raw.trim()) return []

  const lines: DiffLine[] = []
  let oldLine = 0
  let newLine = 0

  for (const line of raw.split('\n')) {
    if (line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('new file') || line.startsWith('deleted file') || line.startsWith('similarity ') || line.startsWith('rename ')) {
      lines.push({ type: 'meta', text: line })
      continue
    }
    if (line.startsWith('---') || line.startsWith('+++')) {
      lines.push({ type: 'meta', text: line })
      continue
    }
    if (line.startsWith('@@')) {
      lines.push({ type: 'hunk', text: line })
      const m = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)/)
      if (m) {
        oldLine = Number(m[1])
        newLine = Number(m[2])
      }
      continue
    }
    if (line.startsWith('+')) {
      lines.push({ type: 'add', text: line.slice(1), newNo: newLine++ })
    } else if (line.startsWith('-')) {
      lines.push({ type: 'del', text: line.slice(1), oldNo: oldLine++ })
    } else if (line.startsWith(' ') || line === '') {
      lines.push({ type: 'ctx', text: line.slice(1) || '', oldNo: oldLine++, newNo: newLine++ })
    } else {
      lines.push({ type: 'meta', text: line })
    }
  }
  return lines
}
