import axios from 'axios'
import { addBearer } from '@/api/interceptors/addBearer'
import { invalidBearer } from '@/api/interceptors/invalidBearer'
import { unauthorizedRole } from '@/api/interceptors/unauthorizedRole'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8765/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptors
api.interceptors.request.use(addBearer)

// Response interceptors
api.interceptors.response.use(
  response => response,
  error => {
    invalidBearer(error)
    unauthorizedRole(error)
    return Promise.reject(error)
  }
)

export default api