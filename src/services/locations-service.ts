import { District, Upazila } from '@models/student-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const locationsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    districts: builder.query<District[], void>({
      query: () => ({
        url: API_END_POINTS.locations + `/districts`,
        method: 'GET'
      })
    }),
    upazilas: builder.query<Upazila[], number>({
      query: (districtId) => ({
        url: API_END_POINTS.locations + `/upazilas/${districtId}`,
        method: 'GET'
      })
    }),
  })
});

export const {
  useDistrictsQuery,
  useLazyUpazilasQuery
} = locationsService;
