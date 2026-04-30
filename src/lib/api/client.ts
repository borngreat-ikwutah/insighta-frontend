import axios from 'axios'
import { useAuthStore } from '#/store/auth-store'
import { toast } from 'sonner'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8787`
    : 'http://localhost:8787')

export const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'X-API-Version': '1',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to inject the Bearer token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add a response interceptor to handle token refresh and rate limiting
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState()

    if (error.response?.status === 429) {
      toast.error('Rate limit exceeded. Please try again later.')
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true
      try {
        const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        const { access_token, refresh_token } = response.data
        setTokens({ accessToken: access_token, refreshToken: refresh_token })
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        clearTokens()
        window.location.href = '/auth'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
