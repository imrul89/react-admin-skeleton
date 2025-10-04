import { useState } from 'react';
import { Card, Table, Button, Tag, Typography, Row, Col, Statistic, Modal, Form, InputNumber, Input, DatePicker, message } from 'antd';
import { PlusOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Student } from '@models/student-model';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface StudentTuitionFeeTabProps {
  student: Student;
}

interface FeeRecord {
  id: number;
  month: string;
  year: number;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'partial' | 'pending';
  discount?: number;
}

// Mock data - replace with actual API calls
const mockFeeData: FeeRecord[] = [
  {
    id: 1,
    month: 'January',
    year: 2024,
    amount: 5000,
    paidAmount: 5000,
    dueDate: '2024-01-31',
    paidDate: '2024-01-15',
    status: 'paid',
    discount: 0
  },
  {
    id: 2,
    month: 'February',
    year: 2024,
    amount: 5000,
    paidAmount: 3000,
    dueDate: '2024-02-29',
    status: 'partial',
    discount: 0
  },
  {
    id: 3,
    month: 'March',
    year: 2024,
    amount: 5000,
    paidAmount: 0,
    dueDate: '2024-03-31',
    status: 'pending',
    discount: 500
  }
];

const StudentTuitionFeeTab = ({ student }: StudentTuitionFeeTabProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [form] = Form.useForm();

  const totalAmount = mockFeeData.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = mockFeeData.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = totalAmount - totalPaid;
  const totalDiscount = mockFeeData.reduce((sum, fee) => sum + (fee.discount || 0), 0);

  const columns = [
    {
      title: 'Month/Year',
      dataIndex: 'month',
      key: 'month',
      render: (month: string, record: FeeRecord) => (
        <div>
          <Text strong>{month} {record.year}</Text>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong>৳{amount.toLocaleString()}</Text>
      )
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (paidAmount: number) => (
        <Text>৳{paidAmount.toLocaleString()}</Text>
      )
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => (
        <Text type="success">৳{discount.toLocaleString()}</Text>
      )
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) => dayjs(dueDate).format('DD MMM YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          paid: { color: 'green', icon: <CheckCircleOutlined />, text: 'Paid' },
          partial: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Partial' },
          pending: { color: 'red', icon: <ClockCircleOutlined />, text: 'Pending' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: FeeRecord) => (
        <Button
          type="link"
          size="small"
          onClick={() => handlePayment(record)}
          disabled={record.status === 'paid'}
        >
          {record.status === 'paid' ? 'Paid' : 'Make Payment'}
        </Button>
      )
    }
  ];

  const handlePayment = (fee: FeeRecord) => {
    setSelectedFee(fee);
    form.setFieldsValue({
      amount: fee.amount - fee.paidAmount,
      paidDate: dayjs()
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (values: any) => {
    try {
      // TODO: Implement payment API call
      console.log('Payment data:', values);
      message.success('Payment recorded successfully');
      setIsPaymentModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to record payment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Fee Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Amount"
              value={totalAmount}
              prefix={<DollarOutlined />}
              suffix="৳"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Paid"
              value={totalPaid}
              prefix={<CheckCircleOutlined />}
              suffix="৳"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Amount"
              value={totalPending}
              prefix={<ClockCircleOutlined />}
              suffix="৳"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Discount"
              value={totalDiscount}
              prefix={<DollarOutlined />}
              suffix="৳"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Fee Records */}
      <Card
        title="Fee Records"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Add Fee
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mockFeeData}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Payment Modal */}
      <Modal
        title={`Make Payment - ${selectedFee?.month} ${selectedFee?.year}`}
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePaymentSubmit}
        >
          <Form.Item
            label="Amount to Pay"
            name="amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={selectedFee?.amount || 0}
              formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/৳\s?|(,*)/g, '')}
            />
          </Form.Item>
          
          <Form.Item
            label="Payment Date"
            name="paidDate"
            rules={[{ required: true, message: 'Please select payment date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Input
              style={{ width: '100%' }}
              placeholder="Cash, Bank Transfer, etc."
            />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input
              style={{ width: '100%' }}
              placeholder="Additional notes (optional)"
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Record Payment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentTuitionFeeTab;
