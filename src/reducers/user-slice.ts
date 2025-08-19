import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@models/user-model.ts';

const initialState = {
  id: 0,
  name: '',
  username: '',
} as User;

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    unsetUser: () => {
      return initialState;
    }
  }
});

export const { setUser, unsetUser } = userSlice.actions;

export default userSlice.reducer;