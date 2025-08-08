import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { astroApiService } from '@/lib/services/astro-api'
import { NatalChart, NatalChartData, FateMatrix, FateMatrixData, CardDay, Language, Plan } from '@/lib/types/astro-api'

interface AstroState {
  natalChart: NatalChart | null
  fateMatrix: FateMatrix | null
  cardDay: CardDay | null
  languages: Language[]
  plans: Plan[]
  loading: boolean
  error: string | null
}

const initialState: AstroState = {
  natalChart: null,
  fateMatrix: null,
  cardDay: null,
  languages: [],
  plans: [],
  loading: false,
  error: null
}

export const getLanguages = createAsyncThunk(
  'astro/getLanguages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getLanguages()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get languages')
    }
  }
)

export const getPlans = createAsyncThunk(
  'astro/getPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getPlans()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get plans')
    }
  }
)

export const getNatalChart = createAsyncThunk(
  'astro/getNatalChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getNatalChart()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get natal chart')
    }
  }
)

export const createNatalChart = createAsyncThunk(
  'astro/createNatalChart',
  async (data: NatalChartData, { rejectWithValue }) => {
    try {
      const response = await astroApiService.createNatalChart(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create natal chart')
    }
  }
)

export const getFateMatrix = createAsyncThunk(
  'astro/getFateMatrix',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getFateMatrix()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get fate matrix')
    }
  }
)

export const createFateMatrix = createAsyncThunk(
  'astro/createFateMatrix',
  async (data: FateMatrixData, { rejectWithValue }) => {
    try {
      const response = await astroApiService.createFateMatrix(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create fate matrix')
    }
  }
)

export const getCardDay = createAsyncThunk(
  'astro/getCardDay',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getCardDay()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get card of the day')
    }
  }
)

const astroSlice = createSlice({
  name: 'astro',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearNatalChart: (state) => {
      state.natalChart = null
    },
    clearFateMatrix: (state) => {
      state.fateMatrix = null
    },
    clearCardDay: (state) => {
      state.cardDay = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Languages
      .addCase(getLanguages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLanguages.fulfilled, (state, action: PayloadAction<Language[]>) => {
        state.loading = false
        state.languages = action.payload
      })
      .addCase(getLanguages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get Plans
      .addCase(getPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get Natal Chart
      .addCase(getNatalChart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getNatalChart.fulfilled, (state, action: PayloadAction<NatalChart>) => {
        state.loading = false
        state.natalChart = action.payload
      })
      .addCase(getNatalChart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create Natal Chart
      .addCase(createNatalChart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createNatalChart.fulfilled, (state, action: PayloadAction<NatalChart>) => {
        state.loading = false
        state.natalChart = action.payload
      })
      .addCase(createNatalChart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get Fate Matrix
      .addCase(getFateMatrix.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFateMatrix.fulfilled, (state, action: PayloadAction<FateMatrix>) => {
        state.loading = false
        state.fateMatrix = action.payload
      })
      .addCase(getFateMatrix.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create Fate Matrix
      .addCase(createFateMatrix.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createFateMatrix.fulfilled, (state, action: PayloadAction<FateMatrix>) => {
        state.loading = false
        state.fateMatrix = action.payload
      })
      .addCase(createFateMatrix.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get Card Day
      .addCase(getCardDay.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCardDay.fulfilled, (state, action: PayloadAction<CardDay>) => {
        state.loading = false
        state.cardDay = action.payload
      })
      .addCase(getCardDay.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, clearNatalChart, clearFateMatrix, clearCardDay } = astroSlice.actions
export default astroSlice.reducer 