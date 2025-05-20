import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth";
import walletReducer from "./slices/wallet";
import tokenReducer from "./slices/tokens";
import poolsReducer from "./slices/pools";
import stakingReducer from "./slices/staking";
import swapReducer from './slices/swaps';
import bundleReducer from './slices/bundle';
import masterchefReducer from './slices/masterchef';


const reducer = {
  auth: authReducer,
  wallet: walletReducer,
  tokens: tokenReducer,
  pools: poolsReducer,
  staking: stakingReducer,
  swaps: swapReducer,
  bundle: bundleReducer,
  masterChef: masterchefReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
