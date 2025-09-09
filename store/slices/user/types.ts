import { Language } from "@/lib/types/astro-api";

export type UserPreferences = {
  theme: 'mystical' | 'classic' | 'modern';
  language: string;
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