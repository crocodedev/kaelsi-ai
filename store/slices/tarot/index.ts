import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Matrix } from './state';
import { astroApiService } from '@/lib/services/astro-api';
import { TarotCategory, TarotCard, TarotRequest, TarotSpeaker } from '@/lib/types/astro-api';

export const getTarotResponse = createAsyncThunk(
    'tarot/getTarotResponse',
    async ({ question, tarot_id, speaker_id }: TarotRequest['request'], { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotResponse({ tarot_id, question, speaker_id })
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get tarot response')
        }
    }
)

export const getTarotSpeaker = createAsyncThunk(
    'tarot/getTarotSpeaker',
    async (_, { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotSpeaker();
            return response.data
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get tarot speaker')
        }
    }
)

export const getTarotCategories = createAsyncThunk(
    'tarot/getTarotCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotCategories({ params: { page: 1, per_page: 20 } });
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get languages')
        }
    }
)

export const getTarotSpreads = createAsyncThunk(
    'tarot/getTarotSpreads',
    async (_, { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotCards({ params: { page: 1, per_page: 20 } })
            return response.data
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get spreads')
        }
    }
)

export interface TarotState {
    layout: {
        matrix: Matrix;
    } | null;
    isFirstAnimationDone: boolean;
    isLoading: boolean;
    loadingProgress: number;
    question: string | null;
    selectedCategory: TarotCategory | null;
    selectedSpread: TarotCard | null;
    speakers: TarotSpeaker[] | null;
    readerStyle: TarotSpeaker | null;
    spreads: TarotCard[] | null;
    categories: TarotCategory[] | null;
    response: TarotRequest['response'] | null;
    error: string | null;
}

const initialState: TarotState = {
    layout: null,
    isFirstAnimationDone: false,
    isLoading: true,
    speakers: null,
    loadingProgress: 0,
    question: null,
    spreads: null,
    selectedCategory: null,
    selectedSpread: null,
    readerStyle: null,
    categories: null,
    response: null,
    error: null,
};

export const tarotSlice = createSlice({
    name: 'tarot',
    initialState,
    reducers: {
        setMatrix: (state, action: PayloadAction<Matrix>) => {
            state.layout = { matrix: action.payload };
        },
        setCategories: (state, action: PayloadAction<TarotCategory[]>) => {
            state.categories = action.payload;
        },
        setIsFirstAnimationDone: (state, action: PayloadAction<boolean>) => {
            state.isFirstAnimationDone = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingProgress: (state, action: PayloadAction<number>) => {
            state.loadingProgress = action.payload;
        },
        setQuestion: (state, action: PayloadAction<string | null>) => {
            state.question = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<TarotCategory | null>) => {
            state.selectedCategory = action.payload;
        },
        setSelectedSpread: (state, action: PayloadAction<TarotCard | null>) => {
            state.selectedSpread = action.payload;
        },
        setReaderStyle: (state, action: PayloadAction<TarotSpeaker | null>) => {
            state.readerStyle = action.payload;
        },
        resetTarotResponse: (state) => {
            state.response = null;
            state.error = null;
        },
        resetTarotState: (state) => {
            state.layout = null;
            state.isFirstAnimationDone = false;
            state.isLoading = true;
            state.loadingProgress = 0;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTarotCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTarotCategories.fulfilled, (state, action: PayloadAction<TarotCategory[]>) => {
                state.categories = action.payload;
                state.isLoading = false;
            })
            .addCase(getTarotCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getTarotSpreads.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTarotSpreads.fulfilled, (state, action) => {
                state.spreads = action.payload;
                state.isLoading = false;
            })
            .addCase(getTarotSpreads.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getTarotResponse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTarotResponse.fulfilled, (state, action) => {
                state.response = action.payload;
                if (state.response?.cards) {
                    Object.keys(state.response.cards).forEach(key => {
                        if (state.response?.cards?.[key]?.image) {
                            state.response.cards[key].image = state.response.cards[key].image.replace('http', 'https');
                        }
                    });
                }
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getTarotResponse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getTarotSpeaker.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTarotSpeaker.fulfilled, (state, action) => {
                state.speakers = action.payload;
                state.isLoading = false;
            })
            .addCase(getTarotSpeaker.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    }
});

export const { setMatrix, setIsFirstAnimationDone, setCategories, setLoading, setLoadingProgress, setQuestion, setSelectedCategory, setSelectedSpread, setReaderStyle, resetTarotResponse, resetTarotState, clearError } = tarotSlice.actions;
export default tarotSlice.reducer; 