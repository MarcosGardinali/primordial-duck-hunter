export const addBearer = (config) => {
  const authData = localStorage.getItem('auth')
  const token = authData ? JSON.parse(authData).token : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}