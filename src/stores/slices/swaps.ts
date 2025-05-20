import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  swaps: [],
  loading: false,
  error: null
};


const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
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

export const { setSwaps, setLoading, setError } = swapSlice.actions;
export default swapSlice.reducer;
