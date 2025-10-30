import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { astroApiService } from '@/lib/services/astro-api';
import { initialState, mapServerPermissionsToLocal } from './state';

export const cancelSubscription = createAsyncThunk(
  'user/cancelSubscription',
  async (subscriptionId: number, { rejectWithValue }) => {
    try {
      const response = await astroApiService.cancelSubscription(subscriptionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cancel subscription is Failed');
    }
  }
);

export const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLastTarotId: (state, action) => {
      state.lastTarotId = action.payload
    },
    clearLastTarot: (state) => {
      state.lastTarotId = null;
    },
    clearError: (state) => {
      state.error = '';
    },
    setIsFateMatrix: (state, action) => {
      state.isFateMatrix = action.payload;
    },
    setIsNatalChart: (state, action) => {
      state.isNatalChart = action.payload;
    },
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
    },
    setNotifications: (state, action) => {
      state.preferences.notifications = action.payload;
    },
    setShowSubscription: (state, action) => {
      state.isShowSubscriptionPurchase = action.payload;
    },
    setSoundEnabled: (state, action) => {
      state.preferences.soundEnabled = action.payload;
    },
    setDailyReminder: (state, action) => {
      state.preferences.dailyReminder = action.payload;
    },
    setCardSpeed: (state, action) => {
      state.preferences.cardSpeed = action.payload;
    },
    updateUser: (state, action) => {
      state.birthData.date = action.payload.berth_date;
      state.birthData.time = action.payload.berth_time;

      if (action.payload.berth_latitude && action.payload.berth_longitude && !action.payload.berth_place) {
        state.birthData.latitude = typeof action.payload.berth_latitude === 'number' ? action.payload.berth_latitude : parseFloat(action.payload.berth_latitude);
        state.birthData.longitude = typeof action.payload.berth_longitude === 'number' ? action.payload.berth_longitude : parseFloat(action.payload.berth_longitude);
        state.birthData.place = '';
      } else {
        state.birthData.place = action.payload.berth_place || '';
        state.birthData.latitude = typeof action.payload.berth_latitude === 'number' ? action.payload.berth_latitude : parseFloat(action.payload.berth_latitude) || 0;
        state.birthData.longitude = typeof action.payload.berth_longitude === 'number' ? action.payload.berth_longitude : parseFloat(action.payload.berth_longitude) || 0;
      }

      state.birthData.timezone = action.payload.berth_timezone || '';
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    setUserData: (state, action) => {
      state.birthData.date = action.payload.berth_date;
      state.birthData.time = action.payload.berth_time;
      state.id = action.payload.id

      if (action.payload.berth_latitude && action.payload.berth_longitude && !action.payload.berth_place) {
        state.birthData.latitude = typeof action.payload.berth_latitude === 'number' ? action.payload.berth_latitude : parseFloat(action.payload.berth_latitude);
        state.birthData.longitude = typeof action.payload.berth_longitude === 'number' ? action.payload.berth_longitude : parseFloat(action.payload.berth_longitude);
        state.birthData.place = '';
      } else {
        state.birthData.place = action.payload.berth_place || '';
        state.birthData.latitude = typeof action.payload.berth_latitude === 'number' ? action.payload.berth_latitude : parseFloat(action.payload.berth_latitude) || 0;
        state.birthData.longitude = typeof action.payload.berth_longitude === 'number' ? action.payload.berth_longitude : parseFloat(action.payload.berth_longitude) || 0;
      }

      state.birthData.timezone = action.payload.berth_timezone || '';
      state.gender = action.payload.gender;
      state.subscription = action.payload.subscription;
      state.isFateMatrix = action.payload.is_fate_matrix;
      state.isNatalChart = action.payload.is_natal_chart;
      state.lastTarotId = action.payload.last_tarot_id;
      state.permissions = mapServerPermissionsToLocal(action.payload.permissions);
    },
    setBirthPlace: (state, action) => {
      state.birthData.place = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setServerPermissions: (state, action) => {
      state.permissions = mapServerPermissionsToLocal(action.payload);
    },
    clearUserData: (state) => {
      state.birthData = {
        date: '',
        time: '',
        place: '',
        latitude: 0,
        longitude: 0,
        timezone: '',
      };
      state.permissions = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {

        state.error = action.payload as string;
        state.isLoading = false;
      });
  }
});

export const {
  setPreferences,
  setIsFateMatrix,
  setIsNatalChart,
  setTheme,
  setLanguage,
  setNotifications,
  setShowSubscription,
  setSoundEnabled,
  setDailyReminder,
  setCardSpeed,
  updateUser,
  clearError,
  addToFavorites,
  clearLastTarot,
  removeFromFavorites,
  clearFavorites,
  setUserData,
  setLastTarotId,
  setBirthPlace,
  setPermissions,
  setServerPermissions,
  clearUserData
} = purchaseSlice.actions;

export default purchaseSlice.reducer;

