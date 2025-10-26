import { useAuthStore } from '@/stores/auth/auth'
import router from '@/router'

export const unauthorizedRole = (error) => {
  if (error.response?.status === 403) {
    const authStore = useAuthStore()
    authStore.logout()
    localStorage.removeItem('auth')
    router.push('/login')
  }
}