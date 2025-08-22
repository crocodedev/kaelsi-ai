import { FavoriteItem, UserPreferences } from './types';

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
}

export type InitialStateType = Readonly<{
  preferences: UserPreferences;
  birthData: BirthData;
  favorites: FavoriteItem[];
  subscription: Subscription | null;
  isShowSubscriptionPurchase:boolean;
}>;

export const initialState: InitialStateType = {
  preferences: {
    theme: 'mystical',
    language: 'en',
    notifications: true,
    dailyReminder: true,
    soundEnabled: true,
    cardSpeed: 300, 
  },
  birthData: {
    date: '',
    time: '',
    place: '',
  },
  favorites: [],
  subscription: null,
  isShowSubscriptionPurchase:false,
}; 