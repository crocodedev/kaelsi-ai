import { SenderType } from "@/store/selectors/sendWebsocketMessage";
import { ServerPermissions, Subscription } from "@/store/slices/user/state"

export interface Language {
  code: string
  name: string
}

export type TarotResponse = {
  id: number;
  tarot: TarotResponse;
  question: string;
  back_card: string;
  chat_id: number,
  reading: null
}

export interface EventData {
  type: string
  name: string[]
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

export type Gender = 'male' | 'female' | 'other'

export interface User {
  id: number
  name: string
  email: string
  berth_date: string
  berth_time: string
  gender: Gender
  berth_timezone: string
  berth_place: string
  berth_latitude: string
  berth_longitude: string
  is_card_day: string
  is_fate_matrix: boolean;
  is_natal_chart: boolean;
  permissions: ServerPermissions
  subscription: Subscription
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
  gender: Gender;
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

export type MoonPhase = 'Second Quarter' | 'Waxing Gibbous' | 'First Quarter' | 'Waxing Crescent' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent'
export type HouseName = 'House1' | 'House2' | 'House3' | 'House4' | 'House5' | 'House6' | 'House7' | 'House8' | 'House9' | 'House10' | 'House11' | 'House12'


export type Planet = {
  id: string;
  sign: string;
  lon: number;
  lat: number;
  house: HouseName
}

export type Aspect = {
  object1: string;
  object2: string;
  type: number;
  orb: number;
}

export type House = {
  house: HouseName;
  start_lon: number;
  sign: string;
}

export type Angel = {
  sign: string;
  lon: number;
}


export type ReadingTypeCharts = {
  category: string;
  text: string;
}

export type AnswerChat = {
  id: number;
  sender: SenderType;
  message: {
    en: ReadingTypeCharts[],
    ru: ReadingTypeCharts[],
    uk: ReadingTypeCharts[]
  }
}

export type TarotAnswerChat = {
  message: {
    status: string;
    final_question: SenderType;
    suggetion:string;
    interpretation: {
      intro: string,
      analysis: string,
      final: string
    }
  }
}

export interface NatalChart {
  language: string;
  image: string;
  isDiurnal: boolean;
  reading: ReadingTypeCharts[],
  date: string;
  moonPhase: MoonPhase;
  planets: Planet[]
  aspects: Aspect[]
  houses: House[]
  angles: {
    Asc: Angel;
    Desc: Angel;
    MC: Angel;
    IC: Angel;
    Sun: Angel;
    Moon: Angel;
    Mercury: Angel;
    Venus: Angel;
    Mars: Angel;
    Jupiter: Angel;
    Saturn: Angel;
    Uranus: Angel;
    Neptune: Angel;
    Pluto: Angel;
    Node: Angel;
    Chiron: Angel;
  }
}

export interface NatalChartData {
  berth_date: string
  berth_time: string
  berth_timezone: string
  berth_latitude: number
  berth_longitude: number
}

export interface FateMatrix {
  id: number;
  user_id: number;
  language: string;
  svg: string;
  image:string;
  data: any[]
  reading: ReadingTypeCharts[]
  created_at: string
  updated_at: string
}

export interface FateMatrixData {
  berth_date: string
  berth_time?: string
  berth_timezone?: string
  berth_latitude?: number
  berth_longitude?: number

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
  id: string;
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
    category_id: string;
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
    reading: ReadingType;
  }
}

type ReadingType = {
  cards?: ReadingCardType[];
  final_question: string;
  interpretation: InterpretationType | null;
  suggestion?: string;
  status: string;
}

export type TarotReadingStatus = 'redirect' | 'reject' | 'ok'

type InterpretationType = {
  analysis: string;
  final: string;
  intro: string;
}

type ReadingCardType = {
  position: number;
  label: string;
  description: string;
}