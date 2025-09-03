import { createAction } from '@reduxjs/toolkit';

import { FavoriteItem, UserPreferences } from './types';
import { Language, User } from '@/lib/types/astro-api';
import { Subscription, Permissions, ServerPermissions } from './state';

interface BirthDataUpdate {
  berth_date?: string;
  berth_time?: string;
  berth_place?: string;
  berth_latitude?: number;
  berth_longitude?: number;
  berth_timezone?: string;
}

export const actions = {
  setPreferences: createAction<Partial<UserPreferences>>('user/setPreferences'),
  updateUser: createAction<BirthDataUpdate>('user/updateUser'),
  setShowSubscription: createAction<boolean>('user/setShowSubscription'),
  setTheme: createAction<UserPreferences['theme']>('user/setTheme'),
  setLanguage: createAction<Language>('user/setLanguage'),
  setNotifications: createAction<boolean>('user/setNotifications'),
  setSoundEnabled: createAction<boolean>('user/setSoundEnabled'),
  setDailyReminder: createAction<boolean>('user/setDailyReminder'),
  setCardSpeed: createAction<number>('user/setCardSpeed'),
  setSubscription: createAction<Partial<Subscription>>('user/setSubscription'),
  cancelSubscription: createAction<number>('user/cancelSubscription'),
  addToFavorites: createAction<FavoriteItem>('user/addToFavorites'),
  removeFromFavorites: createAction<string>('user/removeFromFavorites'),
  clearFavorites: createAction<void>('user/clearFavorites'),
  setUserData: createAction<User>('user/setUserData'),
  setIsFateMatrix: createAction<boolean>('user/setIsFateMatrix'),
  setIsNatalChart: createAction<boolean>('user/setIsNatalChart'),
  clearUserData: createAction<void>('user/clearUserData'),
  setPermissions: createAction<Permissions>('user/setPermissions'),
  setServerPermissions: createAction<ServerPermissions>('user/setServerPermissions'),
  setBirthPlace: createAction<string>('user/setBirthPlace'),
};

export default actions; 