import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pools: [],
  loading: false,
  error: null
};

const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    setPools: (state, action) => {
      state.pools = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setPools, setLoading, setError } = poolsSlice.actions;
export default poolsSlice.reducer;
