import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useDroneControlStore = defineStore('droneControl', {
  state: () => ({
    droneStatus: null,
    missionResults: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchDroneStatus() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/drone-control/status')
        this.droneStatus = response.data
      } catch (error) {
        this.error = 'Erro ao carregar status do drone'
      } finally {
        this.loading = false
      }
    },

    async analyzeTarget(duckId) {
      try {
        const response = await api.get(`/drone-control/analyze/${duckId}`)
        return response.data
      } catch (error) {
        this.error = 'Erro ao analisar alvo'
        throw error
      }
    },

    async executeMission(duckId, strategy) {
      try {
        const response = await api.post(`/drone-control/mission/${duckId}`, { strategy_index: strategy })
        this.missionResults.push(response.data)
        
        // Atualizar status do drone com os dados retornados
        if (response.data.drone_status) {
          this.droneStatus = {
            ...this.droneStatus,
            ...response.data.drone_status
          }
        }
        
        // Buscar status atualizado do servidor para garantir sincronização
        await this.fetchDroneStatus()
        
        return response.data
      } catch (error) {
        this.error = 'Erro ao executar missão'
        throw error
      }
    },

    async rechargeDrone() {
      try {
        const response = await api.post('/drone-control/recharge')
        
        // Atualizar status com os dados retornados
        if (response.data.status) {
          this.droneStatus = {
            ...this.droneStatus,
            ...response.data.status
          }
        } else if (response.data) {
          this.droneStatus = {
            ...this.droneStatus,
            ...response.data
          }
        }
        
        // Buscar status atualizado do servidor para garantir sincronização
        await this.fetchDroneStatus()
        
        return response.data
      } catch (error) {
        this.error = 'Erro ao recarregar drone'
        throw error
      }
    }
  }
})