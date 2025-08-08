import { createReducer } from '@reduxjs/toolkit';

import actions from './actions';
import { initialState } from './state';

export const reducer = createReducer(initialState, builder => {
  builder.addCase(actions.setLoading, (state, action) => {
    state.loading = action.payload;
  });

  builder.addCase(actions.setError, (state, action) => {
    state.error = action.payload;
  });

  builder.addCase(actions.setModal, (state, action) => {
    state.modal = action.payload;
  });

  builder.addCase(actions.setSidebar, (state, action) => {
    state.sidebar = action.payload;
  });

  builder.addCase(actions.setToast, (state, action) => {
    state.toasts.push(action.payload);
  });

  builder.addCase(actions.removeToast, (state, action) => {
    state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
  });

  builder.addCase(actions.clearToasts, (state) => {
    state.toasts = [];
  });

  builder.addCase(actions.setActiveNavigationItem, (state, action) => {
    state.navigation.activeItem = action.payload;
  });

  builder.addCase(actions.setActiveNavigationPosition, (state, action) => {
    state.navigation.activeItemPosition = action.payload;
  });
});

export { actions }; 