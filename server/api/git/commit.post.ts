export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; message?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const message = body.message?.trim()
  if (!message) throw createError({ statusCode: 400, statusMessage: 'A commit message is required' })

  await runGit(body.path, ['commit', '-m', message])
  return { ok: true, status: await status(body.path) }
})
