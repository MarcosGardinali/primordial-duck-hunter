import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useDroneStore = defineStore('drones', {
  state: () => ({
    drones: [],
    allDrones: [],
    pagination: null,
    loading: false,
    error: null
  }),

  persist: {
    key: 'drones',
    storage: localStorage,
    paths: ['drones']
  },

  actions: {
    async fetchDrones(page = 1, filters = {}) {
      this.loading = true
      this.error = null
      try {
        const params = { page, limit: 10, ...filters }
        const response = await api.get('/drones', { params })
        this.drones = response.data.data
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = 'Erro ao carregar drones'
      } finally {
        this.loading = false
      }
    },

    async fetchAllDrones() {
      try {
        const response = await api.get('/drones?all=true')
        this.allDrones = response.data
      } catch (error) {
        this.error = 'Erro ao carregar drones'
      }
    },

    async createDrone(droneData) {
      try {
        const response = await api.post('/drones', droneData)
        this.drones.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erro ao criar drone'
        throw error
      }
    },

    async updateDrone(id, droneData) {
      try {
        await api.put(`/drones/${id}`, droneData)
        const index = this.drones.findIndex(drone => drone.id === id)
        if (index !== -1) {
          this.drones[index] = { ...this.drones[index], ...droneData }
        }
      } catch (error) {
        this.error = 'Erro ao atualizar drone'
        throw error
      }
    },

    async deleteDrone(id) {
      try {
        await api.delete(`/drones/${id}`)
        this.drones = this.drones.filter(drone => drone.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar drone'
        throw error
      }
    }
  }
})