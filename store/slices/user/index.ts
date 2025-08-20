import { createReducer } from '@reduxjs/toolkit';

import actions from './actions';
import { initialState } from './state';

export const reducer = createReducer(initialState, builder => {
  builder.addCase(actions.setPreferences, (state, action) => {
    state.preferences = { ...state.preferences, ...action.payload };
  });

  builder.addCase(actions.setShowSubscription, (state, action) => {
    state.subscription.isShowSubscription = action.payload;
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

  builder.addCase(actions.setSoundEnabled, (state, action) => {
    state.preferences.soundEnabled = action.payload;
  });

  builder.addCase(actions.setDailyReminder, (state, action) => {
    state.preferences.dailyReminder = action.payload;
  });

  builder.addCase(actions.setCardSpeed, (state, action) => {
    state.preferences.cardSpeed = action.payload;
  });

  builder.addCase(actions.setSubscription, (state, action) => {
    state.subscription = { ...state.subscription, ...action.payload };
  });

  builder.addCase(actions.updateUser, (state, action) => {
    state.birthData = { ...state.birthData, ...action.payload };
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

  builder.addCase(actions.setUserData, (state, action) => {
    state.userData = action.payload;
    if (action.payload.berth_date) {
      state.birthData.date = action.payload.berth_date;
    }
    if (action.payload.berth_time) {
      state.birthData.time = action.payload.berth_time;
    }
    if (action.payload.berth_place) {
      state.birthData.place = action.payload.berth_place;
    }
  });

  builder.addCase(actions.clearUserData, (state) => {
    state.userData = null;
    state.birthData = {
      date: '',
      time: '',
      place: '',
    };
    
  });
});

export { actions }; 