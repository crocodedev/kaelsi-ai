import { combineReducers, configureStore, ThunkMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import createWebStorage from 'redux-persist/es/storage/createWebStorage';

import { reducer as uiReducer } from './slices/ui';
import tarotReducer from './slices/tarot';
import authReducer from './slices/auth';
import astroReducer, { getAnswerFromChat } from './slices/astro';
import userReducer from './slices/user';
import purchaseReducer from './slices/purchase';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const userPersistConfig = {
  key: 'user',
  version: 1,
  storage,
  whitelist: ['preferences', 'history'],
  stateReconciler: autoMergeLevel2,
  timeout: 10000,
};

export const reducer = {
  tarot: tarotReducer,
  user: persistReducer<ReturnType<typeof userReducer>>(userPersistConfig, userReducer),
  ui: uiReducer,
  auth: authReducer,
  astro: astroReducer,
  purchase: purchaseReducer,
};

const rootReducer = combineReducers(reducer);

export type AppState = ReturnType<typeof rootReducer>;

import { setSelectedCategory, setSelectedSpread, setQuestion, getTarotCategories, setCategories, setIsFirstAnimationDone, setReaderStyle, getTarotResponse, getTarotSpreads, getTarotSpeaker, clearError as clearTarotError, clearChart, getTarotById } from './slices/tarot';
import { setToken, clearError as clearAuthError, setIsOpenModal, register, login, getUser, updateUser, deleteUser, autoLoginMockUser, setLoading as setAuthLoading } from './slices/auth';
import { clearError as clearAstroError, clearNatalChart, clearFateMatrix, clearCardDay, getLanguages, getPlans, getNatalChart, createNatalChart, getFateMatrix, createFateMatrix, getCardDay, setAstroLoading, subscribe } from './slices/astro';
import { setSubscriptions, setLoading, setError, clearError as clearPurchaseError, getSubscriptions } from './slices/purchase';
import { cancelSubscription, updateUser as updateUserClient, setBirthPlace, setCardSpeed, setDailyReminder, setIsFateMatrix, setIsNatalChart, setLanguage, setNotifications, setPermissions, setPreferences, setServerPermissions, setShowSubscription, setSoundEnabled, setTheme, setUserData, clearUserData, addToFavorites, clearError as clearUserError, clearLastTarot, setLastTarotId } from './slices/user';

export const tarotActions = {
  setSelectedCategory,
  getTarotSpreads,
  getTarotSpeaker,
  getTarotById,
  getTarotResponse,
  clearChart,
  setSelectedSpread,
  setCategories,
  setQuestion,
  setIsFirstAnimationDone,
  setReaderStyle,
  getTarotCategories,
  clearError: clearTarotError
};

export const authActions = {
  setToken,
  setLoading: setAuthLoading,
  clearError: clearAuthError,
  register,
  setIsOpenModal,
  login,
  getUser,
  updateUser,
  deleteUser,
  autoLoginMockUser
};

export const astroActions = {
  clearError: clearAstroError,
  clearNatalChart,
  clearFateMatrix,
  setLoading: setAstroLoading,
  clearCardDay,
  getLanguages,
  getPlans,
  getNatalChart,
  createNatalChart,
  getFateMatrix,
  getAnswerFromChat,
  createFateMatrix,
  getCardDay,
  subscribe
};

export const purchaseActions = {
  setSubscriptions,
  setLoading,
  setError,
  clearError: clearPurchaseError,
  getSubscriptions
};

export const userActions = {
  cancelSubscription,
  updateUserClient,
  setLastTarotId,
  setBirthPlace,
  setCardSpeed,
  setDailyReminder,
  clearLastTarot,
  setIsFateMatrix,
  clearError: clearUserError,
  setIsNatalChart,
  setLanguage,
  setNotifications,
  setPermissions,
  setPreferences, setServerPermissions,
  setShowSubscription,
  setSoundEnabled,
  setTheme,
  setUserData,
  clearUserData,
  addToFavorites
}
export { actions as uiActions } from './slices/ui';

export type AppSelector = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const listMiddlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    if (process.env.NODE_ENV === 'development') {
      listMiddlewares.push(createLogger({ collapsed: true }) as ThunkMiddleware);
    }
    return listMiddlewares;
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store; 