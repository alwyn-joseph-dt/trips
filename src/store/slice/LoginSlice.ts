import { createSlice } from "@reduxjs/toolkit";

interface LoginState {
  userLoginInfo: Record<string, unknown>;
  token: Record<string, unknown>;
  tokenObj: Record<string, unknown>;
  authShareToken?:string
}

const initialState: LoginState = {
  userLoginInfo: {},
  token: {},
  tokenObj: {},
  authShareToken:''
};

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.userLoginInfo = {};
      state.token = {};
      state.tokenObj = {};
    },
    setAuthTokens: (state, action) => {
      // Store in both token and tokenObj for compatibility
      state.token = action.payload;
      state.tokenObj = action.payload;
    },
    setAuthShareToken:(state, action)=>{
      state.authShareToken = action.payload
    }
  },
  // Removed extraReducers since we no longer have the login API
  // The setAuthTokens action is now the primary way to set authentication data
});
export const { logout, setAuthTokens, setAuthShareToken } = loginSlice.actions;
export default loginSlice.reducer;