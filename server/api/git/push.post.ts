export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; remote?: string }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const remote = body.remote || 'origin'

  // SauceCtrl only supports GitHub remotes. Refuse to push elsewhere.
  const url = await remoteUrl(body.path, remote)
  if (url && !isGithubRemote(url)) {
    throw createError({
      statusCode: 422,
      statusMessage:
        'SauceCtrl only provides GitHub support. For other remotes, please use another Git client or the CLI.',
      data: { reason: 'unsupported-remote', remote, url },
    })
  }

  try {
    await gitPush(body.path, remote)
  } catch (err: any) {
    const msg = String(err?.message || '')
    // Authentication / permission failures need a human action, so surface a
    // clear, actionable message instead of the raw git/ssh stderr.
    if (
      /permission denied|publickey|could not read from remote|authentication failed|invalid username or password|403|401/i.test(
        msg,
      )
    ) {
      const isSsh = /^git@|ssh:\/\//i.test(url || '')
      throw createError({
        statusCode: 401,
        statusMessage: isSsh
          ? 'Push failed: GitHub rejected your SSH key. Add your key to GitHub (or load it with `ssh-add`), then try again.'
          : 'Push failed: GitHub authentication failed. Run `gh auth login` to re-authenticate, then try again.',
        data: { reason: 'auth-failed', remote, url, detail: msg },
      })
    }
    throw createError({ statusCode: 500, statusMessage: `Push failed: ${msg}`, data: { detail: msg } })
  }
  return { ok: true, status: await status(body.path) }
})
