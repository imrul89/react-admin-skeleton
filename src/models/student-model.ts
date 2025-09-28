import dayjs from 'dayjs';
import { SchoolClass } from '@models/school-class-model';

export interface District {
  id: number;
  name: string;
}

export interface Upazila {
  id: number;
  district_id: number;
  name: string;
  district?: District;
}

export interface Address {
  id: number;
  upazila_id: number;
  address: string;
  upazila?: Upazila;
}

export interface Parent {
  id: number;
  name: string;
  occupation_id: number;
  mobile_no?: string;
  email?: string;
}

export interface StudentAddress {
  student_details_id: number;
  address_id: number;
  type: '1' | '2'; // '1' = Present, '2' = Permanent
  address?: Address;
}

export interface StudentParent {
  student_details_id: number;
  parent_id: number;
  relationship?: 'Father' | 'Mother' | 'Guardian' | 'Other';
  parent?: Parent;
}

export interface StudentDetails {
  id: number;
  student_no?: string;
  name: string;
  gender?: 'Male' | 'Female';
  religion_id?: number;
  dob?: string;
  blood_group?: string;
  mobile_no?: string;
  photo?: string;
  studentAddresses?: StudentAddress[];
  studentParents?: StudentParent[];
}

export interface Student {
  id: number;
  student_details_id: number;
  year: number;
  class_id: number;
  roll?: number;
  status_id: number;
  coaching_off?: string;
  discount_on_coaching: number;
  is_new: number;
  created_at?: string;
  created_by?: number;
  updated_at: string;
  updated_by?: number;
  deleted_at?: string;
  studentDetails?: StudentDetails;
  class?: SchoolClass;
}

export interface Students {
  students: Student[];
  totalNumberOfRows: number;
}

export type StudentPartial = Partial<Student>;

export interface StudentRequestData {
  student: {
    id?: number;
    student_details_id?: number;
    class_id?: number;
    roll?: number;
  },
  studentDetails: {
    name?: string;
    gender?: 'Male' | 'Female';
    religion_id?: number;
    dob?: string;
    blood_group?: string;
    mobile_no?: string;
  },
  parents: [
    {
      parent: {
        id?: number;
        name?: string;
        mobile_no?: string;
        occupation_id?: number;
      },
      relationship: 'Father';
    },
    {
      parent: {
        id?: number;
        name?: string;
        mobile_no?: string;
        occupation_id?: number;
      },
      relationship: 'Mother';
    }
  ],
  addresses: [
    {
      address: {
        id?: number;
        upazila_id?: number;
        address?: string;
      },
      type: '1';
    },
    {
      address: {
        id?: number;
        upazila_id?: number;
        address?: string;
      },
      type: '2';
    }
  ];
}

export interface StudentFormData {
  name?: string;
  class_id?: number;
  roll?: number;
  gender?: 'Male' | 'Female';
  religion_id?: number;
  dob?: dayjs.Dayjs | null;
  blood_group?: string;
  mobile_no?: string;
  father_name?: string;
  father_mobile_no?: string;
  father_occupation_id?: number;
  mother_name?: string;
  mother_mobile_no?: string;
  mother_occupation_id?: number;
  present_district_id?: number;
  present_upazila_id?: number;
  present_address?: string;
  permanent_district_id?: number;
  permanent_upazila_id?: number;
  permanent_address?: string;
}