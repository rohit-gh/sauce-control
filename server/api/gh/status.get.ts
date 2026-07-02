export default defineEventHandler(async () => {
  const s = await ghStatus()
  if (s.authenticated) {
    // Cache the token silently for future use.
    await persistGhToken()
  }
  return s
})
