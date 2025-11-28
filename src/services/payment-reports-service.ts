import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';

export interface PaymentReportQuery {
  class_id?: number;
  month?: number;
  start_date?: string;
  end_date?: string;
  invoice_type_id?: number;
}

interface DownloadResponse {
  blob: Blob;
  filename: string;
}

export const paymentReportsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    downloadPaymentReport: builder.mutation<DownloadResponse, PaymentReportQuery>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.class_id) queryParams.append('class_id', params.class_id.toString());
        if (params.month) queryParams.append('month', params.month.toString());
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        if (params.invoice_type_id) queryParams.append('invoice_type_id', params.invoice_type_id.toString());

        const queryString = queryParams.toString();
        const url = `${API_END_POINTS.paymentReports}/download${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
          responseHandler: async (response) => {
            const blob = await response.blob();
            
            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'payment-report.xlsx';
            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="(.+)"/);
              if (filenameMatch) {
                filename = filenameMatch[1];
              }
            }

            return {
              blob,
              filename
            };
          },
        };
      },
    }),
  }),
});

export const {
  useDownloadPaymentReportMutation,
} = paymentReportsService;

