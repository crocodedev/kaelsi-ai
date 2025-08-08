import { GooglePlayGames } from './capacitor-game-auth'

export interface GameAccountData {
  id: string
  displayName: string
  email?: string
  photoUrl?: string
  platform: 'google' | 'apple'
}

export interface GameAuthService {
  initialize(): Promise<void>
  signIn(): Promise<GameAccountData | null>
  signOut(): Promise<void>
  getCurrentUser(): Promise<GameAccountData | null>
}

class GooglePlayGamesService implements GameAuthService {
  private isInitialized = false

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const result = await GooglePlayGames.initialize()
      console.log('GooglePlayGames initialize result:', result)
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize GooglePlayGames:', error)
      this.isInitialized = true
    }
  }

    async signIn(): Promise<GameAccountData | null> {
    console.log('GooglePlayGamesService.signIn called')
    if (!this.isInitialized) {
      console.log('Service not initialized, initializing...')
      await this.initialize()
    }

    return new Promise((resolve) => {
      GooglePlayGames.addListener('signInSuccess', (data) => {
        if (data.success && data.id && data.displayName) {
          resolve({
            id: data.id,
            displayName: data.displayName,
            email: data.email,
            photoUrl: data.photoUrl,
            platform: 'google'
          })
        } else {
          resolve(null)
        }
      })

      GooglePlayGames.addListener('signInError', (data) => {
        console.error('Google Play Games sign in failed:', data.error)
        resolve(null)
      })

      GooglePlayGames.signIn().catch((error) => {
        console.error('Google Play Games sign in failed:', error)
        resolve(null)
      })
    })
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return

    try {
      await GooglePlayGames.signOut()
    } catch (error) {
      console.error('Google Play Games sign out failed:', error)
    }
  }

  async getCurrentUser(): Promise<GameAccountData | null> {
    if (!this.isInitialized) return null

    try {
      const result = await GooglePlayGames.getCurrentUser()
      console.log('Get current user result:', result)
      if (result.success && result.id && result.displayName) {
        return {
          id: result.id,
          displayName: result.displayName,
          email: result.email,
          photoUrl: result.photoUrl,
          platform: 'google'
        }
      }
    } catch (error) {
      console.error('Failed to get current user:', error)
    }
    return null
  }


}

class GameCenterService implements GameAuthService {
  private isInitialized = false

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      if (window.GKLocalPlayer) {
        const localPlayer = window.GKLocalPlayer.localPlayer()
        if (localPlayer.authenticate) {
          await localPlayer.authenticate()
        }
        this.isInitialized = true
      }
    } catch (error) {
      console.error('Failed to initialize Game Center:', error)
    }
  }

  async signIn(): Promise<GameAccountData | null> {
    if (!this.isInitialized) return null

    try {
      const localPlayer = window.GKLocalPlayer?.localPlayer()
      if (localPlayer?.isAuthenticated) {
        return {
          id: localPlayer.playerID,
          displayName: localPlayer.displayName,
          email: undefined,
          photoUrl: undefined,
          platform: 'apple'
        }
      }
    } catch (error) {
      console.error('Game Center sign in failed:', error)
    }
    return null
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return

    try {
      window.GKLocalPlayer?.localPlayer().signOut()
    } catch (error) {
      console.error('Game Center sign out failed:', error)
    }
  }

  async getCurrentUser(): Promise<GameAccountData | null> {
    if (!this.isInitialized) return null

    try {
      const localPlayer = window.GKLocalPlayer?.localPlayer()
      if (localPlayer?.isAuthenticated) {
        return {
          id: localPlayer.playerID,
          displayName: localPlayer.displayName,
          email: undefined,
          photoUrl: undefined,
          platform: 'apple'
        }
      }
    } catch (error) {
      console.error('Failed to get current Game Center user:', error)
    }
    return null
  }
}

class MockGameAuthService implements GameAuthService {
  private mockUser: GameAccountData | null = null

  async initialize(): Promise<void> {
    console.log('Mock game auth service initialized')
  }

  async signIn(): Promise<GameAccountData | null> {
    this.mockUser = {
      id: 'mock-google-user-123',
      displayName: 'John Doe',
      email: 'john.doe@gmail.com',
      photoUrl: 'https://via.placeholder.com/150',
      platform: 'google'
    }
    return this.mockUser
  }

  async signOut(): Promise<void> {
    this.mockUser = null
    console.log('Mock game auth sign out')
  }

  async getCurrentUser(): Promise<GameAccountData | null> {
    return this.mockUser
  }
}

export const createGameAuthService = (): GameAuthService => {
  if (typeof window === 'undefined') {
    return new MockGameAuthService()
  }

  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('android')) {
    return new GooglePlayGamesService()
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return new GameCenterService()
  }

  return new MockGameAuthService()
}

declare global {
  interface Window {
    google?: {
      games: {
        initialize(): Promise<void>
        signIn(): Promise<{
          isSignedIn(): boolean
          getPlayer(): {
            getId(): string
            getDisplayName(): string
            getEmail(): string
            getPhotoUrl(): string
          }
        }>
        signOut(): Promise<void>
      }
    }
    GKLocalPlayer?: {
      localPlayer(): {
        playerID: string
        displayName: string
        isAuthenticated: boolean
        authenticate(): Promise<void>
        signOut(): void
      }
    }
  }
} 