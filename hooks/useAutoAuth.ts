import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, userActions } from '@/store'
import { useCallback, useMemo, useEffect } from 'react'
import { AppState } from '@/store'
import { authActions } from '@/store'
import { RegistrationData, LoginData, UpdateUserData } from '@/lib/types/astro-api'
import { astroApiService } from '@/lib/services/astro-api'

import { useSocialAuth } from '@/hooks/useSocialAuth'

export const useAutoAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { checkGoogleLoginStatus, initializeGoogleAuth, loginWithGoogle } = useSocialAuth();

  const { token, isAuthenticated, loading, error } = useSelector(
    (state: AppState) => state.auth
  )
  const user = useSelector((state: AppState) => state.user)

  const loginWithGoogleUser = useCallback(async () => {
    try {
      const googleUser = await loginWithGoogle();
      
      try {

        const { data: { access_token, user } } = await astroApiService.login({
          email: googleUser.profile.email || '',
          password: googleUser.profile.id || ''
        });

        if (access_token) {
          dispatch(authActions.setToken(access_token))
          dispatch(userActions.setUserData(user))
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          const registerUser: RegistrationData = {
            email: googleUser.profile.email || '',
            gender: 'male',
            password: googleUser.profile.id || '',
            password_confirmation: googleUser.profile.id || '',
            name: googleUser.profile.name || googleUser.profile.givenName || 'User'
          }

          try {
            const { data: { access_token, user } } = await astroApiService.register(registerUser);
            dispatch(authActions.setToken(access_token))
            dispatch(userActions.setUserData(user))
          } catch (registerError) {
            console.error('Google user registration failed:', registerError)
            throw registerError;
          }
        } else {
          console.error('Google user login failed:', error)
          throw error;
        }
      }
    } catch (error) {
      console.error('Google login failed:', error)
      throw error;
    }
  }, [loginWithGoogle, dispatch])

  const tryGoogleAuth = useCallback(async () => {
    try {
      const isGoogleLoggedIn = await checkGoogleLoginStatus();
      
      if (!isGoogleLoggedIn) {
        await loginWithGoogleUser();
        return;
      } else {
        try {
          const googleUser = await loginWithGoogle();
          
          if (googleUser) {
            
            try {
              const { data: { access_token, user } } = await astroApiService.login({
                email: googleUser.profile.email || '',
                password: googleUser.profile.id || ''
              });

              if (access_token) {
                dispatch(authActions.setToken(access_token));
                dispatch(userActions.setUserData(user));
                return;
              }
            } catch (loginError: any) {
              if (loginError.response?.status === 401) {
                const registerUser: RegistrationData = {
                  email: googleUser.profile.email || '',
                  password: googleUser.profile.id || '',
                  gender: 'male',
                  password_confirmation: googleUser.profile.id || '',
                  name: googleUser.profile.name || googleUser.profile.givenName || 'User'
                };

                try {
                  const { data: { access_token, user } } = await astroApiService.register(registerUser);
                  dispatch(authActions.setToken(access_token));
                  dispatch(userActions.setUserData(user));
                  return;
                } catch (registerError) {
                  console.error('Google user registration failed:', registerError);
                }
              } else {
                console.error('Google user login failed:', loginError);
              }
            }
          }
        } catch (error) {
        }
      } 
    } catch (error) {
    }
  }, [checkGoogleLoginStatus, loginWithGoogleUser, loginWithGoogle, dispatch])

  const initializeAuth = useCallback(async () => {
    if (loading || isAuthenticated) return;
    
    await initializeGoogleAuth();
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken')
      
      if (storedToken) {
        dispatch(authActions.setToken(storedToken))
      } else {
        await tryGoogleAuth();
      }
    }
  }, [dispatch, isAuthenticated, tryGoogleAuth, initializeGoogleAuth, loading])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      initializeAuth()
    }
  }, [isAuthenticated, loading])

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
    initializeAuth
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
    initializeAuth
  ])
} 