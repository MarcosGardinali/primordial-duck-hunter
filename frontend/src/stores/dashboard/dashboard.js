import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/primordial-ducks/stats/overview')
        this.stats = response.data
      } catch (error) {
        this.error = 'Erro ao carregar estatísticas'
      } finally {
        this.loading = false
      }
    }
  }
})