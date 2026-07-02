<script setup lang="ts">
const repo = useRepoStore()
const emit = defineEmits<{ close: [] }>()

const name = ref('')
const busy = ref(false)
const error = ref('')

const fromBranch = computed(() => repo.status?.branch || 'HEAD')
const hasChanges = computed(() => repo.hasChanges)
// When there are uncommitted changes, let the user choose what happens to them.
const changeHandling = ref<'bring' | 'stash'>('bring')

async function create() {
  const branchName = name.value.trim()
  if (!branchName || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const stash = hasChanges.value && changeHandling.value === 'stash'
    await repo.createBranchFromCurrent(branchName, stash)
    emit('close')
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || 'Failed to create branch'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="emit('close')">
    <div class="w-full max-w-md rounded-xl border border-ink-700 bg-ink-900 shadow-2xl">
      <div class="border-b border-ink-800 px-5 py-4">
        <h2 class="text-base font-semibold text-white">Create new branch</h2>
        <p class="text-[11px] text-slate-500">
          Branches from <span class="font-mono text-accent">{{ fromBranch }}</span>
        </p>
      </div>

      <div class="px-5 py-4">
        <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Branch name
        </label>
        <input
          v-model="name"
          class="input"
          placeholder="feature/my-branch"
          autofocus
          @keyup.enter="create"
        />

        <div v-if="hasChanges" class="mt-4">
          <p class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            You have uncommitted changes
          </p>
          <label
            class="mb-1.5 flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-sm"
            :class="changeHandling === 'bring' ? 'border-accent bg-accent/10' : 'border-ink-700 hover:bg-ink-800'"
          >
            <input v-model="changeHandling" type="radio" value="bring" class="mt-0.5 accent-accent" />
            <span>
              <span class="font-medium text-slate-100">Bring changes to the new branch</span>
              <span class="block text-[11px] text-slate-500">Your working changes move with you.</span>
            </span>
          </label>
          <label
            class="flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-sm"
            :class="changeHandling === 'stash' ? 'border-accent bg-accent/10' : 'border-ink-700 hover:bg-ink-800'"
          >
            <input v-model="changeHandling" type="radio" value="stash" class="mt-0.5 accent-accent" />
            <span>
              <span class="font-medium text-slate-100">Stash changes</span>
              <span class="block text-[11px] text-slate-500">
                Changes are stashed and the new branch starts clean. Restore them later from Stashes.
              </span>
            </span>
          </label>
        </div>

        <p v-if="error" class="mt-3 text-xs text-red-400">{{ error }}</p>
      </div>

      <div class="flex justify-end gap-2 border-t border-ink-800 px-5 py-3">
        <button class="btn-subtle" @click="emit('close')">Cancel</button>
        <button class="btn-primary" :disabled="!name.trim() || busy" @click="create">
          {{ busy ? 'Creating…' : 'Create branch' }}
        </button>
      </div>
    </div>
  </div>
</template>
