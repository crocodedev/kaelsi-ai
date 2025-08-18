import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Matrix } from './state';

export interface TarotState {
    layout: {
        matrix: Matrix;
    } | null;
    isFirstAnimationDone: boolean;
    isLoading: boolean;
    loadingProgress: number;
}

const initialState: TarotState = {
    layout: null,
    isFirstAnimationDone: false,
    isLoading: true,
    loadingProgress: 0,
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
        resetTarotState: (state) => {
            state.layout = null;
            state.isFirstAnimationDone = false;
            state.isLoading = true;
            state.loadingProgress = 0;
        },
    },
});

export const { setMatrix, setIsFirstAnimationDone, setLoading, setLoadingProgress, resetTarotState } = tarotSlice.actions;
export default tarotSlice.reducer; 