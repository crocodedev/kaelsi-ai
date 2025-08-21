export interface Language {
  code: string
  name: string
}

export interface Plan {
  id: string
  name: string
  description: string
}

export interface TarotSpeaker {
  id: string
  name: string
  icon: string
}

export interface User {
  id: number
  name: string
  email: string
  berth_date: string
  berth_time: string
  berth_timezone: string
  berth_place: string
  berth_latitude: string
  berth_longitude: string
  is_card_day: string
  subscription_id: string
  last_tarot_id: string
}

export interface AuthResponse {
  token_type: string
  access_token: string
  user: User
}

export interface RegistrationData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UpdateUserData {
  name?: string
  berth_date?: string
  berth_time?: string
  berth_timezone?: string
  berth_place?: string
  berth_latitude?: number
  berth_longitude?: number
}

export interface NatalChart {
  id: number
  user_id: number
  data: any[]
  created_at: string
  updated_at: string
}

export interface NatalChartData {
  berth_date: string
  berth_time: string
  berth_timezone: string
  berth_latitude: number
  berth_longitude: number
}

export interface FateMatrix {
  id: number
  user_id: number
  data: any[]
  created_at: string
  updated_at: string
}

export interface FateMatrixData {
  berth_date: string
}

export interface CardDay {
  id: number,
  name: string,
  description: string,
  img_front: string
}

export interface SubscriptionResponse {
  data: {
    subscription_id: string
  }
}

export interface TarotCategory {
  id: string
  name: string
}

export interface TarotCard {
  id:string;
  name: string
  image: string
}

export interface TarotReading {
  id: string
  tarot: TarotCard
  question: string
  cards: string
  back_card: string
  chat_id: string
  reading: string
}

export interface TarotReadingRequest {
  tarot_id: number
  question: string
}

export interface ChatMessage {
  id: string
  sender: 'tarot' | 'user'
  message_type: string
  message: string
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  links: Array<{
    url: string
    label: string
    active: boolean
  }>
  path: string
  per_page: number
  to: number
  total: number
}

export interface PaginationLinks {
  first: string
  last: string
  prev: string
  next: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}


export interface TarotRequest {
  request: {
    question: string;
    speaker_id: string;
    tarot_id: string;
  }
  response: {
    id: number;
    tarot: {
      id: number;
      name: string;
      description: string;
      matrix: Record<string, [number, number]>;
    };
    question: string;
    cards: Record<string, TarotCard>;
    back_card: string;
    chat_id: number;
    reading: string | null;
  }
}