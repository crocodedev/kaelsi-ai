import { FavoriteItem, UserPreferences } from './types';

export type InitialStateType = Readonly<{
  preferences: UserPreferences;
  favorites: FavoriteItem[];
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
}; 