import { SchoolClasses, SchoolClass } from '@models/school-class-model.ts';
import { Option } from '@models/utils-model.ts';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const schoolClassesService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    schoolClasses: builder.query<SchoolClasses, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.schoolClasses + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['school-classes']
    }),
    schoolClass: builder.query<SchoolClass, number>({
      query: (id) => ({
        url: API_END_POINTS.schoolClasses + `/${id}`,
        method: 'GET'
      }),
      providesTags: ['school-class']
    }),
    schoolClassSaved: builder.mutation<SchoolClass, SchoolClass>({
      query: (requestData) => {
        const requestUrl = API_END_POINTS.schoolClasses;
        const requestMethod = requestData?.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: requestData
        };
      },
      invalidatesTags: ['school-classes', 'school-class']
    }),
    schoolClassesOptions: builder.query<Option[], void>({
      query: () => ({
        url: API_END_POINTS.schoolClasses + '/options',
        method: 'GET'
      })
    })
  })
});

export const {
  useSchoolClassesQuery,
  useSchoolClassQuery,
  useSchoolClassSavedMutation,
  useSchoolClassesOptionsQuery
} = schoolClassesService;
