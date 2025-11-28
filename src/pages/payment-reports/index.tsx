import { useState } from 'react';
import { Card, Form, Row, Col, Select, DatePicker, Button, App, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { useClassOptions } from '@hooks/use-school-classes';
import { useDownloadPaymentReportMutation, PaymentReportQuery } from '@services/payment-reports-service';
import { MONTHS, PAYMENT_INVOICE_TYPES } from '@utils/constants';

const { RangePicker } = DatePicker;

const PaymentReports = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { isClassOptionLoading, classOptions } = useClassOptions();
  const [downloadPaymentReport, { isLoading: isDownloading }] = useDownloadPaymentReportMutation();
  const selectedMonth = Form.useWatch('month', form);
  const selectedDateRange = Form.useWatch('date_range', form);

  const handleDownload = async () => {
    try {
      const values = await form.validateFields();

      const queryParams: PaymentReportQuery = {};

      if (values.class_id) {
        queryParams.class_id = values.class_id;
      }

      if (values.month) {
        queryParams.month = values.month;
      }

      if (values.date_range && values.date_range[0] && values.date_range[1]) {
        queryParams.start_date = values.date_range[0].format('YYYY-MM-DD');
        queryParams.end_date = values.date_range[1].format('YYYY-MM-DD');
      }

      if (values.invoice_type_id) {
        queryParams.invoice_type_id = values.invoice_type_id;
      }

      const { blob, filename } = await downloadPaymentReport(queryParams).unwrap();
      
      // Create download link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      message.success('Payment report downloaded successfully');
    } catch (error: any) {
      if (error?.errorFields) {
        // Form validation error
        return;
      }
      message.error(error?.message || 'Failed to download payment report');
    }
  };

  return (
    <>
      <PageHeader
        title="Payment Reports"
        subTitle="Generate and download payment reports in Excel format"
      />
      <PageContent>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleDownload}
          >
            <Row gutter={24}>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Class"
                  name="class_id"
                >
                  <Select
                    placeholder="Select class (optional)"
                    allowClear
                    loading={isClassOptionLoading}
                    options={classOptions}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Month"
                  name="month"
                >
                  <Select
                    placeholder="Select month (optional)"
                    allowClear
                    options={MONTHS}
                    onChange={() => {
                      // Clear date range when month is selected
                      if (selectedMonth) {
                        form.setFieldsValue({ date_range: null });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Date Range"
                  name="date_range"
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder={['Start Date', 'End Date']}
                    disabled={!!selectedMonth}
                    onChange={() => {
                      // Clear month when date range is selected
                      if (selectedDateRange && selectedDateRange[0] && selectedDateRange[1]) {
                        form.setFieldsValue({ month: null });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Payment Type"
                  name="invoice_type_id"
                  initialValue={1}
                >
                  <Select
                    placeholder="Select payment type"
                    options={[
                      { value: 1, label: 'School' },
                      { value: 2, label: 'Coaching' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      htmlType="submit"
                      loading={isDownloading}
                    >
                      Download Excel Report
                    </Button>
                    <Button onClick={() => form.resetFields()}>
                      Reset Filters
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageContent>
    </>
  );
};

export default PaymentReports;

