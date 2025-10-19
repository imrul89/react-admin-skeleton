import {
  CalculateMonthlyPayments,
  TuitionFeePayment, TuitionFeePaymentInvoice,
  TuitionFeePaymentRequest
} from '@models/tuition-fee-payment-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export const tuitionFeePaymentsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    tuitionFeePayments: builder.query<TuitionFeePayment[], {
      studentId: number;
      invoiceTypeId: number;
    }>({
      query: ({ studentId, invoiceTypeId }) => ({
        url: API_END_POINTS.tuitionFeePayments + `/${studentId}/${invoiceTypeId}`,
        method: 'GET'
      }),
      providesTags: ['tuition-fee-payments']
    }),
    calculateMonthlyPayments: builder.query<CalculateMonthlyPayments, string>({
      query: (queryParams) => ({
        url: API_END_POINTS.tuitionFeePayments + `/calculate-monthly-payment?${queryParams}`,
        method: 'GET'
      })
    }),
    makeMonthlyPayments: builder.mutation<any, TuitionFeePaymentRequest>({
      query: (requestData) => {
        return {
          url: API_END_POINTS.tuitionFeePayments,
          method: 'POST',
          body: requestData
        };
      },
      invalidatesTags: ['tuition-fee-payments', 'tuition-fee-payment-invoices']
    }),
    paymentInvoices: builder.query<TuitionFeePaymentInvoice[], {
      studentId: number;
      invoiceTypeId: number;
    }>({
      query: ({ studentId, invoiceTypeId }) => ({
        url: API_END_POINTS.tuitionFeePayments + `/invoices/${studentId}/${invoiceTypeId}`,
        method: 'GET'
      }),
      providesTags: ['tuition-fee-payment-invoices']
    }),
    paymentInvoice: builder.query<TuitionFeePaymentInvoice, {
      invoiceId: number;
    }>({
      query: ({ invoiceId }) => ({
        url: API_END_POINTS.tuitionFeePayments + `/invoices/${invoiceId}`,
        method: 'GET'
      }),
      providesTags: ['tuition-fee-payment-invoice']
    }),
    deletePaymentInvoice: builder.mutation<any, { invoiceId: number }>({
      query: ({ invoiceId }) => ({
        url: API_END_POINTS.tuitionFeePayments + `/invoices/${invoiceId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['tuition-fee-payments', 'tuition-fee-payment-invoices']
    }),
  })
});

export const {
  useLazyTuitionFeePaymentsQuery,
  useLazyCalculateMonthlyPaymentsQuery,
  useMakeMonthlyPaymentsMutation,
  useLazyPaymentInvoicesQuery,
  useLazyPaymentInvoiceQuery,
  useDeletePaymentInvoiceMutation
} = tuitionFeePaymentsService;
