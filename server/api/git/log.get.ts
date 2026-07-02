export default defineEventHandler(async (event) => {
  const { path, limit } = getQuery(event) as { path?: string; limit?: string }
  if (!path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const commits = await commitLog(path, limit ? Number(limit) : 300)
  return commits
})
