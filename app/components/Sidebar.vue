<script setup lang="ts">
const projects = useProjectsStore()
const ui = useUiStore()

const menuOpen = ref(false)
const addingLocal = ref(false)

function openCloneFromGithub() {
  menuOpen.value = false
  ui.ghCloneOpen = true
}

// Browse for a folder with the native picker and add it directly — no manual path entry.
async function openAddLocal() {
  menuOpen.value = false
  if (addingLocal.value) return
  addingLocal.value = true
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
    addingLocal.value = false
  }
}

function closeMenu(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('[data-add-menu]')) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', closeMenu))
onBeforeUnmount(() => document.removeEventListener('click', closeMenu))

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}
</script>

<template>
  <aside class="flex h-full w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-900">
    <div class="flex items-center gap-2 px-4 py-4">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-soft text-sm font-bold text-white">
        S
      </div>
      <div>
        <div class="text-sm font-semibold text-white">SauceCtrl</div>
        <div class="text-[11px] text-slate-500">Git, but pleasant</div>
      </div>
    </div>

    <div class="relative flex items-center justify-between px-4 pb-2" data-add-menu>
      <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Projects</span>
      <button class="btn-ghost !px-1.5 !py-1" title="Add project" @click="menuOpen = !menuOpen">
        <span class="text-lg leading-none">＋</span>
      </button>

      <div
        v-if="menuOpen"
        class="absolute right-3 top-8 z-30 w-52 overflow-hidden rounded-lg border border-ink-700 bg-ink-850 py-1 shadow-2xl"
      >
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-ink-700"
          @click="openCloneFromGithub"
        >
          <span class="text-base">⬇</span> Clone from GitHub
        </button>
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-ink-700"
          @click="openAddLocal"
        >
          <span class="text-base">📁</span> Add local folder
        </button>
      </div>
    </div>

    <div v-if="addingLocal" class="px-4 pb-2 text-[11px] text-slate-500">Opening folder picker…</div>
    <div v-else-if="projects.error" class="px-4 pb-2 text-[11px] text-red-400">{{ projects.error }}</div>

    <nav class="min-h-0 flex-1 overflow-y-auto px-2">
      <button
        v-for="p in projects.projects"
        :key="p.id"
        class="group mb-1 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors"
        :class="p.id === projects.selectedId ? 'bg-ink-700' : 'hover:bg-ink-800'"
        @click="projects.select(p.id)"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold"
          :class="p.exists === false ? 'bg-red-900/40 text-red-300' : 'bg-ink-600 text-slate-200'"
        >
          {{ initials(p.name) }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-medium text-slate-100">{{ p.name }}</div>
          <div class="truncate text-[11px] text-slate-500">
            <span v-if="p.branch" class="text-accent">⎇ {{ p.branch }}</span>
            <span v-else>{{ p.path }}</span>
          </div>
        </div>
        <span
          class="hidden text-slate-500 hover:text-red-400 group-hover:inline"
          title="Remove"
          @click.stop="projects.remove(p.id)"
        >✕</span>
      </button>

      <p v-if="!projects.projects.length" class="px-2 py-6 text-center text-xs text-slate-500">
        No projects yet. Click ＋ to clone from GitHub or add a local folder.
      </p>
    </nav>

    <div class="flex gap-2 px-3 pb-3 pt-3">
      <button
        class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink-700 py-2 text-xs text-slate-300 hover:bg-ink-800"
        title="GitHub Setup"
        @click="ui.ghSetupOpen = true"
      >
        GitHub
      </button>
      <button
        class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink-700 py-2 text-xs text-slate-300 hover:bg-ink-800"
        title="Settings"
        @click="ui.settingsOpen = true"
      >
        <span class="text-base">⚙</span> Settings
      </button>
    </div>
  </aside>
</template>
