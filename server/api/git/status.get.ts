export default defineEventHandler(async (event) => {
  const { path } = getQuery(event) as { path?: string }
  if (!path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  return await status(path)
})
