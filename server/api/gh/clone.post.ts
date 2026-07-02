import { randomUUID } from 'node:crypto'
import { basename, resolve, join } from 'node:path'
import { existsSync } from 'node:fs'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ nameWithOwner?: string; parentDir?: string }>(event)
  const nameWithOwner = body?.nameWithOwner?.trim()
  const rawParent = body?.parentDir?.trim()
  if (!nameWithOwner) throw createError({ statusCode: 400, statusMessage: 'nameWithOwner is required' })
  if (!rawParent) throw createError({ statusCode: 400, statusMessage: 'A destination folder is required' })

  const parentDir = resolve(rawParent.replace(/^~(?=$|\/)/, process.env.HOME || ''))
  if (!existsSync(parentDir)) {
    throw createError({ statusCode: 400, statusMessage: `Destination does not exist: ${parentDir}` })
  }

  const repoName = nameWithOwner.split('/').pop() || nameWithOwner
  const targetDir = join(parentDir, repoName)
  if (existsSync(targetDir)) {
    throw createError({ statusCode: 400, statusMessage: `Folder already exists: ${targetDir}` })
  }

  try {
    await ghCloneRepo(nameWithOwner, targetDir)
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.stderr?.toString().trim() || err?.message || 'Clone failed',
    })
  }

  const root = await repoRoot(targetDir)
  const row = {
    id: randomUUID(),
    name: basename(root || targetDir),
    path: root || targetDir,
    added_at: Date.now(),
    last_opened: Date.now(),
  }
  addProject(row)
  return row
})
