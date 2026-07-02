export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; index?: number }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const index = body.index ?? 0
  await stashDrop(body.path, index)
  return { ok: true }
})
