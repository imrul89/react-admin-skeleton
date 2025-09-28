import { User, UserFormData, Users } from '@models/user-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const usersService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query<Users, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.users + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['users']
    }),
    user: builder.query<User, number>({
      query: (userId) => ({
        url: API_END_POINTS.users + `/${userId}`,
        method: 'GET'
      }),
      providesTags: ['user']
    }),
    userSaved: builder.mutation<User, UserFormData>({
      query: (user) => {
        const requestUrl = API_END_POINTS.users;
        const requestMethod = user?.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: user
        };
      },
      invalidatesTags: ['users', 'user']
    }),
    searchUsers: builder.query<Users, string>({
      query: (searchQuery) => ({
        url: `${API_END_POINTS.users}?limit=500&offset=0&search=${searchQuery}`,
        method: 'GET'
      })
    })
  })
});

export const {
  useUsersQuery,
  useUserQuery,
  useLazySearchUsersQuery,
  useUserSavedMutation
} = usersService;
