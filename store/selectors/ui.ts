import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../index';

const selectUiState = (state: AppState) => state.ui;

export const selectLoading = createSelector(
  [selectUiState],
  (ui) => ui.loading
);

export const selectError = createSelector(
  [selectUiState],
  (ui) => ui.error
);

export const selectModal = createSelector(
  [selectUiState],
  (ui) => ui.modal
);

export const selectSidebar = createSelector(
  [selectUiState],
  (ui) => ui.sidebar
);

export const selectToasts = createSelector(
  [selectUiState],
  (ui) => ui.toasts
);

export const selectIsModalOpen = createSelector(
  [selectModal],
  (modal) => modal !== null
);

export const selectIsSidebarOpen = createSelector(
  [selectSidebar],
  (sidebar) => sidebar?.isOpen || false
); 