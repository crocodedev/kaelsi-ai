import { FavoriteItem, UserPreferences } from './types';

export type Subscription = {
  isShowSubscription: boolean;
}

export type InitialStateType = Readonly<{
  preferences: UserPreferences;
  favorites: FavoriteItem[];
  subscription: Subscription;
}>;

export const initialState: InitialStateType = {
  preferences: {
    theme: 'mystical',
    language: 'en',
    notifications: true,
    dailyReminder: true,
    soundEnabled: true,
  },
  favorites: [],
  subscription: {
    isShowSubscription: false,
  }
}; 