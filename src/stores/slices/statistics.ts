import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tokens: [],
    pools: [],
    swaps: [],
    loading: false,
    error: null
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.tokens = action.payload;
        },
        setPools: (state, action) => {
            state.pools = action.payload;
        },
        setSwaps: (state, action) => {
            state.swaps = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setTokens, setPools, setSwaps, setLoading, setError } = statisticsSlice.actions;
export default statisticsSlice.reducer; 