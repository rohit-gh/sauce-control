<script setup lang="ts">
import type { CommitDetail } from '~/stores/repo'

const props = defineProps<{ detail: CommitDetail }>()
const repo = useRepoStore()

function fullDate(ts: number) {
  return new Date(ts).toLocaleString()
}

function viewDiff(file: string) {
  repo.loadDiff(file, { hash: props.detail.hash })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="border-b border-ink-800 px-4 py-3">
      <h2 class="text-sm font-semibold text-white">Commit</h2>
      <span class="font-mono text-[11px] text-slate-500">{{ detail.hash }}</span>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <p class="whitespace-pre-wrap text-sm font-medium text-slate-100">{{ detail.subject }}</p>
      <p v-if="detail.body" class="mt-2 whitespace-pre-wrap text-sm text-slate-400">{{ detail.body }}</p>

      <div class="mt-4 space-y-1.5 border-t border-ink-800 pt-4 text-xs text-slate-400">
        <div class="flex gap-2">
          <span class="w-16 shrink-0 text-slate-500">Author</span>
          <span>{{ detail.author }} &lt;{{ detail.authorEmail }}&gt;</span>
        </div>
        <div class="flex gap-2">
          <span class="w-16 shrink-0 text-slate-500">Date</span>
          <span>{{ fullDate(detail.timestamp) }}</span>
        </div>
        <div class="flex gap-2">
          <span class="w-16 shrink-0 text-slate-500">Parents</span>
          <span class="font-mono">{{ detail.parents.map((p) => p.slice(0, 7)).join(', ') || '—' }}</span>
        </div>
      </div>

      <div class="mt-4 border-t border-ink-800 pt-4">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {{ detail.stat.filesChanged }} changed
          </span>
          <span class="text-[11px]">
            <span class="text-green-400">+{{ detail.stat.additions }}</span>
            <span class="ml-2 text-red-400">−{{ detail.stat.deletions }}</span>
          </span>
        </div>
        <ul class="space-y-0.5">
          <li
            v-for="f in detail.files"
            :key="f.path"
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-ink-800"
            @click="viewDiff(f.path)"
          >
            <span class="truncate text-slate-300">{{ f.path }}</span>
            <span class="ml-auto shrink-0 text-[11px]">
              <span class="text-green-400">+{{ f.additions }}</span>
              <span class="ml-1 text-red-400">−{{ f.deletions }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
