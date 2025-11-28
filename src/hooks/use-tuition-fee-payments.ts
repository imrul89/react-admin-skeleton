import { useContext, useEffect, useState } from 'react';
import { App, Modal } from 'antd';
import SettingsContext from '@contexts/settings-context.tsx';
import { printInvoice } from '@features/students/components/payments/print-invoice.tsx';
import { TuitionFeePayment, TuitionFeePaymentRequest } from '@models/tuition-fee-payment-model';
import { AppError } from '@models/utils-model';
import {
  useLazyCalculateMonthlyPaymentsQuery, useLazyPaymentInvoiceQuery, useLazyPaymentInvoicesQuery,
  useLazyTuitionFeePaymentsQuery,
  useMakeMonthlyPaymentsMutation,
  useDeletePaymentInvoiceMutation
} from '@services/tuition-fee-payments-service';
import { MONTHS } from '@utils/constants';
import { useAppSelector } from '@/store';

export const useTuitionFeePayments = () => {
  const [tuitionFeePayments, setTuitionFeePayments] = useState<TuitionFeePayment[]>([]);
  const [onLoad, { isLoading, data: response, isSuccess }] = useLazyTuitionFeePaymentsQuery();

  const onLoadPayments = (studentId: number, invoiceTypeId: number) => {
    onLoad({ studentId, invoiceTypeId });
  };
  
  useEffect(() => {
    if (isSuccess && response) {
      
       const allMonthPayments = MONTHS.map(month => {
         const payment = response.find(p => p.month === month.value);
         
         return {
           month: month.value,
           month_name: month.label,
           ...(payment && {
             amount: payment.amount,
             details: payment.details,
             invoice: payment.invoice
           })
         };
       }) as TuitionFeePayment[];
       
      setTuitionFeePayments(allMonthPayments);
    }
  }, [isSuccess, response]);
  
  return {
    onLoadPayments,
    isPaymentLoading: isLoading,
    payments: tuitionFeePayments
  };
};

export const useCalculateMonthlyPayments = () => {
  const [onCalculate, { isLoading, data }] = useLazyCalculateMonthlyPaymentsQuery();

  const onCalculateMonthlyPayments = (queryParams: string) => {
    onCalculate(queryParams);
  };
  
  return {
    onCalculateMonthlyPayments,
    isCalculateMonthlyPaymentLoading: isLoading,
    calculateMonthlyPayments: data
  };
};

export const useMakeMonthlyPayment = () => {
  const { message } = App.useApp();
  
  const [makePayment, { isLoading, isSuccess, isError, error }] = useMakeMonthlyPaymentsMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Tuition fee head saved successfully.');
    }

    if (isError && error) {
      message.error((error as AppError).data.errors);
    }
  }, [isSuccess, isError, error]);

  const onMakePayment = (paymentRequestData: TuitionFeePaymentRequest) => {
    Modal.confirm({
      title: 'Confirm Payment',
      content: 'Are you sure you want to proceed with the payment?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        return await makePayment(paymentRequestData).unwrap();
      }
    });
  };

  return {
    onMakePayment,
    isMakingPayment: isLoading,
    isSuccessPayment: isSuccess
  };
};

export const useTuitionFeePaymentInvoices = () => {
  const [onLoad, { isLoading, data }] = useLazyPaymentInvoicesQuery();
  
  const onLoadInvoices = (studentId: number, invoiceTypeId: number) => {
    onLoad({ studentId, invoiceTypeId });
  };
  
  return {
    onLoadInvoices,
    isInvoicesLoading: isLoading,
    paymentInvoices: data
  };
};

export const useTuitionFeePaymentInvoice = () => {
  const user = useAppSelector((state) => state.user);
  const { settings } = useContext(SettingsContext);
  
  const [isDirectPrint, setIsDirectPrint] = useState(false);
  const [onLoad, { isLoading, data }] = useLazyPaymentInvoiceQuery();
  
  const onLoadInvoice = (invoiceId: number, isDirectPrint = false) => {
    setIsDirectPrint(isDirectPrint);
    onLoad({ invoiceId });
  };
  
  useEffect(() => {
    if (isDirectPrint && data) {
      printInvoice(data, settings, user.year);
    }
  }, [isLoading, data]);
  
  return {
    onLoadInvoice,
    isInvoiceLoading: isLoading,
    paymentInvoice: data
  };
};

export const useDeletePaymentInvoice = () => {
  const { message } = App.useApp();
  const [deleteInvoice, { isLoading }] = useDeletePaymentInvoiceMutation();

  const onDeleteInvoice = (invoiceId: number, opts?: { onSuccess?: () => void }) => {
    Modal.confirm({
      title: 'Delete Invoice',
      content: 'Are you sure you want to delete this invoice?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteInvoice({ invoiceId }).unwrap();
          message.success('Invoice deleted successfully');
          
          if (opts?.onSuccess) {
            opts.onSuccess();
          }
        } catch (err) {
          message.error((err as AppError)?.data?.errors || 'Failed to delete invoice');
        }
      }
    });
  };

  return {
    onDeleteInvoice,
    isDeleting: isLoading
  };
};
