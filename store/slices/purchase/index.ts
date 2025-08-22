import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { astroApiService } from '@/lib/services/astro-api';
import { SubscriptionData } from '@/components/subcription/types';

export const getSubscriptions = createAsyncThunk(
    'purchase/getSubscriptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await astroApiService.getPlans()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get tarot response')
        }
    }
)

export interface PurchaseState {
    isLoading: boolean;
    subscriptions: SubscriptionData[] | null;
    error: string | null;
}

const initialState: PurchaseState = {
    isLoading: false,
    subscriptions: null,
    error: null,
};

export const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        setSubscriptions: (state, action: PayloadAction<SubscriptionData[]>) => {
            state.subscriptions = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSubscriptions.fulfilled, (state, action) => {
            state.subscriptions = action.payload;
            state.isLoading = false;
        })
        builder.addCase(getSubscriptions.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getSubscriptions.rejected, (state, action) => {
            state.error = action.payload as string;
            state.isLoading = false;

        })
    }
});

export const { setSubscriptions, setLoading, setError, clearError } = purchaseSlice.actions;
export default purchaseSlice.reducer; 