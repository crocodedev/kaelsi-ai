import { createAction } from '@reduxjs/toolkit';

import { FavoriteItem, UserPreferences } from './types';

export const actions = {
  setPreferences: createAction<Partial<UserPreferences>>('user/setPreferences'),
  setShowSubscription: createAction<boolean>('user/setShowSubscription'),
  setTheme: createAction<UserPreferences['theme']>('user/setTheme'),
  setLanguage: createAction<UserPreferences['language']>('user/setLanguage'),
  setNotifications: createAction<boolean>('user/setNotifications'),
  addToFavorites: createAction<FavoriteItem>('user/addToFavorites'),
  removeFromFavorites: createAction<string>('user/removeFromFavorites'),
  clearFavorites: createAction<void>('user/clearFavorites'),
};

export default actions; 