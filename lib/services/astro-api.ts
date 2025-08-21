import { AxiosRequestConfig } from 'axios'
import api from '../api'
import {
  Language,
  Plan,
  AuthResponse,
  RegistrationData,
  LoginData,
  User,
  UpdateUserData,
  NatalChart,
  NatalChartData,
  FateMatrix,
  FateMatrixData,
  CardDay,
  SubscriptionResponse,
  TarotCategory,
  TarotCard,
  TarotReading,
  TarotReadingRequest,
  ChatMessage,
  PaginatedResponse,
  ApiResponse,
  TarotRequest,
  TarotSpeaker
} from '../types/astro-api'

const ASTRO_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://astro.mlokli.com/api'

export const astroApiService = {
  getLanguages: async (): Promise<ApiResponse<Language[]>> => {
    const response = await api.get('/language')
    return response.data
  },

  getTarotSpeaker: async (): Promise<ApiResponse<TarotSpeaker[]>> => {
    const response = await api.get('/tarot/speaker')
    return response.data
  },

  getTarotResponse: async ({ question, tarot_id, speaker_id }: TarotRequest['request']): Promise<ApiResponse<TarotRequest['response']>> => {
    const response = await api.post('/tarot', { tarot_id, question, speaker_id })
    return response.data
  },

  getPlans: async (): Promise<ApiResponse<Plan[]>> => {
    const response = await api.get('/plan')
    return response.data
  },

  register: async (data: RegistrationData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/user/registration', data)
    return response.data
  },

  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/user/login', data)
    return response.data
  },

  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/user')
    return response.data
  },

  updateUser: async (data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await api.patch('/user', data)
    return response.data
  },

  deleteUser: async (): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    const response = await api.delete('/user')
    return response.data
  },

  getNatalChart: async (): Promise<ApiResponse<NatalChart>> => {
    const response = await api.get('/natal-chart')
    return response.data
  },

  createNatalChart: async (data: NatalChartData): Promise<ApiResponse<NatalChart>> => {
    const response = await api.post('/natal-chart', data)
    return response.data
  },

  getFateMatrix: async (): Promise<ApiResponse<FateMatrix>> => {
    const response = await api.get('/fate-matrix')
    return response.data
  },

  createFateMatrix: async (data: FateMatrixData): Promise<ApiResponse<FateMatrix>> => {
    const response = await api.post('/fate-matrix', data)
    return response.data
  },

  getCardDay: async (): Promise<ApiResponse<CardDay>> => {
    const response = await api.get('/card-day')
    return response.data
  },

  subscribe: async (plan: string): Promise<ApiResponse<SubscriptionResponse>> => {
    const response = await api.post(`/subscribe/${plan}`)
    return response.data
  },

  unsubscribe: async (subscription: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/subscribe/${subscription}`)
    return response.data
  },

  getTarotCategories: async (config?: AxiosRequestConfig): Promise<PaginatedResponse<TarotCategory>> => {
    const response = await api.get('/tarot/category', config)
    return response.data
  },

  getTarotCards: async (config?: AxiosRequestConfig): Promise<PaginatedResponse<TarotCard>> => {
    const response = await api.get('/tarot', config)
    return response.data
  },

  createTarotReading: async (data: TarotReadingRequest): Promise<ApiResponse<TarotReading>> => {
    const response = await api.post('/tarot', data)
    return response.data
  },

  getTarotReadings: async (): Promise<PaginatedResponse<TarotReading>> => {
    const response = await api.get('/tarot/reading')
    return response.data
  },

  getTarotReading: async (tarotUser: string): Promise<ApiResponse<TarotReading>> => {
    const response = await api.get(`/tarot/reading/${tarotUser}`)
    return response.data
  },

  getChatMessages: async (chat: string): Promise<PaginatedResponse<ChatMessage>> => {
    const response = await api.get(`/chat/${chat}/message`)
    return response.data
  },

  getUnreadMessages: async (chat: string): Promise<PaginatedResponse<ChatMessage>> => {
    const response = await api.get(`/chat/${chat}/message/unread`)
    return response.data
  },

  getChatMessage: async (chat: string, chatMessage: string): Promise<ApiResponse<ChatMessage>> => {
    const response = await api.get(`/chat/${chat}/message/${chatMessage}`)
    return response.data
  }
} 