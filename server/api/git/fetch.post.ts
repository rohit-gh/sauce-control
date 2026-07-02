export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; remote?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  await gitFetch(body.path, body.remote || 'origin')
  return { ok: true, status: await status(body.path) }
})
