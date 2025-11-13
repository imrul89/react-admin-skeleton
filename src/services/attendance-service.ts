import { 
  Attendance, 
  Attendances, 
  AttendanceQueryParams,
  ClassWiseAttendanceRequest,
  ClassWiseAttendanceResponse,
  UpdateAttendanceRequest,
  CheckAttendanceExistsRequest,
  CheckAttendanceExistsResponse
} from '@models/attendance-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const attendanceService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    attendances: builder.query<Attendances, AttendanceQueryParams>({
      query: (params) => ({
        url: API_END_POINTS.attendance,
        method: 'GET',
        params
      }),
      providesTags: ['attendance']
    }),
    studentAttendance: builder.query<Attendances, { id: number; params?: AttendanceQueryParams }>({
      query: ({ id, params }) => ({
        url: `${API_END_POINTS.attendance}/student/${id}`,
        method: 'GET',
        params
      }),
      providesTags: ['attendance']
    }),
    createClassWiseAttendance: builder.mutation<ClassWiseAttendanceResponse, ClassWiseAttendanceRequest>({
      query: (data) => ({
        url: `${API_END_POINTS.attendance}/class-wise`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['attendance']
    }),
    updateAttendance: builder.mutation<Attendance, UpdateAttendanceRequest>({
      query: (data) => ({
        url: `${API_END_POINTS.attendance}/${data.id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['attendance']
    }),
    deleteAttendance: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `${API_END_POINTS.attendance}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['attendance']
    }),
    checkAttendanceExists: builder.mutation<CheckAttendanceExistsResponse, CheckAttendanceExistsRequest>({
      query: (data) => ({
        url: `${API_END_POINTS.attendance}/check-exists`,
        method: 'POST',
        body: data
      })
    })
  })
});

export const {
  useAttendancesQuery,
  useStudentAttendanceQuery,
  useCreateClassWiseAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useCheckAttendanceExistsMutation
} = attendanceService;

