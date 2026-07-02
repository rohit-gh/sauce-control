export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; remote?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const remote = body.remote || 'origin'

  // SauceControl only supports GitHub remotes. Refuse to push elsewhere.
  const url = await remoteUrl(body.path, remote)
  if (url && !isGithubRemote(url)) {
    throw createError({
      statusCode: 422,
      statusMessage:
        'SauceControl only provides GitHub support. For other remotes, please use another Git client or the CLI.',
      data: { reason: 'unsupported-remote', remote, url },
    })
  }

  await gitPush(body.path, remote)
  return { ok: true, status: await status(body.path) }
})
