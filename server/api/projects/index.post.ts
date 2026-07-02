import { randomUUID } from 'node:crypto'
import { basename, resolve } from 'node:path'
import { existsSync } from 'node:fs'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string }>(event)
  const raw = body?.path?.trim()
  if (!raw) {
    throw createError({ statusCode: 400, statusMessage: 'A repository path is required' })
  }

  const path = resolve(raw.replace(/^~(?=$|\/)/, process.env.HOME || ''))

  if (!existsSync(path)) {
    throw createError({ statusCode: 400, statusMessage: `Path does not exist: ${path}` })
  }

  const root = await repoRoot(path)
  if (!root) {
    throw createError({ statusCode: 400, statusMessage: `Not a git repository: ${path}` })
  }

  const row = {
    id: randomUUID(),
    name: basename(root),
    path: root,
    added_at: Date.now(),
    last_opened: Date.now(),
  }
  addProject(row)
  return row
})
