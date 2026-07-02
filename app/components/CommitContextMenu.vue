<script setup lang="ts">
import type { CommitNode } from '~/stores/repo'

const props = defineProps<{
  commit: CommitNode
  x: number
  y: number
}>()
const emit = defineEmits<{ close: [] }>()

const repo = useRepoStore()
const menuRef = ref<HTMLElement | null>(null)

const style = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
}))

async function run(action: () => Promise<void>) {
  emit('close')
  try {
    await action()
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Git operation failed')
  }
}

function reset(mode: 'soft' | 'mixed' | 'hard') {
  const label = mode === 'hard' ? 'HARD reset' : `${mode} reset`
  if (mode === 'hard' && !confirm(`Hard reset to ${props.commit.abbrevHash}? This discards uncommitted changes.`)) return
  if (mode !== 'hard' && !confirm(`${label} to ${props.commit.abbrevHash}?`)) return
  run(() => repo.resetCommit(props.commit.hash, mode))
}

function cherryPick() {
  run(() => repo.cherryPickCommit(props.commit.hash))
}

function createBranch() {
  const name = prompt(`New branch name at ${props.commit.abbrevHash}:`)
  if (!name?.trim()) return
  run(() => repo.createBranchAtCommit(name.trim(), props.commit.hash, true))
}

function onDocClick(e: MouseEvent) {
  if (!menuRef.value?.contains(e.target as Node)) emit('close')
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div
    ref="menuRef"
    class="fixed z-50 min-w-44 rounded-lg border border-ink-700 bg-ink-850 py-1 shadow-2xl"
    :style="style"
    @click.stop
  >
    <div class="border-b border-ink-700 px-3 py-1.5 font-mono text-[10px] text-slate-500">
      {{ commit.abbrevHash }}
    </div>
    <button class="menu-item" @click="createBranch">Create branch here…</button>
    <button class="menu-item" @click="cherryPick">Cherry-pick</button>
    <div class="my-1 border-t border-ink-700" />
    <button class="menu-item" @click="reset('soft')">Reset — soft</button>
    <button class="menu-item" @click="reset('mixed')">Reset — mixed</button>
    <button class="menu-item text-red-400 hover:bg-red-500/10" @click="reset('hard')">Reset — hard</button>
  </div>
</template>

<style scoped>
.menu-item {
  @apply block w-full px-3 py-1.5 text-left text-sm text-slate-200 hover:bg-ink-700;
}
</style>
