import { Student } from './student-model';

export interface Attendance {
  id: number;
  student_id: number;
  attendance_for: number;
  status: number;
  date: string;
  created_at: string;
  created_by: number;
  student?: Student;
}

export interface Attendances {
  attendances: Attendance[];
  totalNumberOfRows: number;
}

export interface AttendanceQueryParams {
  student_id?: number;
  class_id?: number;
  roll?: number;
  status?: number;
  attendance_for?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ClassWiseAttendanceRequest {
  class_id: number;
  attendance_for: number;
  date: string;
  absent_student_ids: number[];
}

export interface ClassWiseAttendanceResponse {
  success: boolean;
  total_students: number;
  present: number;
  absent: number;
  date: string;
  class_id: number;
  attendance_for: number;
}

export interface StudentAttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  attendance_percentage: number;
}

export interface UpdateAttendanceRequest {
  id: number;
  status: number;
}

export interface CheckAttendanceExistsRequest {
  class_id: number;
  attendance_for: number;
  date: string;
}

export interface CheckAttendanceExistsResponse {
  exists: boolean;
  total_students: number;
  marked_count: number;
  attendance_ids?: number[];
}

