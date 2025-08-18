import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { astroApiService } from '@/lib/services/astro-api'
import { TarotCategory, TarotCard, TarotReading, TarotReadingRequest, PaginatedResponse } from '@/lib/types/astro-api'
import { Layout, Matrix } from './state'
import { Coordinates } from './types'

interface TarotState {
  categories: TarotCategory[]
  cards: TarotCard[]
  readings: TarotReading[]
  currentReading: TarotReading | null
  selectedCategory: string | null
  selectedSpread: string | null
  readerStyle: string | null
  question: string | null
  loading: boolean
  isFirstAnimationDone: boolean;
  error: string | null
  layout: Layout | null
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
  isFirstAnimationDone: false,
  currentReading: null,
  selectedCategory: null,
  selectedSpread: null,
  readerStyle: null,
  question: null,
  layout: null,
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


const transformMatrixToArray = (matrix: any): Coordinates[] => {
  if (matrix && typeof matrix === 'object' && !Array.isArray(matrix)) {
    let result: Coordinates[] = []
    Object.values(matrix).forEach((value: any) => {
      if (Array.isArray(value) && value.length === 2) {
        const [x, y] = value;
        result.push({ x, y })
      }
    });
    return result;
  }
  return matrix || [];
};

export const setMatrix = createAsyncThunk(
  'tarot/setMatrix',
  async (matrix: any, { rejectWithValue }) => {
    return transformMatrixToArray(matrix);
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
    setReaderStyle: (state, action: PayloadAction<string | null>) => {
      state.readerStyle = action.payload
    },
    setQuestion: (state, action: PayloadAction<string | null>) => {
      state.question = action.payload
    },
    setIsFirstAnimationDone: (state, action: PayloadAction<boolean>) => {
      state.isFirstAnimationDone = action.payload
    },
    setMatrix: (state, action: PayloadAction<Matrix>) => {
      if (state.layout) {
        state.layout.matrix = action.payload
      } else {
        state.layout = {
          description: '',
          name: '',
          matrix: action.payload
        }
      }
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
      .addCase(setMatrix.fulfilled, (state, action) => {
        if (state.layout) {
          state.layout.matrix = action.payload
        } else {
          state.layout = {
            description: '',
            name: '',
            matrix: action.payload
          }
        }
      })
  }
})

export const { clearError, clearCurrentReading, setIsFirstAnimationDone, setCurrentReading, setSelectedCategory, setSelectedSpread, setQuestion, setReaderStyle } = tarotSlice.actions
export { transformMatrixToArray }
export default tarotSlice.reducer 