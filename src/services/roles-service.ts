import { Roles, Role } from '@models/role-model';
import { Option } from '@models/utils-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const rolesService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    roles: builder.query<Roles, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.roles + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['roles']
    }),
    role: builder.query<Role, number>({
      query: (id) => ({
        url: API_END_POINTS.roles + `/${id}`,
        method: 'GET'
      }),
      providesTags: ['role']
    }),
    roleSaved: builder.mutation<Role, Role>({
      query: (requestData) => {
        const requestUrl = API_END_POINTS.roles;
        const requestMethod = requestData?.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: requestData
        };
      },
      invalidatesTags: ['roles', 'role']
    }),
    roleOptions: builder.query<Option[], void>({
      query: () => ({
        url: API_END_POINTS.roles + '/options',
        method: 'GET'
      })
    }),
    savedRolePermissions: builder.mutation<void, { roleId: number; permissionIds: number[]; }>({
      query: ({ roleId, permissionIds }) => ({
        url: API_END_POINTS.roles + `/${roleId}/permissions`,
        method: 'POST',
        body: permissionIds
      }),
      invalidatesTags: ['role']
    })
  })
});

export const {
  useRolesQuery,
  useRoleQuery,
  useRoleSavedMutation,
  useRoleOptionsQuery,
  useSavedRolePermissionsMutation
} = rolesService;
