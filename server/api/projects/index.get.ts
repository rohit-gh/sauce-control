export default defineEventHandler(async () => {
  const projects = listProjects()
  // Enrich with lightweight live info (current branch) where possible.
  const enriched = await Promise.all(
    projects.map(async (p) => {
      const branch = (await isGitRepo(p.path)) ? await currentBranch(p.path) : null
      return { ...p, branch, exists: branch !== null }
    }),
  )
  return enriched
})
