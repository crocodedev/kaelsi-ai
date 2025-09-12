import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { astroApiService } from '@/lib/services/astro-api'
import { NatalChart, NatalChartData, FateMatrix, FateMatrixData, CardDay, Language, Plan, AnswerChat, ChatMessage } from '@/lib/types/astro-api'
import { SubscriptionData } from '@/components/subcription/types'
import { LocalStorage } from '@/lib/utils/localStorage'

interface AstroState {
  natalChart: NatalChart | null
  fateMatrix: FateMatrix | null
  cardDay: CardDay | null
  languages: Language[]
  plans: SubscriptionData[]
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

export const getAnswerFromChat = createAsyncThunk('astro/getMessageChat', async (url: string, { rejectWithValue }) => {
  try {
    function parseChatUrl() {
      const match = url.match(/\/chat\/(\d+)\/message\/(\d+)/);
      if (!match) return {
        chat: "",
        chatMessage: ""
      };

      return {
        chat: match[1],
        chatMessage: match[2],
      };
    }
    const chat = parseChatUrl()?.chat;
    const chatMessage = parseChatUrl()?.chatMessage;
    const response = await astroApiService.getChatMessage(chat, chatMessage);
    return response.data as AnswerChat;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get Answer')

  }
})

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
  async (isNatalChart: boolean, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getNatalChart(isNatalChart)
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
  async (isFateMatrix: boolean, { rejectWithValue }) => {
    try {
      const response = await astroApiService.getFateMatrix(isFateMatrix)
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

export const subscribe = createAsyncThunk(

  'astro/subscribe',
  async (tierId: number, { rejectWithValue }) => {
    try {
      const response = await astroApiService.subscribe(tierId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to subscribe')
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
    },
    setAstroLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLanguages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLanguages.fulfilled, (state, action: PayloadAction<Language[]>) => {
        state.loading = false
        state.languages = action.payload
      })
      .addCase(subscribe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(subscribe.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getLanguages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAnswerFromChat.fulfilled, (state, action: PayloadAction<AnswerChat>) => {
        const language = LocalStorage.getLanguage() || 'en';
        const lang = (['en', 'ru', 'uk'].includes(language) ? language : 'en') as keyof typeof action.payload.message;
        if (action.payload.sender === 'natal_chart') {
          if (state.natalChart) {
            state.natalChart.reading = action.payload.message[lang];
          }
        } else if (action.payload.sender === 'fate_matrix') {
          if (state.fateMatrix) {
            state.fateMatrix.reading = action.payload.message[lang];
          }
        } 
      })
      .addCase(getPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPlans.fulfilled, (state, action: PayloadAction<SubscriptionData[]>) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
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

export const { clearError, clearNatalChart, clearFateMatrix, clearCardDay, setAstroLoading } = astroSlice.actions
export default astroSlice.reducer 