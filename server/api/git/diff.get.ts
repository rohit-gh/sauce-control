export default defineEventHandler(async (event) => {
  const { path, file, staged, hash } = getQuery(event) as {
    path?: string
    file?: string
    staged?: string
    hash?: string
  }
  if (!path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  if (!file) throw createError({ statusCode: 400, statusMessage: 'file is required' })

  let diff: string
  if (hash) {
    diff = await commitFileDiff(path, hash, file)
  } else {
    diff = await fileDiff(path, file, staged === 'true' || staged === '1')
  }
  return { diff }
})
