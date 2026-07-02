<script setup lang="ts">
const projects = useProjectsStore()
const repo = useRepoStore()
const ui = useUiStore()

// Load projects once on mount.
onMounted(() => projects.fetch())

// Whenever the selected project changes, reload its repo data.
watch(
  () => projects.selected?.path,
  (path) => {
    repo.selectedHash = null
    repo.commitDetail = null
    if (path) repo.load(path)
  },
  { immediate: true },
)

// Keep the repo view in sync with changes made outside the UI (embedded
// terminal, external git tools). A full reload on focus catches commits/pushes
// when returning to the app; lightweight status polling keeps the Changes list
// current while the tab stays visible.
const POLL_MS = 4000

function fullRefresh() {
  if (repo.path && !repo.loading) repo.load(repo.path)
}

function pollStatus() {
  if (document.visibilityState !== 'visible') return
  if (repo.path && !repo.loading) repo.refreshStatus().catch(() => {})
}

function onVisibility() {
  if (document.visibilityState === 'visible') fullRefresh()
}

onMounted(() => {
  window.addEventListener('focus', fullRefresh)
  document.addEventListener('visibilitychange', onVisibility)
  const timer = setInterval(pollStatus, POLL_MS)
  onBeforeUnmount(() => {
    window.removeEventListener('focus', fullRefresh)
    document.removeEventListener('visibilitychange', onVisibility)
    clearInterval(timer)
  })
})
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-ink-950 text-slate-200">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader />

      <div v-if="projects.selected" class="flex min-h-0 flex-1">
        <main class="min-w-0 flex-1 border-r border-ink-800">
          <CommitGraph />
        </main>
        <aside class="flex w-[420px] shrink-0 flex-col bg-ink-900">
          <DetailPanel />
        </aside>
      </div>

      <EmptyState v-else />

      <TerminalPanel v-if="ui.terminalOpen && projects.selected" />
    </div>

    <GhSetup v-if="ui.ghSetupOpen" />
    <GhCloneModal v-if="ui.ghCloneOpen" />
    <SettingsModal v-if="ui.settingsOpen" />
    <InstallAppModal v-if="ui.pwaInstallOpen" />
    <UnsupportedRemoteModal />
  </div>
</template>
