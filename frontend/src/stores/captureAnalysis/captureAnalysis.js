import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useCaptureAnalysisStore = defineStore('captureAnalysis', {
  state: () => ({
    analysis: null,
    analyses: [],
    ranking: [],
    statistics: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchOverview() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/capture-analysis/overview')
        this.analyses = response.data.analyses || []
        this.statistics = response.data.statistics || null
      } catch (error) {
        this.error = 'Erro ao carregar análise de captura'
      } finally {
        this.loading = false
      }
    },

    async fetchRanking() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/capture-analysis/ranking')
        this.ranking = response.data
      } catch (error) {
        this.error = 'Erro ao carregar ranking de captura'
      } finally {
        this.loading = false
      }
    },

    async analyzeDuck(duckId) {
      try {
        const response = await api.get(`/capture-analysis/duck/${duckId}`)
        return response.data
      } catch (error) {
        this.error = 'Erro ao analisar pato específico'
        throw error
      }
    }
  }
})