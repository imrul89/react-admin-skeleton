import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { AuthResponse } from '@models/auth-model';
import { User } from '@models/user-model';
import { setCredentials, logOut} from '@reducers/auth-slice';
import { setRedirectPath } from '@reducers/redirect-slice';
import { setUser } from '@reducers/user-slice';
import { REDIRECT_SERVICE_END_POINTS } from '@utils/constants';
import { API_END_POINTS } from '@utils/constants/api-end-points';
import { RootState } from '@/store';

const baseUrl = process.env.API_BASE_URL as string;
const mutex = new Mutex();

const baseApi = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers: Headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken as string;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError> = async (args, api, extraOptions) => {
  
  const isFormData = args && (args as FetchArgs).body instanceof FormData;
  const headers = new Headers();
  
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  
  const requestArgs: FetchArgs = typeof args === 'string' ? { url: args } : { ...args };
  requestArgs.headers = headers;
  
  await mutex.waitForUnlock();
  
  let response = await baseApi(requestArgs, api, extraOptions);
  
  // @ts-ignore
  if (response.error && response.error.status === 401 && response.error?.data?.errors === 'Unauthorized') {
    
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken;
        
        if (refreshToken) {
          const refreshResponse = await baseApi({
              url: API_END_POINTS.refreshToken,
              method: 'POST',
              body: { refresh_token: state.auth.refreshToken }
            },
            api,
            extraOptions,
          );
          
          if (refreshResponse.error) {
            api.dispatch(logOut());
            localStorage.removeItem('auth');
          } else {
            const refreshResponseData = refreshResponse.data as AuthResponse;
            
            const authData = {
              accessToken: refreshResponseData.access_token,
              refreshToken: refreshResponseData.refresh_token
            };
            
            api.dispatch(setCredentials(authData));
            localStorage.setItem('auth', JSON.stringify(authData));
            
            headers.set('Authorization', `Bearer ${authData.accessToken}`);
            requestArgs.headers = headers;
            
            const userResponse = await baseApi({
                url: API_END_POINTS.user,
                method: 'GET'
              },
              api,
              extraOptions
            );
            
            if (userResponse.data) {
              api.dispatch(
                setUser(userResponse.data as User)
              );
            }
            
            // Retry the original request with the new token
            response = await baseApi(requestArgs, api, extraOptions);
          }
        } else {
          api.dispatch(logOut());
          localStorage.removeItem('auth');
        }
        
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      const state = api.getState() as RootState;
      const token = state.auth.accessToken;
      
      headers.set('Authorization', `Bearer ${token}`);
      requestArgs.headers = headers;
      
      response = await baseApi(requestArgs, api, extraOptions);
    }
  }
  
  if (response.error && response.error.status === 403 && REDIRECT_SERVICE_END_POINTS.includes(api.endpoint)) {
    api.dispatch(setRedirectPath('/'));
  }

  return response;
};

export default baseQueryWithReAuth;
