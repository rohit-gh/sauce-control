export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; hash?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  if (!body?.hash) throw createError({ statusCode: 400, statusMessage: 'hash is required' })
  await gitCherryPick(body.path, body.hash)
  return { ok: true, status: await status(body.path) }
})
