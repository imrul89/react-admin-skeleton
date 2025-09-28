import { Student, Students, StudentRequestData } from '@models/student-model';
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
    studentSaved: builder.mutation<Student, StudentRequestData>({
      query: (studentData) => {
        const requestUrl = API_END_POINTS.students;
        const requestMethod = studentData?.student.id ? 'PATCH' : 'POST';

        return {
          url: requestUrl,
          method: requestMethod,
          body: studentData
        };
      },
      invalidatesTags: ['students', 'student']
    }),
    searchStudents: builder.query<Students, string>({
      query: (searchQuery) => ({
        url: `${API_END_POINTS.students}?limit=500&offset=0&search=${searchQuery}`,
        method: 'GET'
      })
    })
  })
});

export const {
  useStudentsQuery,
  useStudentQuery,
  useLazySearchStudentsQuery,
  useStudentSavedMutation
} = studentsService;
