import api from './api'

export interface User {
  id: string
  name: string
  email: string
  birthDate?: string
  birthTime?: string
  birthLocation?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (userData: {
    name: string
    email: string
    password: string
    birthDate?: string
    birthTime?: string
    birthLocation?: string
  }): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  }
}

export const tarotService = {
  getCards: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/tarot/cards')
    return response.data
  },

  getReading: async (spreadType: string, question?: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/tarot/reading', { spreadType, question })
    return response.data
  },

  saveReading: async (readingData: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/tarot/readings', readingData)
    return response.data
  },

  getReadingHistory: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/tarot/readings')
    return response.data
  }
}

export const natalChartService = {
  generateChart: async (birthData: {
    date: string
    time: string
    location: string
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/natal-chart/generate', birthData)
    return response.data
  },

  getChart: async (chartId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/natal-chart/${chartId}`)
    return response.data
  }
}

export const destinyMatrixService = {
  calculateMatrix: async (birthData: {
    date: string
    time: string
    location: string
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/destiny-matrix/calculate', birthData)
    return response.data
  }
} 