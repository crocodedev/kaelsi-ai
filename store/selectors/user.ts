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

export const selectFavorites = createSelector(
  [selectUserState],
  (user) => user.favorites
);

export const selectFavoritesByType = createSelector(
  [selectFavorites],
  (favorites) => (type: string) => favorites.filter((item: FavoriteItem) => item.type === type)
); 