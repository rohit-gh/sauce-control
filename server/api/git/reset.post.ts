export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; hash?: string; mode?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  if (!body?.hash) throw createError({ statusCode: 400, statusMessage: 'hash is required' })
  const mode = body.mode as 'soft' | 'mixed' | 'hard'
  if (!['soft', 'mixed', 'hard'].includes(mode)) {
    throw createError({ statusCode: 400, statusMessage: 'mode must be soft, mixed, or hard' })
  }
  await gitReset(body.path, body.hash, mode)
  return { ok: true, status: await status(body.path) }
})
