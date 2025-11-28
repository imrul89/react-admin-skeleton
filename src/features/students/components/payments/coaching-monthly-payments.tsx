import _ from 'lodash';
import { useEffect, useState, useMemo } from 'react';
import { Button, Card, Checkbox, Divider, Flex, Modal, Table, Typography } from 'antd';
import { CheckOutlined, FileOutlined, PlusCircleOutlined, HomeOutlined, UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ModalWrapper from '@components/shared/modal-wrapper';
import MonthlyPaymentDetails from '@features/students/components/payments/monthly-payment-details';
import { useTuitionFeePayments } from '@hooks/use-tuition-fee-payments';
import { useLazyTuitionFeeHeadConfigsQuery } from '@services/tuition-fee-heads-service';
import { TuitionFeePayment } from '@models/tuition-fee-payment-model';
import { Student } from '@models/student-model';
import { PAYMENT_INVOICE_TYPES } from '@utils/constants';
import { dateFormat, formatNumber, getMonthName } from '@utils/helpers';

const CoachingMonthlyPayments = ({
  studentId,
  student
}: {
  studentId: number;
  student: Student;
}) => {
  const { onLoadPayments, isPaymentLoading, payments } = useTuitionFeePayments();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TuitionFeePayment | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  
  // Fetch coaching fee head configs
  const [loadCoachingConfigs, { data: coachingFeeHeads }] = useLazyTuitionFeeHeadConfigsQuery();
  
  useEffect(() => {
    if (student?.class_id) {
      loadCoachingConfigs({ typeId: 2, classId: student.class_id });
    }
  }, [student?.class_id, loadCoachingConfigs]);
  
  useEffect(() => {
    onLoadPayments(studentId, PAYMENT_INVOICE_TYPES.COACHING);
  }, []);
  
  // Get class coaching applicable months
  const classCoachingMonths = useMemo(() => {
    if (!student?.class?.coaching_applicable) {
      return [];
    }
    return student.class.coaching_applicable.split(',').map(Number).filter(n => !isNaN(n) && n >= 1 && n <= 12);
  }, [student?.class?.coaching_applicable]);

  // Get student's coaching off months
  const studentCoachingOffMonths = useMemo(() => {
    if (!student?.coaching_off) {
      return [];
    }
    return student.coaching_off.split(',').map(Number).filter(n => !isNaN(n));
  }, [student?.coaching_off]);

  // Calculate enabled months for coaching payments
  const enabledMonths = useMemo(() => {
    if (classCoachingMonths.length === 0) {
      return [];
    }
    
    // Get all months configured in coaching fee heads (if available)
    let configuredMonths = new Set<number>(classCoachingMonths);
    if (coachingFeeHeads && coachingFeeHeads.length > 0) {
      const feeHeadMonths = new Set<number>();
      coachingFeeHeads.forEach(head => {
        head.configs?.forEach(config => {
          config.months?.forEach(month => {
            feeHeadMonths.add(month);
          });
        });
      });
      // Intersection: months that are in both class coaching_applicable AND fee head configs
      if (feeHeadMonths.size > 0) {
        configuredMonths = new Set(
          classCoachingMonths.filter(month => feeHeadMonths.has(month))
        );
      }
    }
    
    // Enabled months = configured months that are NOT in student coaching_off
    const enabled = Array.from(configuredMonths).filter(
      month => !studentCoachingOffMonths.includes(month)
    );
    
    return enabled;
  }, [classCoachingMonths, studentCoachingOffMonths, coachingFeeHeads]);
  
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
        return prev.filter(month => month !== record.month);
      }
    });
  };
  
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
              invoiceTypeId={PAYMENT_INVOICE_TYPES.COACHING}
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
          width={60}
          render={(_: any, record: TuitionFeePayment) => {
            const isPaid = !!record.amount;
            const isSelected = selectedMonths.includes(record.month);
            const isMonthEnabled = enabledMonths.includes(record.month);
            const isInClassCoaching = classCoachingMonths.includes(record.month);
            const isInStudentCoachingOff = studentCoachingOffMonths.includes(record.month);
            
            // If paid, show checkmark
            if (isPaid) {
              return <CheckOutlined style={{color: '#52c41a'}} />;
            }
            
            // If month is not in class coaching applicable, show home cross icon
            if (!isInClassCoaching) {
              return (
                <span style={{ color: '#ff4d4f' }} title="Coaching not applicable for this class">
                  <HomeOutlined /> <CloseCircleOutlined />
                </span>
              );
            }
            
            // If month is in student coaching off, show user cross icon
            if (isInStudentCoachingOff) {
              return (
                <span style={{ color: '#ff4d4f' }} title="Coaching off for this student">
                  <UserOutlined /> <CloseCircleOutlined />
                </span>
              );
            }
            
            // Month is enabled, show checkbox
            return (
              <Checkbox
                checked={isSelected}
                disabled={false}
                onChange={e => handleMonthCheckbox(e.target.checked, record)}
              />
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

export default CoachingMonthlyPayments;

