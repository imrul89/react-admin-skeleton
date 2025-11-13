import { SchoolClass } from './school-class-model';

export interface PromotionPreviewStudent {
  id: number;
  student_details_id: number;
  name: string;
  student_no: string;
  roll: number;
  class: string;
  photo: string;
  already_promoted: boolean;
}

export interface PromotionPreviewResponse {
  from_year: number;
  to_year: number;
  from_class: SchoolClass;
  to_class: SchoolClass;
  total_students: number;
  already_promoted_count: number;
  students: PromotionPreviewStudent[];
}

export interface PromotionPreviewRequest {
  from_year: number;
  to_year: number;
  from_class_id: number;
  to_class_id: number;
}

export interface BulkPromotionRequest {
  from_year: number;
  to_year: number;
  from_class_id: number;
  to_class_id: number;
  exclude_student_ids?: number[];
}

export interface BulkPromotionResponse {
  success: boolean;
  from_year: number;
  to_year: number;
  from_class_id: number;
  to_class_id: number;
  total_students: number;
  promoted_count: number;
  failed_count: number;
  errors?: Array<{
    student_id: number;
    student_name?: string;
    error: string;
  }>;
}

