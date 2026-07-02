import { join } from 'node:path'
import { existsSync } from 'node:fs'

/** Best-effort default parent folder for cloning: ~/Documents when present, else home. */
export default defineEventHandler(() => {
  const home = process.env.HOME || process.env.USERPROFILE || ''
  const documents = home ? join(home, 'Documents') : ''
  const path = documents && existsSync(documents) ? documents : home
  return { path }
})
