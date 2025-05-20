import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ethPriceInUSD: 0,
  loading: false,
  error: null
};

const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {
    setBundle: (state, action) => {
      state.ethPriceInUSD = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setBundle, setLoading, setError } = bundleSlice.actions;
export default bundleSlice.reducer;
