import type { ColumnsType } from 'antd/es/table';
import type { AlignType } from 'rc-table/lib/interface';
import { useEffect, useState } from 'react';
import { Button, Card, Divider, Dropdown, Flex, Modal, Table, Typography, Spin } from 'antd';
import { MoreOutlined, DeleteOutlined, FileOutlined, PrinterOutlined } from '@ant-design/icons';
import { useTuitionFeePaymentInvoice, useTuitionFeePaymentInvoices } from '@hooks/use-tuition-fee-payments';
import { useDeletePaymentInvoice } from '@hooks/use-tuition-fee-payments';
import { Student } from '@models/student-model';
import { TuitionFeePaymentInvoice } from '@models/tuition-fee-payment-model';
import { dateFormat, formatNumber, getMonthName } from '@utils/helpers';
import PrintInvoiceButton from './print-invoice';

const PaymentInvoices = ({
  studentId,
  paymentInvoiceType
}: {
  studentId: number;
  paymentInvoiceType: number;
}) => {
  const { onLoadInvoices, isInvoicesLoading, paymentInvoices } = useTuitionFeePaymentInvoices();
  const { onLoadInvoice, isInvoiceLoading, paymentInvoice } = useTuitionFeePaymentInvoice();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<(TuitionFeePaymentInvoice & { student?: Student }) | null>(null);
  
  const onLoadInvoiceDetails = (invoiceId: number) => {
    setIsModalVisible(true);
    onLoadInvoice(invoiceId);
  };
  
  const onPrintInvoice = (invoiceId: number) => {
    onLoadInvoice(invoiceId, true);
  };
  
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  
  const { onDeleteInvoice: confirmAndDeleteInvoice, isDeleting } = useDeletePaymentInvoice();
  
  const onDeleteInvoice = (invoiceId: number) => {
    confirmAndDeleteInvoice(invoiceId, {
      onSuccess: () => {
        if (selectedInvoice?.id === invoiceId) {
          setIsModalVisible(false);
          setSelectedInvoice(null);
        }
      }
    });
  };

  useEffect(() => {
    onLoadInvoices(studentId, paymentInvoiceType);
  }, []);
  
  useEffect(() => {
    if (!isInvoiceLoading && paymentInvoice) {
      setSelectedInvoice(paymentInvoice);
    }
  }, [isInvoiceLoading, paymentInvoice]);
  
  const topColumns: ColumnsType<TuitionFeePaymentInvoice> = [
    {
      title: 'Invoice No',
      dataIndex: 'id',
      key: 'invoice_no',
      render: (value: string) => <span>{value}</span>
    },
    {
      title: 'Payment Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (value: string) => <span>{dateFormat(value)}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'right' as AlignType,
      render: (value: number) => <span>{formatNumber(Number(value))}</span>
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'right' as AlignType,
      width: 60,
      render: (_: any, record: TuitionFeePaymentInvoice) => (
        <Dropdown
          menu={{
            items: [
              {
                key: `view-${record.id}`,
                icon: <FileOutlined />,
                label: <Typography.Link onClick={() => onLoadInvoiceDetails(record.id)}>Details</Typography.Link>
              },
              {
                key: `print-${record.id}`,
                icon: <PrinterOutlined />,
                label: <Typography.Link onClick={() => onPrintInvoice(record.id)}>Print</Typography.Link>
              },
              {
                key: `delete-${record.id}`,
                icon: <DeleteOutlined style={{ color: 'red' }} />,
                disabled: isDeleting,
                label: <Typography.Link onClick={() => onDeleteInvoice(record.id)} className="!text-red-600">Delete</Typography.Link>
              }
            ]
          }}
          trigger={['click']}
          placement="bottomLeft"
          overlayStyle={{
            minWidth: 150
          }}
        >
          <div style={{ position: 'relative' }}>
            <Button
              shape="circle"
              color="primary"
              variant="filled"
              icon={<MoreOutlined />}
              className="small-table-action-button"
            />
          </div>
        </Dropdown>
      )
    }
  ];

  return (
    <Card title="Invoices">
      <Table
        loading={isInvoicesLoading}
        dataSource={paymentInvoices}
        columns={topColumns}
        rowKey="id"
        pagination={false}
        size="small"
        footer={() => (
          <div className="text-right font-bold"></div>
        )}
      />
      
      <Modal
        title="Invoice Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        centered={true}
        footer={
          <Flex justify="space-between" className="!pt-4">
            <Button onClick={handleModalClose}>Close</Button>
            <PrintInvoiceButton invoice={selectedInvoice} />
          </Flex>
        }
      >
        <Divider size="middle" />
        <Spin spinning={isInvoiceLoading}>
          {selectedInvoice && (
            <div>
              <Flex vertical gap={6} className="!mb-4">
                <Flex justify="space-between">
                  <Flex gap={6}>
                    <Typography.Text type="secondary">Invoice No :</Typography.Text>
                    <Typography.Text>{selectedInvoice.id}</Typography.Text>
                  </Flex>
                  <Flex gap={6}>
                    <Typography.Text type="secondary">Payment Date :</Typography.Text>
                    <Typography.Text>
                      {dateFormat(selectedInvoice.created_at)}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Flex>
              
              {(() => {
                type Row = {
                  key: string;
                  type: 'head' | 'subtotal' | 'month';
                  head_title?: string;
                  head_amount?: number;
                  subtotal?: number;
                  month?: number;
                  year?: number;
                };
                
                const rows: Row[] = [];
                
                (selectedInvoice.monthly_payments || []).forEach((mp: any) => {
                  (mp.details || []).forEach((d: any) => {
                    rows.push({
                      key: `head-${d.id}`,
                      type: 'head',
                      head_title: d.head?.title || d.head_title || '',
                      head_amount: Number(d.head_amount || 0)
                    });
                  });
                  
                  rows.push({ key: `subtotal-${mp.id}`, type: 'subtotal', month: mp.month, subtotal: Number(mp.amount || 0) });
                });
                
                const columns: ColumnsType<Row> = [
                  {
                    title: 'Fee Head',
                    dataIndex: 'head_title',
                    key: 'head_title',
                    render: (value: string | undefined, record: Row) => {
                      if (record.type === 'subtotal') {
                        return <div className="font-bold text-right">Subtotal ({getMonthName(record.month || 0)}) :</div>;
                      }
                      
                      return <span>{value}</span>;
                    }
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'head_amount',
                    key: 'head_amount',
                    width: 100,
                    align: 'right' as AlignType,
                    render: (value: number | undefined, record: Row) => {
                      if (record.type === 'subtotal') {
                        return <span className="font-bold">{formatNumber(record.subtotal || 0)}</span>;
                      }
                      
                      return <span>{formatNumber(Number(value || 0))}</span>;
                    }
                  }
                ];
                
                return (
                  <Table
                    dataSource={rows}
                    columns={columns as any}
                    rowKey={(row: Row) => row.key}
                    pagination={false}
                    size="small"
                  />
                );
              })()}
              
              <div className="text-right font-bold mt-2 mr-2">
                <Flex justify="end" className="mb-2">
                  <div>Total Amount :</div>
                  <div className="w-[100px] text-right">{formatNumber(Number(selectedInvoice.total_amount))}</div>
                </Flex>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </Card>
  );
};

export default PaymentInvoices;
