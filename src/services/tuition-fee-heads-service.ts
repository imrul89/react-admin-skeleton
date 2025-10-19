import { TuitionFeeHeads, TuitionFeeHead, TuitionFeeHeadConfigRequestData } from '@models/tuition-fee-head-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const tuitionFeeHeadsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    tuitionFeeHeads: builder.query<TuitionFeeHeads, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.tuitionFeeHeads + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['tuition-fee-heads']
    }),
    tuitionFeeHead: builder.query<TuitionFeeHead, number>({
      query: (id) => ({
        url: API_END_POINTS.tuitionFeeHeads + `/${id}`,
        method: 'GET'
      }),
      providesTags: ['tuition-fee-head']
    }),
    tuitionFeeHeadSaved: builder.mutation<TuitionFeeHead, TuitionFeeHead>({
      query: (requestData) => {
        const requestUrl = API_END_POINTS.tuitionFeeHeads;
        const requestMethod = requestData?.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: requestData
        };
      },
      invalidatesTags: ['tuition-fee-heads', 'tuition-fee-head']
    }),
    tuitionFeeHeadConfigs: builder.query<TuitionFeeHead[], { typeId: number; classId: number; }>({
      query: ({ typeId, classId }) => {
        const requestUrl = API_END_POINTS.tuitionFeeHeads + `/configs/${typeId}/${classId}`;
        return {
          url: requestUrl,
          method: 'GET'
        };
      }
    }),
    tuitionFeeHeadSettingsSaved: builder.mutation<any, { classId: number; requestData: TuitionFeeHeadConfigRequestData[]; }>({
      query: ({ classId, requestData }) => {
        return {
          url: API_END_POINTS.tuitionFeeHeads + `/configs/${classId}`,
          method: 'POST',
          body: requestData
        };
      }
    })
  })
});

export const {
  useTuitionFeeHeadsQuery,
  useTuitionFeeHeadQuery,
  useTuitionFeeHeadSavedMutation,
  useLazyTuitionFeeHeadConfigsQuery,
  useTuitionFeeHeadSettingsSavedMutation
} = tuitionFeeHeadsService;
