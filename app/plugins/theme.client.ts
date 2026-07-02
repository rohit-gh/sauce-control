import { useThemeStore } from '~/stores/theme'

// Apply the persisted theme as early as possible so there's no flash of the
// default palette before the app mounts.
export default defineNuxtPlugin(() => {
  useThemeStore().init()
})
