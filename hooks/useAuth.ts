import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, userActions } from '@/store'
import { useCallback, useMemo, useEffect } from 'react'
import { AppState } from '@/store'
import { authActions } from '@/store'
import { RegistrationData, LoginData, UpdateUserData } from '@/lib/types/astro-api'
import { astroApiService } from '@/lib/services/astro-api'
import { useSocialAuth } from '@/hooks/useSocialAuth'
import { SocialProviders } from '@/lib/types/configurations'

let tokenSetted = false;

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { initializeGoogleAuth, loginWithGoogle } = useSocialAuth();

  const { token, isAuthenticated, loading, error } = useSelector(
    (state: AppState) => state.auth
  )
  const user = useSelector((state: AppState) => state.user)

  const handleGoogleAuth = useCallback(async () => {
    try {
      const googleUser = await loginWithGoogle();

      if (!googleUser.serverAuthCode) {
        throw new Error('No server auth code received from Google');
      }

      try {
        const { data: { access_token, user } } = await astroApiService.loginWithSocial({
          provider: SocialProviders.GOOGLE,
          token: googleUser.serverAuthCode
        });

        if (access_token) {
          await dispatch(authActions.setToken(access_token))
          await dispatch(userActions.setUserData(user))
        }
      } catch (error: any) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }, [loginWithGoogle, dispatch])

  const initializeAuth = useCallback(async () => {
    if (loading || isAuthenticated) return;

    await initializeGoogleAuth();
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken')

      if (storedToken && !token && !tokenSetted) {
        tokenSetted = true
        dispatch(authActions.setToken(storedToken))
      }
    }
  }, [dispatch, isAuthenticated, initializeGoogleAuth, loading])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      initializeAuth()
    }
  }, [isAuthenticated, loading, initializeAuth])

  const handleRegister = useCallback(
    async (data: RegistrationData) => {
      return await dispatch(authActions.register(data))
    },
    [dispatch]
  )

  const handleLogin = useCallback(
    async (data: LoginData) => {
      return await dispatch(authActions.login(data))
    },
    [dispatch]
  )

  const handleGetUser = useCallback(async () => {
    return await dispatch(authActions.getUser())
  }, [dispatch])

  const handleUpdateUser = useCallback(
    async (data: UpdateUserData) => {
      return await dispatch(authActions.updateUser(data))
    },
    [dispatch]
  )

  const handleDeleteUser = useCallback(async () => {
    return await dispatch(authActions.deleteUser())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(authActions.clearError())
  }, [dispatch])

  return useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    getUser: handleGetUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    clearError: handleClearError,
    initializeAuth,
    loginWithGoogle: handleGoogleAuth
  }), [
    user,
    token,
    isAuthenticated,
    loading,
    error,
    handleRegister,
    handleLogin,
    handleGetUser,
    handleUpdateUser,
    handleDeleteUser,
    handleClearError,
    initializeAuth,
    handleGoogleAuth
  ])
} 