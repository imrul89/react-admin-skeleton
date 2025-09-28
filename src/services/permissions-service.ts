import { Permissions, Permission } from '@models/permission-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const permissionsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    permissions: builder.query<Permissions, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.permissions + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['permissions']
    }),
    permission: builder.query<Permission, number>({
      query: (id) => ({
        url: API_END_POINTS.permissions + `/${id}`,
        method: 'GET'
      }),
      providesTags: ['permission']
    }),
    permissionSaved: builder.mutation<Permission, Permission>({
      query: (requestData) => {
        const requestUrl = API_END_POINTS.permissions;
        const requestMethod = requestData?.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: requestData
        };
      },
      invalidatesTags: ['permissions', 'permission']
    })
  })
});

export const {
  usePermissionsQuery,
  usePermissionQuery,
  usePermissionSavedMutation
} = permissionsService;
