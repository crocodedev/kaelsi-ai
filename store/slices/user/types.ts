export interface UserPreferences {
  theme: 'mystical' | 'light' | 'dark';
  language: 'en' | 'ru' | 'es' | 'fr';
  notifications: boolean;
  dailyReminder: boolean;
  soundEnabled: boolean;
}

export interface FavoriteItem {
  id: string;
  type: 'reading' | 'card' | 'spread';
  name: string;
  description?: string;
  timestamp: number;
} 