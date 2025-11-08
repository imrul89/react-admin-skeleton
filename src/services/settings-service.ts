import { Setting } from '@models/setting-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const settingsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    settings: builder.query<Setting, void>({
      query: () => ({
        url: API_END_POINTS.settings,
        method: 'GET'
      }),
      providesTags: ['setting']
    }),
    updateSettings: builder.mutation<void, FormData>({
      query: (data) => ({
        url: API_END_POINTS.settings,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['setting']
    })
  })
});

export const {
  useSettingsQuery,
  useUpdateSettingsMutation
} = settingsService;

