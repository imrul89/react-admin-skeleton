import { Sections, Section } from '@models/section-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const sectionService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    sections: builder.query<Sections, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.sections + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['sections']
    }),
    section: builder.query<Section, number>({
      query: (id) => ({
        url: API_END_POINTS.sections + `/${id}`,
        method: 'GET'
      }),
      providesTags: ['section']
    }),
    sectionSaved: builder.mutation<Section, Section>({
      query: (requestData) => {
        const requestUrl = API_END_POINTS.sections;
        const requestMethod = requestData?.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: requestData
        };
      },
      invalidatesTags: ['sections', 'section']
    }),
    sectionsByClass: builder.query<Section[], number>({
      query: (classId) => ({
        url: API_END_POINTS.sections + `/by-class/${classId}`,
        method: 'GET'
      })
    })
  })
});

export const {
  useSectionsQuery,
  useSectionQuery,
  useSectionSavedMutation,
  useSectionsByClassQuery
} = sectionService;

