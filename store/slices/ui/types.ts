export interface ModalState {
  type: 'settings' | 'help' | 'about' | 'reading-details';
  data?: any;
}

export interface SidebarState {
  type: 'menu' | 'favorites' | 'history';
  isOpen: boolean;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
} 