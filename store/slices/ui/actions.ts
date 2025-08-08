import { createAction } from '@reduxjs/toolkit';

import { ModalState, SidebarState, ToastItem } from './types';

export const actions = {
  setLoading: createAction<boolean>('ui/setLoading'),
  setError: createAction<string | null>('ui/setError'),
  setModal: createAction<ModalState | null>('ui/setModal'),
  setSidebar: createAction<SidebarState | null>('ui/setSidebar'),
  setToast: createAction<ToastItem>('ui/setToast'),
  removeToast: createAction<string>('ui/removeToast'),
  clearToasts: createAction<void>('ui/clearToasts'),
  setActiveNavigationItem: createAction<string>('ui/setActiveNavigationItem'),
  setActiveNavigationPosition: createAction<{ left: number; width: number }>('ui/setActiveNavigationPosition'),
};

export default actions; 