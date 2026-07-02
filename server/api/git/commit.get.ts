export default defineEventHandler(async (event) => {
  const { path, hash } = getQuery(event) as { path?: string; hash?: string }
  if (!path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  if (!hash) throw createError({ statusCode: 400, statusMessage: 'hash is required' })
  return await commitDetail(path, hash)
})
