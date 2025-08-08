import { ModalState, SidebarState, ToastItem } from './types';

export type InitialStateType = Readonly<{
  loading: boolean;
  error: string | null;
  modal: ModalState | null;
  sidebar: SidebarState | null;
  toasts: ToastItem[];
  navigation: {
    activeItem: string | null;
    activeItemPosition: { left: number; width: number } | null;
  };
}>;

export const initialState: InitialStateType = {
  loading: false,
  error: null,
  modal: null,
  sidebar: null,
  toasts: [],
  navigation: {
    activeItem: null,
    activeItemPosition: null,
  },
}; 