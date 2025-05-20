import { createSlice } from '@reduxjs/toolkit';
import { setLoading as setPoolsLoading } from './pools';

const initialState = {
  tokens: [],
  loading: false,
  error: null
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setTokens, setLoading, setError } = tokenSlice.actions;
export default tokenSlice.reducer;