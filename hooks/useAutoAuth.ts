import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, userActions } from '@/store'
import { useCallback, useMemo, useEffect } from 'react'
import { AppState } from '@/store'
import { authActions } from '@/store'
import { RegistrationData, LoginData, UpdateUserData } from '@/lib/types/astro-api'
import { astroApiService } from '@/lib/services/astro-api'
import { useRouter } from 'next/navigation'
import { getOrCreateDeviceId, generateMockUser } from '@/lib/utils/device-id'

export const useAutoAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();

  const { token, isAuthenticated, loading, error } = useSelector(
    (state: AppState) => state.auth
  )
  const user = useSelector((state: AppState) => state.user)

  const initializeAuth = useCallback(async () => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const storedToken = localStorage.getItem('authToken')
      if (storedToken) {
        dispatch(authActions.setToken(storedToken))
      } else {
        const deviceId = getOrCreateDeviceId()
        const mockUser = generateMockUser(deviceId)
        
        try {
          const { data: { access_token, user } } = await astroApiService.login({
            email: mockUser.email,
            password: mockUser.deviceId
          });

          if (access_token) {
            dispatch(authActions.setToken(access_token))
            dispatch(userActions.setUserData(user))
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            const registerUser: RegistrationData = {
              email: mockUser.email,
              password: mockUser.deviceId,
              password_confirmation: mockUser.deviceId,
              name: mockUser.username
            }

            try {
              const { data: { access_token, user } } = await astroApiService.register(registerUser);
              dispatch(authActions.setToken(access_token))
              dispatch(userActions.setUserData(user))
            } catch (registerError) {
              console.error('Response data:', JSON.stringify((registerError as any).response?.data))
              throw registerError
            }
          } else {
            console.error('Response data:', JSON.stringify((error as any).response?.data))
            throw error
          }
        }
      }
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      initializeAuth()
    }
  }, [initializeAuth, isAuthenticated, loading])

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