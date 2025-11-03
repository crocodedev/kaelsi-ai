import { FavoriteItem, UserPreferences } from './types';
import { Gender, Language } from '@/lib/types/astro-api';

export type Subscription = {
  id: number | null;
  plan: SubscriptionPlan | null;
  expires_at: string;
}

export type SubscriptionPlan = {
  id: number;
  price: number | null,
  name: string,
  description: string;
  benefits: string[];
  active: boolean;
}

export type BirthData = {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type InitialStateType = Readonly<{
  preferences: UserPreferences;
  birthData: BirthData;
  lastTarotId: number | null;
  favorites: FavoriteItem[];
  id: number,
  gender: Gender;
  subscription: Subscription | null;
  isFateMatrix: boolean;
  isNatalChart: boolean;
  isLoading: boolean;
  error: string;
  permissions: Permissions | null;
  isShowSubscriptionPurchase: boolean;
  applicationUsername: string | null;
}>;

export type Permissions = {
  cardDay: boolean,
  tarotList: boolean,
  tarotStore: boolean,
  tarotGetAnswer: boolean,
  tarotSpeaker: boolean,
  fateMatrixInfo: boolean,
  fateMatrixStore: boolean,
  natalChartInfo: boolean,
  natalChartStore: boolean
}

export type ServerPermissions = {
  'card_day.store': boolean,
  'fate_matrix.info': boolean,
  'fate_matrix.store': boolean,
  'natal_chart.info': boolean,
  'natal_chart.store': boolean,
  'tarot.get_answer': boolean,
  'tarot.list': boolean,
  'tarot.speaker': boolean,
  'tarot.store': boolean
}

export const mapServerPermissionsToLocal = (serverPermissions: ServerPermissions): Permissions => {
  return {
    cardDay: serverPermissions['card_day.store'] || false,
    tarotList: serverPermissions['tarot.list'] || false,
    tarotStore: serverPermissions['tarot.store'] || false,
    tarotGetAnswer: serverPermissions['tarot.get_answer'] || false,
    tarotSpeaker: serverPermissions['tarot.speaker'] || false,
    fateMatrixInfo: serverPermissions['fate_matrix.info'] || false,
    fateMatrixStore: serverPermissions['fate_matrix.store'] || false,
    natalChartInfo: serverPermissions['natal_chart.info'] || false,
    natalChartStore: serverPermissions['natal_chart.store'] || false
  }
}

export const initialState: InitialStateType = {
  preferences: {
    theme: 'mystical',
    language: 'en',
    notifications: true,
    dailyReminder: true,
    soundEnabled: true,
    cardSpeed: 300,
  },
  applicationUsername:null,
  id: 0,
  isLoading: false,
  error: '',
  lastTarotId: null,
  birthData: {
    date: '',
    time: '',
    place: '',
    latitude: 0,
    longitude: 0,
    timezone: '',
  },
  favorites: [],
  gender: 'other',
  subscription: null,
  isShowSubscriptionPurchase: false,
  permissions: {
    cardDay: false,
    tarotList: false,
    tarotStore: false,
    tarotGetAnswer: false,
    tarotSpeaker: false,
    fateMatrixInfo: false,
    fateMatrixStore: false,
    natalChartInfo: false,
    natalChartStore: false
  },
  isFateMatrix: false,
  isNatalChart: false
}; 