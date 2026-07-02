export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; name?: string; startPoint?: string; checkout?: boolean }>(event)
  if (!body?.path) throw createError({ statusCode: 400, statusMessage: 'path is required' })
  const name = body.name?.trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'name is required' })
  if (!body.startPoint) throw createError({ statusCode: 400, statusMessage: 'startPoint is required' })

  await createBranchAt(body.path, name, body.startPoint)
  if (body.checkout) await checkoutBranch(body.path, name)
  return { ok: true, branch: await currentBranch(body.path) }
})
