import { AuthRequest, AuthResponse } from '@models/auth-model';
import { UserDetails } from '@models/user-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const authService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (data) => ({
        url: API_END_POINTS.auth,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth']
    }),
    authUser: builder.query<UserDetails, void>({
      query: () => ({
        url: API_END_POINTS.user,
        method: 'GET'
      }),
      providesTags:['auth'],
      extraOptions: {
        maxRetries: 3
      }
    })
  }),
});

export const {
  useLoginMutation,
  useAuthUserQuery
} = authService;