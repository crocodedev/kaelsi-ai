import { useState, useEffect, useCallback } from 'react'
import { createGameAuthService, GameAuthService, GameAccountData } from '@/lib/services/game-auth'

export const useGameAuth = () => {
  const [gameAuthService] = useState<GameAuthService>(() => createGameAuthService())
  const [currentUser, setCurrentUser] = useState<GameAccountData | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialize = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await gameAuthService.initialize()
      setIsInitialized(true)
      
      const user = await gameAuthService.getCurrentUser()
      setCurrentUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize game auth')
    } finally {
      setLoading(false)
    }
  }, [gameAuthService])

  const signIn = useCallback(async () => {
    try {
      console.log('Starting game sign in...')
      setLoading(true)
      setError(null)
      
      if (!isInitialized) {
        console.log('Initializing game auth service...')
        await initialize()
      }
      
      console.log('Calling game auth service signIn...')
      const user = await gameAuthService.signIn()
      console.log('Sign in result:', user)
      setCurrentUser(user)
      return user
    } catch (err) {
      console.error('Game sign in error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      return null
    } finally {
      setLoading(false)
    }
  }, [gameAuthService, isInitialized, initialize])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await gameAuthService.signOut()
      setCurrentUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    } finally {
      setLoading(false)
    }
  }, [gameAuthService])



  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    currentUser,
    isInitialized,
    loading,
    error,
    signIn,
    signOut,
    clearError,
    initialize
  }
} 