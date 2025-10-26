import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useAuthStore } from '@/stores'
import api from '@/api/axios'

export function useTour() {
  const authStore = useAuthStore()

  const getStorageKey = () => {
    return `tours_completed_${authStore.user?.id || 'guest'}`
  }

  const getCompletedTours = () => {
    try {
      // Primeiro tenta localStorage
      const stored = localStorage.getItem(getStorageKey())
      if (stored) {
        return JSON.parse(stored)
      }
      // Se não tem no localStorage, pega do usuário
      if (authStore.user?.toursCompleted) {
        const tours = JSON.parse(authStore.user.toursCompleted)
        localStorage.setItem(getStorageKey(), JSON.stringify(tours))
        return tours
      }
      return []
    } catch {
      return []
    }
  }

  const createDriver = (steps, screenName) => {
    return driver({
      showProgress: true,
      steps,
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      closeBtnText: 'Fechar',
      progressText: '{{current}} de {{total}}',
      onDestroyed: () => {
        markTourCompleted(screenName)
      }
    })
  }

  const markTourCompleted = async (screenName) => {
    try {
      const completed = getCompletedTours()
      if (!completed.includes(screenName)) {
        completed.push(screenName)
        localStorage.setItem(getStorageKey(), JSON.stringify(completed))
        // Salvar no banco
        await api.patch('/users/tours', { tours: completed })
      }
    } catch (error) {
      // Falha silenciosa
    }
  }

  const shouldShowTour = (screenName) => {
    if (!authStore.user) return false
    
    // Verificação rápida no localStorage primeiro
    const storageKey = getStorageKey()
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const completed = JSON.parse(stored)
        return !completed.includes(screenName)
      } catch {
        return true
      }
    }
    
    // Fallback para authStore se não tem no localStorage
    if (authStore.user?.toursCompleted) {
      try {
        const completed = JSON.parse(authStore.user.toursCompleted)
        return !completed.includes(screenName)
      } catch {
        return true
      }
    }
    
    return true
  }

  return {
    createDriver,
    shouldShowTour,
    markTourCompleted
  }
}