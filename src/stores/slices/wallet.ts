import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showwalletconnectmodalmobile: false,
  showwalletconnectmodaldesk: false,
  isDollar: false,
  hotwalletmenuitems: [
    { id: 0, value: "Total Volume Traded", active: true },
    { id: 1, value: "Total ADA", active: false },
    { id: 2, value: "Token Transactions", active: false },
    { id: 3, value: "NFT Transactions", active: false },
  ],
  walletprofilermenuitems: [
    { id: 0, value: "Overview", active: true },
    { id: 1, value: "Investments", active: false },
    { id: 2, value: "Associated Wallets", active: false },
    { id: 3, value: "Trade History", active: false },
    { id: 4, value: "Mint History", active: false },
    { id: 5, value: "Ownership History", active: false },
  ],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    showWalletConnectModalMobile(state) {
      state.showwalletconnectmodalmobile = !state.showwalletconnectmodalmobile;
      return;
    },
    showWalletConnectModalDesk(state) {
      state.showwalletconnectmodaldesk = !state.showwalletconnectmodaldesk;
      return;
    },
    setIsDollar(state) {
      state.isDollar = !state.isDollar;
      return;
    },
    sethotwalletmenuitems(state, action) {
      const newhotwalletmenuitems = state.hotwalletmenuitems.map(
        (item, idx) => {
          if (action.payload === idx) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        }
      );
      state.hotwalletmenuitems = newhotwalletmenuitems;
      return;
    },
    setwalletprofilermenuitems(state, action) {
      const newwalletprofilermenuitems = state.walletprofilermenuitems.map(
        (item, idx) => {
          if (action.payload === idx) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        }
      );

      state.walletprofilermenuitems = newwalletprofilermenuitems;
      return;
    },
  },
});

const { reducer, actions } = walletSlice;

export const {
  showWalletConnectModalMobile,
  showWalletConnectModalDesk,
  setIsDollar,
  sethotwalletmenuitems,
  setwalletprofilermenuitems,
} = actions;

export default reducer;
