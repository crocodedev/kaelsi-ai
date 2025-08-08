import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { astroApiService } from '@/lib/services/astro-api'
import { AuthResponse, User, RegistrationData, LoginData, UpdateUserData } from '@/lib/types/astro-api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegistrationData, { rejectWithValue }) => {
    try {
      const response = await astroApiService.register(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await astroApiService.login(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await astroApiService.getUser()
      return response.data
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
  async (data: UpdateUserData, { rejectWithValue }) => {
    try {
      const response = await astroApiService.updateUser(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.deleteUser()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    },
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
        state.user = action.payload.user
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
        state.user = action.payload.user
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
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        
        if (action.payload === 'Token expired') {
          state.user = null
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
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
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
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, setToken, clearError } = authSlice.actions
export default authSlice.reducer 