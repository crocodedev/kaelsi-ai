import { FavoriteItem, UserPreferences } from './types';
import { User } from '@/lib/types/astro-api';

export type Subscription = {
  isShowSubscription: boolean;
  id: number | null;
}

export type BirthData = {
  date: string;
  time: string;
  place: string;
}

export type InitialStateType = Readonly<{
  preferences: UserPreferences;
  birthData: BirthData;
  favorites: FavoriteItem[];
  subscription: Subscription;
  userData: User | null;
}>;

export const initialState: InitialStateType = {
  preferences: {
    theme: 'mystical',
    language: 'en',
    notifications: true,
    dailyReminder: true,
    soundEnabled: true,
    cardSpeed: 300, // Средняя скорость по умолчанию
  },
  birthData: {
    date: '',
    time: '',
    place: '',
  },
  favorites: [],
  subscription: {
    isShowSubscription: false,
    id: null
  },
  userData: null,
}; 