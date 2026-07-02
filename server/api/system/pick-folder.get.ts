export default defineEventHandler(async () => {
  const path = await pickFolder()
  return { path }
})
