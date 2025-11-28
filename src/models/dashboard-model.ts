export interface DashboardStats {
  overview: {
    total_students: number;
    active_students: number;
    inactive_students: number;
    new_students: number;
    old_students: number;
    total_classes: number;
    total_sections: number;
  };
  attendance: {
    total_records: number;
    present_records: number;
    absent_records: number;
    attendance_rate: number;
    school_attendance: number;
    coaching_attendance: number;
  };
  student_distribution_by_class: Array<{
    class_name: string;
    student_count: number;
  }>;
  student_distribution_by_shift: Array<{
    shift_id: number;
    shift_name: string;
    student_count: number;
  }>;
  student_distribution_by_section: Array<{
    section_name: string;
    student_count: number;
  }>;
  gender_distribution: Array<{
    gender: string;
    student_count: number;
  }>;
  monthly_attendance_rate: Array<{
    month: number;
    attendance_rate: number;
    present: number;
    total: number;
  }>;
  class_wise_attendance_rate: Array<{
    class_name: string;
    attendance_rate: number;
    present: number;
    total: number;
  }>;
  class_wise_students_by_shift: Array<{
    class_name: string;
    morning: number;
    day: number;
  }>;
}

export interface DashboardStatsQuery {
  year?: number;
  start_date?: string;
  end_date?: string;
}

