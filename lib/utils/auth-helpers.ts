import { RegistrationData, LoginData } from '@/lib/types/astro-api'

export interface BirthData {
  birthDay: string
  birthMonth: string
  birthYear: string
  birthHour: string
  birthMinute: string
  birthCity: string
  birthCountry: string
}

export const formatBirthData = (birthData: BirthData) => {
  return {
    berth_date: `${birthData.birthYear}-${birthData.birthMonth}-${birthData.birthDay}`,
    berth_time: `${birthData.birthHour}:${birthData.birthMinute}`,
    berth_place: `${birthData.birthCity}, ${birthData.birthCountry}`
  }
}

export const createRegistrationData = (
  authForm: { name: string; email: string; password: string; password_confirmation: string },
): RegistrationData => {
  
  return {
    name: authForm.name,
    gender: 'male',
    email: authForm.email,
    password: authForm.password,
    password_confirmation: authForm.password_confirmation,
  }
}

export const createLoginData = (
  authForm: { email: string; password: string }
): LoginData => {
  return {
    email: authForm.email,
    password: authForm.password
  }
}

export const logAuthAttempt = (type: 'login' | 'register', data: any) => {
  console.log(`Attempting ${type} with:`, data)
}

export const logAuthResult = (type: 'login' | 'register', result: any) => {
  console.log(`${type} result:`, result)
}

export const logAuthError = (type: 'login' | 'register', error: any) => {
  console.error(`${type} error:`, error)
} 