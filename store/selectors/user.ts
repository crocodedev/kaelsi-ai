import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../index';
import { FavoriteItem } from '../slices/user/types';

const selectUserState = (state: AppState) => state.user;

export const selectUserPreferences = createSelector(
  [selectUserState],
  (user) => user.preferences
);

export const selectTheme = createSelector(
  [selectUserPreferences],
  (preferences) => preferences.theme
);

export const selectLanguage = createSelector(
  [selectUserPreferences],
  (preferences) => preferences.language
);

export const selectNotifications = createSelector(
  [selectUserPreferences],
  (preferences) => preferences.notifications
);

export const selectBirthData = createSelector(
  [selectUserState],
  (user) => user.birthData
);

export const selectUserData = createSelector(
  [selectUserState],
  (user) => user.userData
);

export const selectFavorites = createSelector(
  [selectUserState],
  (user) => user.favorites
);

export const selectFavoritesByType = createSelector(
  [selectFavorites],
  (favorites) => (type: string) => favorites.filter((item: FavoriteItem) => item.type === type)
);

export const selectHasBirthData = createSelector(
  [selectBirthData],
  (birthData) => !!(birthData.date && birthData.time)
); 