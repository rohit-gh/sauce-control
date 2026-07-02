export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; message?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const stashed = await stashPush(body.path, body.message)
  return { ok: true, stashed, status: await status(body.path) }
})
