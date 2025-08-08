import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { astroApiService } from '@/lib/services/astro-api'
import { TarotCategory, TarotCard, TarotReading, TarotReadingRequest, PaginatedResponse } from '@/lib/types/astro-api'

interface TarotState {
  categories: TarotCategory[]
  cards: TarotCard[]
  readings: TarotReading[]
  currentReading: TarotReading | null
  selectedCategory: string | null
  selectedSpread: string | null
  question: string | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  } | null
}

const initialState: TarotState = {
  categories: [],
  cards: [],
  readings: [],
  currentReading: null,
  selectedCategory: null,
  selectedSpread: null,
  question: null,
  loading: false,
  error: null,
  pagination: null
}

export const getTarotCategories = createAsyncThunk(
  'tarot/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getTarotCategories()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get tarot categories')
    }
  }
)

export const getTarotCards = createAsyncThunk(
  'tarot/getCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getTarotCards()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get tarot cards')
    }
  }
)

export const createTarotReading = createAsyncThunk(
  'tarot/createReading',
  async (data: TarotReadingRequest, { rejectWithValue }) => {
    try {
      const response = await astroApiService.createTarotReading(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tarot reading')
    }
  }
)

export const getTarotReadings = createAsyncThunk(
  'tarot/getReadings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getTarotReadings()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get tarot readings')
    }
  }
)

export const getTarotReading = createAsyncThunk(
  'tarot/getReading',
  async (tarotUser: string, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getTarotReading(tarotUser)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get tarot reading')
    }
  }
)

const tarotSlice = createSlice({
  name: 'tarot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentReading: (state) => {
      state.currentReading = null
    },
    setCurrentReading: (state, action: PayloadAction<TarotReading>) => {
      state.currentReading = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
    setSelectedSpread: (state, action: PayloadAction<string | null>) => {
      state.selectedSpread = action.payload
    },
    setQuestion: (state, action: PayloadAction<string | null>) => {
      state.question = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTarotCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTarotCategories.fulfilled, (state, action: PayloadAction<PaginatedResponse<TarotCategory>>) => {
        state.loading = false
        state.categories = action.payload.data
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          totalPages: action.payload.meta.last_page,
          totalItems: action.payload.meta.total
        }
      })
      .addCase(getTarotCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getTarotCards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTarotCards.fulfilled, (state, action: PayloadAction<PaginatedResponse<TarotCard>>) => {
        state.loading = false
        state.cards = action.payload.data
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          totalPages: action.payload.meta.last_page,
          totalItems: action.payload.meta.total
        }
      })
      .addCase(getTarotCards.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createTarotReading.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTarotReading.fulfilled, (state, action: PayloadAction<TarotReading>) => {
        state.loading = false
        state.currentReading = action.payload
        state.readings.unshift(action.payload)
      })
      .addCase(createTarotReading.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getTarotReadings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTarotReadings.fulfilled, (state, action: PayloadAction<PaginatedResponse<TarotReading>>) => {
        state.loading = false
        state.readings = action.payload.data
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          totalPages: action.payload.meta.last_page,
          totalItems: action.payload.meta.total
        }
      })
      .addCase(getTarotReadings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getTarotReading.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTarotReading.fulfilled, (state, action: PayloadAction<TarotReading>) => {
        state.loading = false
        state.currentReading = action.payload
      })
      .addCase(getTarotReading.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, clearCurrentReading, setCurrentReading, setSelectedCategory, setSelectedSpread, setQuestion } = tarotSlice.actions
export default tarotSlice.reducer 