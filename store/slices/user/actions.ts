import { createAction } from '@reduxjs/toolkit';

import { FavoriteItem, UserPreferences } from './types';
import { User } from '@/lib/types/astro-api';
import { Subscription } from './state';

export const actions = {
  setPreferences: createAction<Partial<UserPreferences>>('user/setPreferences'),
  updateUser: createAction<Partial<User>>('user/updateUser'),
  setShowSubscription: createAction<boolean>('user/setShowSubscription'),
  setTheme: createAction<UserPreferences['theme']>('user/setTheme'),
  setLanguage: createAction<UserPreferences['language']>('user/setLanguage'),
  setNotifications: createAction<boolean>('user/setNotifications'),
  setSoundEnabled: createAction<boolean>('user/setSoundEnabled'),
  setDailyReminder: createAction<boolean>('user/setDailyReminder'),
  setCardSpeed: createAction<number>('user/setCardSpeed'),
  setSubscription: createAction<Partial<Subscription>>('user/setSubscription'),
  addToFavorites: createAction<FavoriteItem>('user/addToFavorites'),
  removeFromFavorites: createAction<string>('user/removeFromFavorites'),
  clearFavorites: createAction<void>('user/clearFavorites'),
  setUserData: createAction<User>('user/setUserData'),
  clearUserData: createAction<void>('user/clearUserData'),
};

export default actions; 