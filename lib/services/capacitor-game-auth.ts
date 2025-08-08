import { registerPlugin } from '@capacitor/core'

export interface GooglePlayGamesPlugin {
  initialize(): Promise<{ success: boolean; error?: string }>
  signIn(): Promise<void>
  signOut(): Promise<{ success: boolean; error?: string }>
  getCurrentUser(): Promise<{ 
    success: boolean; 
    id?: string; 
    displayName?: string; 
    email?: string; 
    photoUrl?: string; 
    error?: string 
  }>
  addListener(eventName: 'signInSuccess' | 'signInError', listenerFunc: (data: any) => void): void
  removeAllListeners(): void
}

export const GooglePlayGames = registerPlugin<GooglePlayGamesPlugin>('GooglePlayGames') 