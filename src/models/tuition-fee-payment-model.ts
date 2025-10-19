import { Student } from '@models/student-model';
import { TuitionFeeHead } from '@models/tuition-fee-head-model';

export interface TuitionFeePaymentDetails {
  head_id: number;
  head_amount: number;
  head: TuitionFeeHead;
}

export interface TuitionFeePaymentInvoice {
  id: number;
  student_id: number,
  invoice_type_id: number,
  payment_mode: number,
  total_amount: number | string,
  created_at: string;
  created_user?: {
    name: string;
  }
  monthly_payments?: TuitionFeePayment[];
  student?: Student;
}

export interface TuitionFeePayment {
  id: number;
  month: number;
  month_name?: string;
  amount?: number;
  invoice: TuitionFeePaymentInvoice;
  details?: TuitionFeePaymentDetails[];
}

export interface CalculateMonthlyPayments {
  monthly_breakdown: CalculateMonthlyPayment[];
  total_amount: number;
}

export interface CalculateMonthlyPayment {
  month: number;
  heads: {
    head_id: number;
    head_title: string;
    head_amount: number;
  }[]
  amount: number;
}

export interface TuitionFeePaymentRequest {
  student_id: number;
  invoice_type_id: number;
  payment_months: number[];
}