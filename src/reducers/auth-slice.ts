import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState } from '@models/auth-model';

const initialState = {
  accessToken: null,
  refreshToken: null,
} as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const { accessToken, refreshToken } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logOut: () => initialState
  }
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;