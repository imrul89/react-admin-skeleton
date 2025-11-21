export interface BulkUpdateStudentItem {
  student_id: number;
  roll?: number | null;
  gender?: 'Male' | 'Female';
  religion_id?: number;
  shift_id?: number | null;
  coaching_off?: string | null; // Comma-separated string for backend (e.g., "1,2,3")
}

export interface BulkUpdateStudentsRequest {
  class_id: number;
  shift_id: number;
  students: BulkUpdateStudentItem[];
}

export interface BulkUpdateStudentsResponse {
  success: boolean;
  updated_count: number;
  message: string;
}

