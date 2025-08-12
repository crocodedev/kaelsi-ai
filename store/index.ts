import { combineReducers, configureStore, ThunkMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import createWebStorage from 'redux-persist/es/storage/createWebStorage';

import tarotReducer, { setReaderStyle } from './slices/tarot';
import { reducer as userReducer } from './slices/user';
import { reducer as uiReducer } from './slices/ui';
import authReducer from './slices/auth';
import astroReducer from './slices/astro';

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
};

const rootReducer = combineReducers(reducer);

export type AppState = ReturnType<typeof rootReducer>;

import { clearError, clearCurrentReading, setCurrentReading, setSelectedCategory, setSelectedSpread, setQuestion, getTarotCategories, getTarotCards, createTarotReading, getTarotReadings, getTarotReading } from './slices/tarot';
import { logout, setToken, clearError as clearAuthError, register, login, getUser, updateUser, deleteUser } from './slices/auth';
import { clearError as clearAstroError, clearNatalChart, clearFateMatrix, clearCardDay, getLanguages, getPlans, getNatalChart, createNatalChart, getFateMatrix, createFateMatrix, getCardDay } from './slices/astro';

export const tarotActions = {
  clearError,
  clearCurrentReading,
  setCurrentReading,
  setSelectedCategory,
  setSelectedSpread,
  setQuestion,
  getTarotCategories,
  getTarotCards,
  createTarotReading,
  getTarotReadings,
  getTarotReading,
  setReaderStyle
};

export const authActions = {
  logout,
  setToken,
  clearError: clearAuthError,
  register,
  login,
  getUser,
  updateUser,
  deleteUser
};

export const astroActions = {
  clearError: clearAstroError,
  clearNatalChart,
  clearFateMatrix,
  clearCardDay,
  getLanguages,
  getPlans,
  getNatalChart,
  createNatalChart,
  getFateMatrix,
  createFateMatrix,
  getCardDay
};

export { actions as userActions } from './slices/user';
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