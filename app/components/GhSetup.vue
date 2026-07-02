<script setup lang="ts">
interface GhStatus {
  installed: boolean
  authenticated: boolean
  user: string | null
  version: string | null
}

const ui = useUiStore()

const status = ref<GhStatus | null>(null)
const checking = ref(false)
const showTerminal = ref(false)

async function check() {
  checking.value = true
  try {
    status.value = await $fetch<GhStatus>('/api/gh/status')
    if (!status.value.installed || !status.value.authenticated) showTerminal.value = true
  } finally {
    checking.value = false
  }
}

onMounted(check)

const installCmd =
  'type -p curl >/dev/null || sudo apt install curl -y; curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && sudo apt update && sudo apt install gh -y'

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {}
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" @click.self="ui.ghSetupOpen = false">
    <div class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl">
      <div class="flex items-center justify-between border-b border-ink-800 px-5 py-4">
        <div class="flex items-center gap-2">
          <span class="text-lg"></span>
          <h2 class="text-base font-semibold text-white">GitHub Setup</h2>
        </div>
        <button class="text-slate-500 hover:text-white" title="Close" @click="ui.ghSetupOpen = false">✕</button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <!-- Status cards -->
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg border border-ink-700 bg-ink-850 p-3">
            <div class="text-[11px] uppercase tracking-wider text-slate-500">GitHub CLI</div>
            <div class="mt-1 flex items-center gap-2 text-sm">
              <span
                class="h-2 w-2 rounded-full"
                :class="status?.installed ? 'bg-green-400' : 'bg-red-400'"
              />
              <span class="text-slate-200">
                {{ status?.installed ? `Installed (${status.version})` : 'Not installed' }}
              </span>
            </div>
          </div>
          <div class="rounded-lg border border-ink-700 bg-ink-850 p-3">
            <div class="text-[11px] uppercase tracking-wider text-slate-500">Authentication</div>
            <div class="mt-1 flex items-center gap-2 text-sm">
              <span
                class="h-2 w-2 rounded-full"
                :class="status?.authenticated ? 'bg-green-400' : 'bg-amber-400'"
              />
              <span class="text-slate-200">
                {{ status?.authenticated ? `Signed in as @${status.user}` : 'Not authenticated' }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="status?.installed && status?.authenticated"
          class="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300"
        >
          You're all set — SauceControl can talk to GitHub as <b>@{{ status.user }}</b>.
        </div>

        <!-- Steps -->
        <div v-else class="mt-4 space-y-3 text-sm">
          <div v-if="!status?.installed">
            <p class="mb-1 font-medium text-slate-200">1. Install the GitHub CLI</p>
            <p class="mb-1 text-slate-400">
              Run this in the terminal below. You'll be prompted for your <code>sudo</code> password.
            </p>
            <div class="flex items-start gap-2 rounded-md bg-ink-950 p-2 font-mono text-[11px] text-slate-400">
              <code class="min-w-0 flex-1 whitespace-pre-wrap break-all">{{ installCmd }}</code>
              <button class="btn-subtle shrink-0 !py-0.5 !text-[11px]" @click="copy(installCmd)">Copy</button>
            </div>
          </div>
          <div>
            <p class="mb-1 font-medium text-slate-200">
              {{ status?.installed ? '1.' : '2.' }} Authenticate
            </p>
            <p class="mb-1 text-slate-400">Link your GitHub account. Follow the interactive prompts.</p>
            <div class="flex items-center gap-2 rounded-md bg-ink-950 p-2 font-mono text-[11px] text-slate-400">
              <code class="flex-1">gh auth login</code>
              <button class="btn-subtle !py-0.5 !text-[11px]" @click="copy('gh auth login')">Copy</button>
            </div>
          </div>
        </div>

        <!-- Embedded terminal -->
        <div v-if="showTerminal" class="mt-4">
          <div class="mb-1 flex items-center justify-between">
            <span class="text-[11px] uppercase tracking-wider text-slate-500">Setup terminal</span>
          </div>
          <div class="h-64 overflow-hidden rounded-lg border border-ink-700 bg-ink-950 p-1">
            <XTerm />
          </div>
        </div>
        <button v-else class="btn-subtle mt-4" @click="showTerminal = true">Open setup terminal</button>
      </div>

      <div class="flex items-center justify-between border-t border-ink-800 px-5 py-3">
        <span class="text-[11px] text-slate-500">Your token is cached locally after sign-in.</span>
        <div class="flex gap-2">
          <button class="btn-subtle" :disabled="checking" @click="check">
            {{ checking ? 'Checking…' : 'Re-check status' }}
          </button>
          <button class="btn-primary" @click="ui.ghSetupOpen = false">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>
