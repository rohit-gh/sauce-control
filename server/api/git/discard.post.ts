export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; files?: string[]; all?: boolean }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })

  if (body.all) {
    // Discard every working-tree change and remove untracked files (staged stays intact).
    await runGit(body.path, ['checkout', '--', '.'])
    await runGit(body.path, ['clean', '-fd'])
  } else if (body.files?.length) {
    const st = await status(body.path)
    const untracked = new Set(st.untracked.map((f) => f.path))
    const tracked = body.files.filter((f) => !untracked.has(f))
    const toClean = body.files.filter((f) => untracked.has(f))
    if (tracked.length) await runGit(body.path, ['checkout', '--', ...tracked])
    if (toClean.length) await runGit(body.path, ['clean', '-fd', '--', ...toClean])
  } else {
    throw createError({ statusCode: 400, statusMessage: 'files or all is required' })
  }
  return await status(body.path)
})
