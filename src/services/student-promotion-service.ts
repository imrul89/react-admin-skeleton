import {
  BulkPromotionRequest,
  BulkPromotionResponse,
  PromotionPreviewRequest,
  PromotionPreviewResponse
} from '@models/student-promotion-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const studentPromotionService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    promotionPreview: builder.mutation<PromotionPreviewResponse, PromotionPreviewRequest>({
      query: (data) => ({
        url: `${API_END_POINTS.students}/promotion/preview`,
        method: 'POST',
        body: data
      })
    }),
    bulkPromoteStudents: builder.mutation<BulkPromotionResponse, BulkPromotionRequest>({
      query: (data) => ({
        url: `${API_END_POINTS.students}/promotion/bulk`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['students', 'student']
    })
  })
});

export const {
  usePromotionPreviewMutation,
  useBulkPromoteStudentsMutation
} = studentPromotionService;

