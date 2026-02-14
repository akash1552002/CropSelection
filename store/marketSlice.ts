import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { fetchMarketPrices } from '../services/marketPriceService';

// Define a type for the slice state
interface MarketState {
    prices: any[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null
}

// Initial state
const initialState: MarketState = {
    prices: [],
    loading: false,
    error: null,
    lastUpdated: null,
};

// Async thunk to fetch prices
export const fetchPrices = createAsyncThunk(
    'market/fetchPrices',
    async () => {
        const response = await fetchMarketPrices();
        return response;
    }
);

export const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        // Standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder: ActionReducerMapBuilder<MarketState>) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchPrices.pending, (state: MarketState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPrices.fulfilled, (state: MarketState, action: PayloadAction<any>) => {
            state.prices = action.payload;
            state.loading = false;
            state.lastUpdated = new Date().toLocaleTimeString();
        });
        builder.addCase(fetchPrices.rejected, (state: MarketState, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch prices';
        });
    },
});

export default marketSlice.reducer;
