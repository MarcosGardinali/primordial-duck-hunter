import { defineStore } from 'pinia'
import api from '@/api/axios'

export const usePrimordialDuckStore = defineStore('primordialDucks', {
  state: () => ({
    ducks: [],
    pagination: null,
    stats: null,
    loading: false,
    error: null
  }),

  persist: {
    key: 'primordialDucks',
    storage: localStorage,
    paths: ['stats'], // Persistir apenas stats, não todos os patos
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  },

  actions: {
    async fetchDucks(page = 1, filters = {}) {
      this.loading = true
      this.error = null
      try {
        const params = { page, limit: 10, ...filters }
        const response = await api.get('/primordial-ducks', { params })
        this.ducks = response.data.data
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = 'Erro ao carregar patos primordiais'
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const response = await api.get('/primordial-ducks/stats/overview')
        this.stats = response.data
      } catch (error) {
      }
    },

    async fetchCompleteData() {
      this.loading = true
      try {
        // Carregar stats primeiro (mais rápido)
        const statsResponse = await api.get('/primordial-ducks/stats/overview')
        this.stats = statsResponse.data
        
        // Carregar patos em background com limite menor inicialmente
        const ducksResponse = await api.get('/primordial-ducks?limit=100')
        this.ducks = Array.isArray(ducksResponse.data) ? ducksResponse.data : ducksResponse.data.data || []
        
        return { 
          all_ducks: this.ducks, 
          stats: statsResponse.data,
          last_7_days: statsResponse.data.last_7_days || [],
          recent_ducks: statsResponse.data.recent_ducks || []
        }
      } catch (error) {
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchAllDucks() {
      // Método separado para carregar todos os patos quando necessário
      try {
        const response = await api.get('/primordial-ducks?limit=1000')
        this.ducks = Array.isArray(response.data) ? response.data : response.data.data || []
        return this.ducks
      } catch (error) {
        return []
      }
    },

    async createDuck(duckData) {
      try {
        const response = await api.post('/primordial-ducks', duckData)
        await this.fetchDucks() // Recarregar lista completa
        await this.fetchStats() // Atualizar estatísticas
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar pato primordial'
        throw error
      }
    },

    async updateDuck(id, duckData) {
      try {
        await api.put(`/primordial-ducks/${id}`, duckData)
        const index = this.ducks.findIndex(duck => duck.id === id)
        if (index !== -1) {
          this.ducks[index] = { ...this.ducks[index], ...duckData }
        }
        await this.fetchStats() // Atualizar estatísticas
      } catch (error) {
        this.error = 'Erro ao atualizar pato primordial'
        throw error
      }
    },

    async deleteDuck(id) {
      try {
        await api.delete(`/primordial-ducks/${id}`)
        this.ducks = this.ducks.filter(duck => duck.id !== id)
        await this.fetchStats() // Atualizar estatísticas
      } catch (error) {
        this.error = 'Erro ao deletar pato primordial'
        throw error
      }
    },

    async fetchCapturedDucks() {
      this.loading = true
      try {
        const response = await api.get('/drone-control/captured')
        return response.data
      } catch (error) {
        this.error = 'Erro ao carregar patos capturados'
        return []
      } finally {
        this.loading = false
      }
    },

    async liberateDuck(id) {
      try {
        await api.delete(`/primordial-ducks/${id}/liberate`)
        // Atualizar a lista local removendo o pato libertado
        this.ducks = this.ducks.filter(duck => duck.id !== id)
        await this.fetchStats()
        return true
      } catch (error) {
        this.error = 'Erro ao libertar pato'
        throw error
      }
    }
  }
})