import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useSuperpowerStore = defineStore('superpowers', {
  state: () => ({
    superpowers: [],
    allSuperpowers: [],
    pagination: null,
    loading: false,
    error: null
  }),

  persist: {
    key: 'superpowers',
    storage: localStorage,
    paths: ['superpowers']
  },

  actions: {
    async fetchSuperpowers(page = 1, filters = {}) {
      this.loading = true
      this.error = null
      try {
        const params = { page, limit: 10, ...filters }
        const response = await api.get('/superpowers', { params })
        this.superpowers = response.data.data
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = 'Erro ao carregar superpoderes'
      } finally {
        this.loading = false
      }
    },

    async fetchAllSuperpowers() {
      try {
        const response = await api.get('/superpowers?all=true')
        this.allSuperpowers = response.data
      } catch (error) {
        this.error = 'Erro ao carregar superpoderes'
      }
    },

    async createSuperpower(superpowerData) {
      try {
        const response = await api.post('/superpowers', superpowerData)
        await this.fetchSuperpowers()
        return response.data
      } catch (error) {
        this.error = 'Erro ao criar superpoder'
        throw error
      }
    },

    async updateSuperpower(id, superpowerData) {
      try {
        await api.put(`/superpowers/${id}`, superpowerData)
        await this.fetchSuperpowers()
      } catch (error) {
        this.error = 'Erro ao atualizar superpoder'
        throw error
      }
    },

    async deleteSuperpower(id) {
      try {
        await api.delete(`/superpowers/${id}`)
        await this.fetchSuperpowers()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar superpoder'
        throw error
      }
    }
  }
})