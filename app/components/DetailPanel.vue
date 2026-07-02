<script setup lang="ts">
import { WIP } from '~/stores/repo'
const repo = useRepoStore()
</script>

<template>
  <DiffViewer
    v-if="repo.diffView"
    :file="repo.diffView.file"
    :diff="repo.diffContent"
    :loading="repo.diffLoading"
    @back="repo.closeDiff()"
  />
  <StagingArea v-else-if="repo.selectedHash === WIP" />
  <CommitDetail v-else-if="repo.commitDetail" :detail="repo.commitDetail" />
  <div v-else class="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
    <span class="text-3xl">◈</span>
    <p class="text-sm">Select a commit to see its details,<br />or pick uncommitted changes to stage & commit.</p>
  </div>
</template>
