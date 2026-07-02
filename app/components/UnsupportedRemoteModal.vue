<script setup lang="ts">
const ui = useUiStore()

function close() {
  ui.unsupportedRemote = null
}
</script>

<template>
  <div
    v-if="ui.unsupportedRemote"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="close"
  >
    <div class="w-full max-w-md rounded-xl border border-ink-700 bg-ink-900 shadow-2xl">
      <div class="flex items-start gap-3 border-b border-ink-800 px-5 py-4">
        <span class="mt-0.5 text-xl text-amber-400">⚠</span>
        <div>
          <h2 class="text-base font-semibold text-white">GitHub remotes only</h2>
          <p class="text-[11px] text-slate-500">This action was stopped before anything was pushed.</p>
        </div>
      </div>

      <div class="px-5 py-4 text-sm text-slate-300">
        <p>
          SauceControl only provides GitHub support. For other remotes, please use another Git client
          or the command line.
        </p>
        <div class="mt-3 rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-[11px]">
          <div class="text-slate-500">Remote <span class="font-mono text-slate-300">{{ ui.unsupportedRemote.remote }}</span></div>
          <div class="mt-0.5 break-all font-mono text-slate-400">{{ ui.unsupportedRemote.url }}</div>
        </div>
      </div>

      <div class="flex justify-end border-t border-ink-800 px-5 py-3">
        <button class="btn-primary" @click="close">Got it</button>
      </div>
    </div>
  </div>
</template>
