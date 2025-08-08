import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { accessToken } = response.data
          setAuthToken(accessToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        removeAuthToken()
        localStorage.removeItem('refreshToken')
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api 