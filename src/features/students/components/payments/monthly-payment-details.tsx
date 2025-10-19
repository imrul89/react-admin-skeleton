import { useEffect } from 'react';
import { Button, Row, Col, Spin, Table } from 'antd';
import { useCalculateMonthlyPayments, useMakeMonthlyPayment } from '@hooks/use-tuition-fee-payments';
import { formatNumber, formatQueryParams, getMonthName } from '@utils/helpers';

const MonthlyPaymentDetails = ({
   studentId,
   invoiceTypeId,
   selectedMonths,
   setSelectedMonths,
   onClose
}: {
  studentId: number;
  invoiceTypeId: number;
  selectedMonths: number[];
  setSelectedMonths: (months: number[]) => void;
  onClose: () => void;
}) => {
  const {
    onCalculateMonthlyPayments,
    isCalculateMonthlyPaymentLoading,
    calculateMonthlyPayments
  } = useCalculateMonthlyPayments();
  
  const { onMakePayment, isMakingPayment, isSuccessPayment } = useMakeMonthlyPayment();
  
  const onSavePayment = () => {
    onMakePayment({
      student_id: studentId,
      invoice_type_id: invoiceTypeId,
      payment_months: selectedMonths
    });
  };
  
  useEffect(() => {
    if (isSuccessPayment) {
      setSelectedMonths([]);
      onClose();
    }
  }, [isMakingPayment, isSuccessPayment]);
  
  useEffect(() => {
    onCalculateMonthlyPayments(formatQueryParams({
      'student_id': studentId,
      'invoice_type_id': invoiceTypeId,
      'months': selectedMonths
    }));
  }, []);
  
  const tableData = calculateMonthlyPayments?.monthly_breakdown
    ? calculateMonthlyPayments.monthly_breakdown.flatMap((payment) => {
        const headRows = payment.heads.map((head) => ({
          key: `${payment.month}-${head.head_id}`,
          type: 'head',
          month: payment.month,
          fee_head: head.head_title,
          amount: head.head_amount
        }));
        const subtotalRow = {
          key: `subtotal-${payment.month}`,
          type: 'subtotal',
          month: payment.month,
          fee_head: '',
          amount: payment.amount
        };
        return [...headRows, subtotalRow];
      })
    : [];

  return (
    <Spin spinning={isCalculateMonthlyPaymentLoading}>
      <div className="mt-5">
        <Table
          dataSource={tableData}
          columns={[
            {
              title: 'Fee Head',
              dataIndex: 'fee_head',
              key: 'fee_head',
              render: (text, record) =>
                record.type === 'subtotal' ? <div className="text-right font-semibold">Subtotal ({getMonthName(record.month)}) :</div> : text
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              key: 'amount',
              align: 'right',
              width: 100,
              render: (text, record) =>
                record.type === 'subtotal' ? (
                  <span style={{ fontWeight: 'bold' }}>{text}</span>
                ) : (
                  formatNumber(text)
                )
            }
          ]}
          pagination={false}
          size="small"
          rowKey="key"
          footer={() => (
            <Row gutter={16} className="justify-end">
              <Col className="font-semibold">Total Amount :</Col>
              <Col className="w-[100px] text-right font-semibold">{formatNumber(calculateMonthlyPayments?.total_amount || 0)}</Col>
            </Row>
          )}
        />
        
        <div className="text-right font-bold mt-6">
          <Button type="primary" onClick={onSavePayment}>Make Payment</Button>
        </div>
      </div>
    </Spin>
  );
};

export default MonthlyPaymentDetails;
