import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authSlice from '@reducers/auth-slice';
import redirectSlice from '@reducers/redirect-slice';
import userSlice from '@reducers/user-slice';
import baseService from '@services/core/base-service';

const appReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  redirect: redirectSlice,
  [baseService.reducerPath]: baseService.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logOut') {
    state = undefined;
  }
  
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat([
      baseService.middleware
    ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
