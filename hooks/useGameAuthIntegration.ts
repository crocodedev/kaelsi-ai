import { useCallback } from 'react'
import { useGameAuth } from './useGameAuth'
import { useAuth } from './useAuth'

export const useGameAuthIntegration = () => {
  const { currentUser: gameUser, signIn: gameSignIn, signOut: gameSignOut } = useGameAuth()
  const { login, register, user, isAuthenticated } = useAuth()

  const handleGameSignIn = useCallback(async () => {
    try {
      const gameAccount = await gameSignIn()
      if (gameAccount) {
        const authData = {
          email: gameAccount.email || `${gameAccount.id}@${gameAccount.platform}.game`,
          password: gameAccount.id,
          password_confirmation: gameAccount.id,
          name: gameAccount.displayName
        }
        
        await register(authData)
        return gameAccount
      }
    } catch (error) {
      console.error('Failed to integrate game account:', error)
      throw error
    }
  }, [gameSignIn, register])

  const handleGameSignOut = useCallback(async () => {
    try {
      await gameSignOut()
    } catch (error) {
      console.error('Failed to sign out from game account:', error)
    }
  }, [gameSignOut])

  return {
    gameUser,
    handleGameSignIn,
    handleGameSignOut,
    isGameAuthenticated: !!gameUser,
    isAppAuthenticated: isAuthenticated
  }
} 