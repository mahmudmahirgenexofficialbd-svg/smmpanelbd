import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Add custom message for network errors
    if (!err.response) {
      err.message = 'Network error: Cannot reach the server. Please check your internet or API configuration.'
    } else if (err.response.data?.message) {
      err.message = err.response.data.message
    }
    
    return Promise.reject(err)
  }
)

export default api
