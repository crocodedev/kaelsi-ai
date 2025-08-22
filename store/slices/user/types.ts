export type UserPreferences = {
  theme: 'mystical' | 'classic' | 'modern';
  language: 'en' | 'ru';
  notifications: boolean;
  dailyReminder: boolean;
  soundEnabled: boolean;
  cardSpeed: number; 
  
};

export interface FavoriteItem {
  id: string;
  type: 'reading' | 'card' | 'spread';
  name: string;
  description?: string;
  timestamp: number;
} 