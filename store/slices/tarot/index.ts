import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Matrix } from './state';

export interface TarotState {
    layout: {
        matrix: Matrix;
    } | null;
    isFirstAnimationDone: boolean;
    isLoading: boolean;
    loadingProgress: number;
    question: string | null;
    selectedCategory: string | null;
    selectedSpread: string | null;
    readerStyle: string | null;
}

const initialState: TarotState = {
    layout: null,
    isFirstAnimationDone: false,
    isLoading: true,
    loadingProgress: 0,
    question: null,
    selectedCategory: null,
    selectedSpread: null,
    readerStyle: null,
};

export const tarotSlice = createSlice({
    name: 'tarot',
    initialState,
    reducers: {
        setMatrix: (state, action: PayloadAction<Matrix>) => {
            state.layout = { matrix: action.payload };
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
        setQuestion: (state, action: PayloadAction<string>) => {
            state.question = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
        setSelectedSpread: (state, action: PayloadAction<string>) => {
            state.selectedSpread = action.payload;
        },
        setReaderStyle: (state, action: PayloadAction<string>) => {
            state.readerStyle = action.payload;
        },
        resetTarotState: (state) => {
            state.layout = null;
            state.isFirstAnimationDone = false;
            state.isLoading = true;
            state.loadingProgress = 0;
        },
    },
});

export const { setMatrix, setIsFirstAnimationDone, setLoading, setLoadingProgress, setQuestion, setSelectedCategory, setSelectedSpread, setReaderStyle, resetTarotState } = tarotSlice.actions;
export default tarotSlice.reducer; 