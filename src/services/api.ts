import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.trznjak.com/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trznjak_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('trznjak_refresh')
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'https://api.trznjak.com/api'}/auth/token/refresh/`,
            { refresh }
          )
          localStorage.setItem('trznjak_access', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('trznjak_access')
          localStorage.removeItem('trznjak_refresh')
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
