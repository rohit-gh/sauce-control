<script setup lang="ts">
interface GhStatus {
  installed: boolean
  authenticated: boolean
  user: string | null
  version: string | null
}

const projects = useProjectsStore()
const ui = useUiStore()

const adding = ref(false)
const gh = ref<GhStatus | null>(null)

const ghReady = computed(() => !!gh.value?.installed && !!gh.value?.authenticated)

async function checkGh() {
  try {
    gh.value = await $fetch<GhStatus>('/api/gh/status')
  } catch {
    gh.value = null
  }
}
onMounted(checkGh)

// Refresh the GitHub status whenever the setup modal is closed.
watch(
  () => ui.ghSetupOpen,
  (open, wasOpen) => {
    if (wasOpen && !open) checkGh()
  },
)

// Browse for a folder with the native picker and add it directly — no manual path entry.
async function browseAndAdd() {
  if (adding.value) return
  adding.value = true
  projects.error = ''
  try {
    const res = await $fetch<{ path: string | null }>('/api/system/pick-folder')
    if (!res.path) return
    await projects.add(res.path)
  } catch (err: any) {
    if (!projects.error) {
      projects.error = err?.data?.statusMessage || err?.message || 'Could not add folder'
    }
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-6 p-8">
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-soft text-3xl font-bold text-white">
      S
    </div>
    <div class="text-center">
      <h1 class="text-xl font-semibold text-white">Welcome to SauceControl</h1>
      <p class="mt-1 max-w-md text-sm text-slate-400">
        A browser-based Git client. Add a local repository to visualize its history,
        stage changes, and open a terminal right where you need it.
      </p>
    </div>

    <div class="w-full max-w-md">
      <!-- GitHub CLI requirement -->
      <div class="rounded-xl border border-ink-700 bg-ink-850 p-4">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 text-lg" :class="ghReady ? 'text-green-400' : 'text-amber-400'">
            {{ ghReady ? '✓' : '①' }}
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-white">Set up the GitHub CLI</h2>
            <p class="mt-0.5 text-[12px] text-slate-400">
              SauceControl requires the GitHub CLI (<span class="font-mono">gh</span>) to work —
              it powers cloning and pushing to your repositories.
            </p>
            <p v-if="ghReady" class="mt-1 text-[11px] text-green-400">
              Connected as {{ gh?.user }}. You're all set.
            </p>
          </div>
        </div>
        <button
          class="mt-3 w-full justify-center"
          :class="ghReady ? 'btn-subtle' : 'btn-primary'"
          @click="ui.ghSetupOpen = true"
        >
          {{ ghReady ? 'Manage GitHub setup' : 'Set up GitHub CLI' }}
        </button>
      </div>

      <div class="my-4 flex items-center gap-3">
        <div class="h-px flex-1 bg-ink-800" />
        <span class="text-[11px] text-slate-600">then add a repository</span>
        <div class="h-px flex-1 bg-ink-800" />
      </div>

      <div class="flex flex-col gap-2">
        <button class="btn-subtle w-full justify-center" :disabled="adding" @click="browseAndAdd">
          <span class="text-base">📁</span>
          {{ adding ? 'Opening folder picker…' : 'Browse & add repo' }}
        </button>
        <button class="btn-subtle w-full justify-center" @click="ui.ghCloneOpen = true">
          <span class="text-base">⬇</span> Clone from GitHub
        </button>
      </div>
      <p v-if="projects.error" class="mt-2 text-xs text-red-400">{{ projects.error }}</p>
    </div>
  </div>
</template>
