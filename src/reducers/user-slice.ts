import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails } from '@models/user-model';

const initialState = {
  id: 0,
  name: '',
  username: '',
  email: '',
  status: 1,
  permissions: []
} as UserDetails;

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDetails>) => {
      return { ...state, ...action.payload };
    },
    unsetUser: () => {
      return initialState;
    }
  }
});

export const { setUser, unsetUser } = userSlice.actions;

export default userSlice.reducer;