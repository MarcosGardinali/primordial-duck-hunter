import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,

  }),

  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['user', 'token']
  },

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao fazer login'
        throw error
      } finally {
        this.loading = false
      }
    },



    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/register', userData)
        this.token = response.data.token
        this.user = response.data.user
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao registrar'
        throw error
      } finally {
        this.loading = false
      }
    },





    async requestPasswordReset(email) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/request-reset', { email })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao solicitar redefinição'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(email, code, newPassword) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/reset-password', { email, code, newPassword })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao redefinir senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth')
    },

    clearError() {
      this.error = null
    },



    initAuth() {
      // Token validation will happen automatically on first API call
      // Invalid tokens will be caught by interceptors
    }
  }
})