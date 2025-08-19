import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RedirectState {
  path: string | null;
}

const initialState: RedirectState = {
  path: null,
};

const redirectSlice = createSlice({
  name: 'redirect',
  initialState,
  reducers: {
    setRedirectPath(state, action: PayloadAction<string>) {
      state.path = action.payload;
    },
    clearRedirectPath(state) {
      state.path = null;
    },
  },
});

export const { setRedirectPath, clearRedirectPath } = redirectSlice.actions;
export default redirectSlice.reducer;
