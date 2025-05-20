import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stakingPools: [],
  loading: false,
  error: null
};


const stakingSlice = createSlice({
  name: 'staking',
  initialState,
  reducers: {
    setStakingPools: (state, action) => {
      state.stakingPools = action.payload;
    },
    setLoading: (state, action) => {

      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setStakingPools, setLoading, setError } = stakingSlice.actions;
export default stakingSlice.reducer;
