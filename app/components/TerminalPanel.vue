<script setup lang="ts">
const repo = useRepoStore()
const ui = useUiStore()
</script>

<template>
  <div class="flex h-72 shrink-0 flex-col border-t border-ink-800 bg-ink-950">
    <div class="flex items-center justify-between border-b border-ink-800 bg-ink-900 px-3 py-1.5">
      <div class="flex items-center gap-2 text-xs">
        <span class="font-mono text-accent">›_</span>
        <span class="text-slate-300">Terminal</span>
        <span class="truncate font-mono text-[11px] text-slate-600">{{ repo.path }}</span>
      </div>
      <button class="text-slate-500 hover:text-white" title="Close" @click="ui.terminalOpen = false">
        ✕
      </button>
    </div>
    <div class="min-h-0 flex-1 p-1">
      <XTerm :key="repo.path" :cwd="repo.path" />
    </div>
  </div>
</template>
