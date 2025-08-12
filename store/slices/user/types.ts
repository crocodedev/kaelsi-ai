export type UserPreferences = {
  theme: 'mystical' | 'classic' | 'modern';
  language: 'en' | 'ru';
  notifications: boolean;
  dailyReminder: boolean;
  soundEnabled: boolean;
  cardSpeed: number; // Скорость анимации карт (100, 200, 300, 400, 500)
};

export interface FavoriteItem {
  id: string;
  type: 'reading' | 'card' | 'spread';
  name: string;
  description?: string;
  timestamp: number;
} 