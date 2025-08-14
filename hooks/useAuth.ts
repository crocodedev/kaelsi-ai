import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, userActions } from '@/store'
import { useCallback, useMemo, useEffect } from 'react'
import { AppState } from '@/store'
import { authActions } from '@/store'
import { RegistrationData, LoginData, UpdateUserData } from '@/lib/types/astro-api'
import { astroApiService } from '@/lib/services/astro-api'
import { useRouter } from 'next/navigation'


export const useAuth = () => {
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
        const mockUser = {
          "email": "dev@mail.ru",
          "password": "devpassword"
        }

        try {
          const { data: { access_token, user } } = await astroApiService.login(mockUser);

          if (access_token) {
            dispatch(authActions.setToken(access_token))
            dispatch(userActions.setUserData(user))
          } else {


          }
        } catch (error: any) {
          if (error.status == 401) {
            const registerUser = {
              ...mockUser,
              password_confirmation: mockUser.password,
              name: 'dev'
            }

            const { data: { access_token, user } } = await astroApiService.register(registerUser);
            dispatch(authActions.setToken(access_token))
            dispatch(userActions.setUserData(user))
          }
          console.log('Mock login failed, using default token')
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