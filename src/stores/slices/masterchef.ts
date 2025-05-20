import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  masterChef: {},
  pools: [],
  userPositions: [],
  loading: false,
  error: null
};

const masterChefSlice = createSlice({
  name: 'masterChef',
  initialState,
  reducers: {
    setMasterChefPools: (state, action) => {
      state.pools = action.payload;
    },
    setUserPositions: (state, action) => {
      state.userPositions = action.payload;
    },
    setMasterChef: (state, action) => {
      state.masterChef = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setMasterChef, setMasterChefPools, setUserPositions, setLoading, setError } = masterChefSlice.actions;
export default masterChefSlice.reducer;
