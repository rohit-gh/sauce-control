export default defineEventHandler(async (event) => {
  const { owner } = getQuery(event) as { owner?: string }
  const s = await ghStatus()
  if (!s.installed) {
    throw createError({ statusCode: 400, statusMessage: 'GitHub CLI (gh) is not installed' })
  }
  if (!s.authenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated with GitHub. Run GitHub Setup first.' })
  }
  try {
    return await ghListRepos(owner?.trim() || undefined)
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.stderr?.toString().trim() || err?.message || 'Failed to list repositories',
    })
  }
})
