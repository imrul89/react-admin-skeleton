import { Student, Students, StudentSettingsUpdateRequest } from '@models/student-model';
import { BulkUpdateStudentsRequest, BulkUpdateStudentsResponse } from '@models/student-bulk-update-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const studentsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    students: builder.query<Students, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.students + `?${queryParams}`,
        method: 'GET'
      }),
      providesTags: ['students']
    }),
    student: builder.query<Student, number>({
      query: (studentId) => ({
        url: API_END_POINTS.students + `/${studentId}`,
        method: 'GET'
      }),
      providesTags: ['student']
    }),
    studentSaved: builder.mutation<Student, { id?: number, formData: FormData }>({
      query: ({ id, formData }) => {
        const requestUrl = API_END_POINTS.students;
        const requestMethod = id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: formData
        };
      },
      invalidatesTags: ['students', 'student']
    }),
    updateStudentSettings: builder.mutation<Student, { id: number, data: StudentSettingsUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `${API_END_POINTS.students}/student-settings/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['students', 'student']
    }),
    searchStudents: builder.query<Students, string>({
      query: (searchQuery) => ({
        url: `${API_END_POINTS.students}?limit=500&offset=0&search=${searchQuery}`,
        method: 'GET'
      })
    }),
    classWiseStudents: builder.query<{
      id: number;
      studentDetails: {
        name: string;
      };
      roll: number;
    }[], { classId: number }>({
      query: ({ classId }) => ({
        url: `${API_END_POINTS.students}/class-wise-students/${classId}`,
        method: 'GET'
      })
    }),
    bulkAssignSection: builder.mutation<{
      success: boolean;
      message: string;
      updated_count: number;
      students: Student[];
    }, {
      class_id: number;
      student_ids: number[];
      section_id?: number | null;
    }>({
      query: (data) => ({
        url: `${API_END_POINTS.students}/assign-section`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['students', 'student']
    }),
    bulkUpdateStudents: builder.mutation<BulkUpdateStudentsResponse, BulkUpdateStudentsRequest>({
      query: (data) => ({
        url: `${API_END_POINTS.students}/bulk-update`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['students', 'student']
    })
  })
});

export const {
  useStudentsQuery,
  useStudentQuery,
  useLazySearchStudentsQuery,
  useStudentSavedMutation,
  useUpdateStudentSettingsMutation,
  useLazyClassWiseStudentsQuery,
  useBulkAssignSectionMutation,
  useBulkUpdateStudentsMutation
} = studentsService;
