export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; files?: string[]; all?: boolean }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })

  if (body.all) {
    await runGit(body.path, ['reset', '-q', 'HEAD', '--'])
  } else if (body.files?.length) {
    await runGit(body.path, ['reset', '-q', 'HEAD', '--', ...body.files])
  } else {
    throw createError({ statusCode: 400, statusMessage: 'files or all is required' })
  }
  return await status(body.path)
})
