import { defineStore } from 'pinia'

export interface Project {
  id: string
  name: string
  path: string
  added_at: number
  last_opened: number | null
  branch?: string | null
  exists?: boolean
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    selectedId: null as string | null,
    loading: false,
    error: '' as string,
  }),
  getters: {
    selected(state): Project | null {
      return state.projects.find((p) => p.id === state.selectedId) ?? null
    },
  },
  actions: {
    async fetch() {
      this.loading = true
      try {
        this.projects = await $fetch<Project[]>('/api/projects')
        if (!this.selectedId && this.projects.length) {
          this.selectedId = this.projects[0].id
        }
      } finally {
        this.loading = false
      }
    },
    async add(path: string) {
      this.error = ''
      try {
        const project = await $fetch<Project>('/api/projects', {
          method: 'POST',
          body: { path },
        })
        await this.fetch()
        this.selectedId = project.id
        return project
      } catch (err: any) {
        this.error = err?.data?.statusMessage || err?.message || 'Failed to add project'
        throw err
      }
    },
    async cloneFromGithub(nameWithOwner: string, parentDir: string) {
      this.error = ''
      const project = await $fetch<Project>('/api/gh/clone', {
        method: 'POST',
        body: { nameWithOwner, parentDir },
      })
      await this.fetch()
      this.selectedId = project.id
      return project
    },
    async remove(id: string) {
      await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (this.selectedId === id) this.selectedId = null
      await this.fetch()
    },
    select(id: string) {
      this.selectedId = id
    },
  },
})
