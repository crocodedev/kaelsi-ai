import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Matrix } from './state';
import { astroApiService } from '@/lib/services/astro-api';
import { TarotCategory, TarotCard, TarotRequest, TarotSpeaker, AnswerChat, TarotAnswerChat } from '@/lib/types/astro-api';
import { Pagination } from './types';

export const getTarotResponse = createAsyncThunk(
    'tarot/getTarotResponse',
    async ({ question, tarot_id, speaker_id, category_id }: TarotRequest['request'], { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotResponse({ tarot_id, question, speaker_id, category_id })
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get tarot response')
        }
    }
)

export const getAnswerFromChat = createAsyncThunk('tarot/getTarotAnswerFromChat', async (url: string, { rejectWithValue }) => {
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
        return response.data as TarotAnswerChat;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get Answer')

    }
})

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
    async ({ page, per_page }: Pagination, { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotCategories({ params: { page: page || 1, per_page: per_page || 20 } });
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get languages')
        }
    }
)

export const getTarotSpreads = createAsyncThunk(
    'tarot/getTarotSpreads',
    async (selectedCategory: TarotCategory | null, { rejectWithValue }) => {
        try {
            const response = await astroApiService.getTarotCards({ params: { page: 1, per_page: 20, category_id: selectedCategory?.id } })
            return response.data
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get spreads')
        }
    }
)

export const getTarotById = createAsyncThunk('tarot/getTarotById', async (lastTarotId: number, { rejectWithValue }) => {
    try {
        const response = await astroApiService.getTarotById(lastTarotId);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get tarot by id')
    }
})

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
        clearTarotSpeads: (state) => {
            state.spreads = []
        },
        setCategories: (state, action: PayloadAction<TarotCategory[]>) => {
            state.categories = action.payload;
        },
        setIsFirstAnimationDone: (state, action: PayloadAction<boolean>) => {
            state.isFirstAnimationDone = action.payload;
        },
        clearChart: (state) => {
            state.selectedCategory = null;
            state.question = '';
            state.readerStyle = null;
            state.selectedSpread = null;
            state.response = null;
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
        updateLanguageSelectedData: (state) => {
            state.selectedCategory = state.categories?.find(category => category.id === state.selectedCategory?.id) || null;
            state.selectedSpread = state.spreads?.find(spread => spread.id === state.selectedSpread?.id) || null;
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
            .addCase(getAnswerFromChat.fulfilled, (state, action: PayloadAction<TarotAnswerChat>) => {

                if (!state.response) return;

                if (action.payload.message.status == 'reject' || action.payload.message.status == 'redirect') {
                    state.response.reading = {
                        status: action.payload.message.status,
                        suggestion: action.payload.message?.suggetion,
                        interpretation: null,
                        final_question: ""
                    }
                    state.error = action.payload.message?.message || ''
                    return;
                }

                state.response.reading = {
                    status: action.payload.message.status,
                    final_question: action.payload.message.final_question,
                    interpretation: {
                        analysis: action.payload.message.interpretation.analysis,
                        final: action.payload.message.interpretation.final,
                        intro: action.payload.message.interpretation.intro
                    }
                };
                state.response.reading.status = action.payload.message.status;
                state.response.reading.final_question = action.payload.message.final_question;
            })
            .addCase(getTarotCategories.fulfilled, (state, action: PayloadAction<TarotCategory[]>) => {
                state.categories = action.payload;
                state.isLoading = false;
            })
            .addCase(getTarotCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getTarotById.fulfilled, (state, action) => {
                state.response = action.payload;
                if (state.response?.cards) {
                    Object.keys(state.response.cards).forEach(key => {
                        if (state.response?.cards?.[key]?.image) {
                            state.response.cards[key].image = state.response.cards[key].image;
                        }
                    });
                }
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getTarotById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getTarotById.pending, (state, action) => {
                state.isLoading = true;
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
                state.isLoading = false;

                if (state.response?.cards) {
                    Object.keys(state.response.cards).forEach(key => {
                        if (state.response?.cards?.[key]?.image) {
                            state.response.cards[key].image = state.response.cards[key].image;
                        }
                    });
                }
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

export const { setMatrix, setIsFirstAnimationDone, updateLanguageSelectedData, clearTarotSpeads, setCategories, setLoading, setLoadingProgress, setQuestion, setSelectedCategory, setSelectedSpread, setReaderStyle, resetTarotResponse, resetTarotState, clearError, clearChart } = tarotSlice.actions;
export default tarotSlice.reducer; 