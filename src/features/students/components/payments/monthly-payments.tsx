import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Divider, Flex, Modal, Table, Typography } from 'antd';
import { CheckOutlined, FileOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ModalWrapper from '@components/shared/modal-wrapper';
import MonthlyPaymentDetails from '@features/students/components/payments/monthly-payment-details';
import { useTuitionFeePayments } from '@hooks/use-tuition-fee-payments';
import { TuitionFeePayment } from '@models/tuition-fee-payment-model';
import { dateFormat, formatNumber, getMonthName } from '@utils/helpers';

const MonthlyPayments = ({
  studentId,
  paymentInvoiceType
}: {
  studentId: number;
  paymentInvoiceType: number;
}) => {
  const { onLoadPayments, isPaymentLoading, payments } = useTuitionFeePayments();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TuitionFeePayment | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  
  useEffect(() => {
    onLoadPayments(studentId, paymentInvoiceType);
  }, []);
  
  const showPaymentDetails = (payment: TuitionFeePayment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };
  
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPayment(null);
  };
  
  const handleMonthCheckbox = (checked: boolean, record: TuitionFeePayment) => {
    setSelectedMonths(prev => {
      if (checked) {
        return [...prev, record.month].sort((a, b) => a - b);
      } else {
        return prev.filter(month => month < record.month);
      }
    });
  };
  
  const unpaidMonths = payments
  .filter(p => !p.amount)
  .map(p => p.month)
  .sort((a, b) => a - b);
  
  const lastSelected = selectedMonths.length > 0 ? Math.max(...selectedMonths) : null;
  
  return (
    <Card
      title="Payments"
      extra={
        <ModalWrapper
          clickArea={
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={selectedMonths.length === 0}
            >
              Make Payment
            </Button>
          }
          title="Monthly Payments"
          children={(close) => (
            <MonthlyPaymentDetails
              studentId={studentId}
              invoiceTypeId={paymentInvoiceType}
              selectedMonths={selectedMonths}
              setSelectedMonths={setSelectedMonths}
              onClose={close}
            />
          )}
        />
      }
    >
      <Table
        loading={isPaymentLoading}
        dataSource={payments}
        rowKey="id"
        pagination={false}
        size="small"
        footer={() => (
          <div className="font-semibold">
            Selected Months: {selectedMonths.length > 0 ? selectedMonths.map(m => ` ${getMonthName(m)}`).toString() : 'None'}
          </div>
        )}
      >
        <Table.Column
          title=""
          key="select"
          width={40}
          render={(_: any, record: TuitionFeePayment) => {
            const isPaid = !!record.amount;
            const isSelected = selectedMonths.includes(record.month);
            let canSelect = false;
            
            if (!isPaid) {
              if (selectedMonths.length === 0) {
                canSelect = record.month === unpaidMonths[0];
              } else if (lastSelected !== null) {
                const nextMonth = unpaidMonths[unpaidMonths.indexOf(lastSelected) + 1];
                canSelect = record.month === nextMonth || isSelected;
              }
            }
            
            return (
              <>
                {isPaid ? <CheckOutlined style={{color: '#52c41a'}} /> :
                  <Checkbox
                    checked={isSelected}
                    disabled={isPaid || !canSelect}
                    onChange={e => handleMonthCheckbox(e.target.checked, record)}
                  />
                }
              </>
            );
          }}
        />
        <Table.Column
          title="Month"
          dataIndex="month_name"
          key="month_name"
          render={(value: string) => (
            <span>{value}</span>
          )}
        />
        <Table.Column
          title="Payment Date"
          key="payment_date"
          render={(_: any, record: TuitionFeePayment) => {
            return record.invoice ? dateFormat(record.invoice.created_at) : '';
          }}
        />
        <Table.Column
          title="Amount"
          dataIndex="amount"
          key="amount"
          align="right"
          render={(value: number) => (
            <span>{!_.isEmpty(value) ? formatNumber(Number(value)) : ''}</span>
          )}
        />
        <Table.Column
          title=""
          dataIndex="action"
          key="action"
          width={60}
          align="right"
          render={(_: any, record: TuitionFeePayment) => (
            record.amount ? (
              <div style={{ position: 'relative' }}>
                <Button
                  shape="circle"
                  color="primary"
                  variant="filled"
                  icon={<FileOutlined />}
                  onClick={() => showPaymentDetails(record)}
                  className="small-table-action-button"
                />
              </div>
            ) : null
          )}
        />
      </Table>
      <Modal
        title="Payment Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Divider size="middle" />
        {selectedPayment && (
          <div>
            <Flex justify="space-between">
              <Flex gap={6}>
                <Typography.Text type="secondary">Month :</Typography.Text>
                <Typography.Text>{selectedPayment.month_name}</Typography.Text>
              </Flex>
              <Flex gap={6}>
                <Typography.Text type="secondary">Payment Date :</Typography.Text>
                <Typography.Text>
                  {selectedPayment.invoice ? dateFormat(selectedPayment.invoice.created_at) : ''}
                </Typography.Text>
              </Flex>
            </Flex>
            
            <Table
              dataSource={selectedPayment.details || []}
              rowKey="head_id"
              pagination={false}
              size="small"
              className="mt-4"
              footer={() => {
                return (
                  <div className="text-right font-bold">
                    <span className="pr-4">Total Amount :</span> {formatNumber(Number(selectedPayment.amount))}
                  </div>
                );
              }}
            >
              <Table.Column
                title="Fee Head"
                dataIndex={['head', 'title']}
                key="head_title"
                render={(value: string) => <span>{value}</span>}
              />
              <Table.Column
                title="Amount"
                dataIndex="head_amount"
                key="head_amount"
                align="right"
                render={(value: number) => <span>{!_.isEmpty(value) ? formatNumber(Number(value)) : ''}</span>}
              />
            </Table>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default MonthlyPayments;
