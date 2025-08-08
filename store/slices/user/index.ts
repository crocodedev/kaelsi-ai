import { createReducer } from '@reduxjs/toolkit';

import actions from './actions';
import { initialState } from './state';

export const reducer = createReducer(initialState, builder => {
  builder.addCase(actions.setPreferences, (state, action) => {
    state.preferences = { ...state.preferences, ...action.payload };
  });

  builder.addCase(actions.setTheme, (state, action) => {
    state.preferences.theme = action.payload;
  });

  builder.addCase(actions.setLanguage, (state, action) => {
    state.preferences.language = action.payload;
  });

  builder.addCase(actions.setNotifications, (state, action) => {
    state.preferences.notifications = action.payload;
  });

  builder.addCase(actions.addToFavorites, (state, action) => {
    state.favorites.push(action.payload);
  });

  builder.addCase(actions.removeFromFavorites, (state, action) => {
    state.favorites = state.favorites.filter(item => item.id !== action.payload);
  });

  builder.addCase(actions.clearFavorites, (state) => {
    state.favorites = [];
  });
});

export { actions }; 