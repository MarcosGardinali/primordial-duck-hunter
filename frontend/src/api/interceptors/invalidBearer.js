import { useAuthStore } from '@/stores/auth/auth'
import router from '@/router'

export const invalidBearer = (error) => {
  if (error.response?.status === 401) {
    const authStore = useAuthStore()
    authStore.logout()
    localStorage.removeItem('auth')
    router.push('/login')
  }
}