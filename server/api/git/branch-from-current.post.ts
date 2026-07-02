export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; name?: string; stash?: boolean }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const name = body.name?.trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'name is required' })

  const result = await createBranchFromCurrent(body.path, name, !!body.stash)
  return { ok: true, ...result, status: await status(body.path) }
})
