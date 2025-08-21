import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://astro.mlokli.com/api' 

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

const getLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'ru'
  }
  return 'en'
}

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

const setLanguage = (language: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language)
  }
}

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

const removeLanguage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('language')
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || 'https://astro.mlokli.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
    const language = getLanguage();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.headers) {
      config.headers.AcceptLanguage = language
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