import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { astroApiService } from '@/lib/services/astro-api'
import { AuthResponse, User, RegistrationData, LoginData, UpdateUserData } from '@/lib/types/astro-api'
import { getOrCreateDeviceId, generateMockUser } from '@/lib/utils/device-id'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegistrationData, { rejectWithValue, dispatch }) => {
    try {
      const response = await astroApiService.register(data)
      if (response.data.user) {
        dispatch({ type: 'user/setUserData', payload: response.data.user })
      }
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue, dispatch }) => {
    try {
      const response = await astroApiService.login(data)
      if (response.data.user) {
        dispatch({ type: 'user/setUserData', payload: response.data.user })
      }
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await astroApiService.getUser()
      if (response.data) {
        dispatch({ type: 'user/setUserData', payload: response.data })
      }
    } catch (error: any) {
      const state = getState() as any
      const token = state.auth.token
      
      if (token && error.response?.status === 401) {
        return rejectWithValue('Token expired')
      }
      
      return rejectWithValue(error.response?.data?.message || 'Failed to get user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: UpdateUserData, { rejectWithValue, dispatch }) => {
    try {
      const response = await astroApiService.updateUser(data)
      if (response.data) {
        dispatch({ type: 'user/setUserData', payload: response.data })
      }
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await astroApiService.deleteUser()
      dispatch({ type: 'user/clearUserData' })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    dispatch({ type: 'user/clearUserData' })
    return { success: true }
  }
)

export const autoLoginMockUser = createAsyncThunk(
  'auth/autoLoginMockUser',
  async (_, { dispatch }) => {
    const deviceId = getOrCreateDeviceId()
    const mockUser = generateMockUser(deviceId)
    
    dispatch({ type: 'user/setUserData', payload: mockUser })
    return { user: mockUser, token: `mock_token_${deviceId}` }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      localStorage.setItem('authToken', action.payload)
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.token = action.payload.access_token
        state.isAuthenticated = true
        localStorage.setItem('authToken', action.payload.access_token)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.token = action.payload.access_token
        state.isAuthenticated = true
        localStorage.setItem('authToken', action.payload.access_token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = true
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        
        if (action.payload === 'Token expired') {
          state.token = null
          state.isAuthenticated = false
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
      })
      .addCase(autoLoginMockUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('authToken', action.payload.token)
      })
  }
})

export const { setToken, clearError } = authSlice.actions
export default authSlice.reducer 