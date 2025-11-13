import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import {
  App,
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Table,
  Alert,
  Space,
  Tag,
  Checkbox,
  Typography,
  Divider,
  Avatar,
  Modal
} from 'antd';
import { SaveOutlined, EyeOutlined, SwapOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useClassOptions } from '@hooks/use-school-classes';
import { PromotionPreviewStudent } from '@models/student-promotion-model';
import { usePromotionPreviewMutation, useBulkPromoteStudentsMutation } from '@services/student-promotion-service';

const { Text, Title } = Typography;

const StudentPromotionForm = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { isClassOptionLoading, classOptions } = useClassOptions();
  
  const [getPreview, { isLoading: isLoadingPreview }] = usePromotionPreviewMutation();
  const [promoteStudents, { isLoading: isPromoting }] = useBulkPromoteStudentsMutation();

  const [fromYear, setFromYear] = useState<number>(new Date().getFullYear());
  const [toYear, setToYear] = useState<number>(new Date().getFullYear() + 1);
  const [fromClassId, setFromClassId] = useState<number | undefined>(undefined);
  const [toClassId, setToClassId] = useState<number | undefined>(undefined);
  const [previewData, setPreviewData] = useState<any>(null);
  const [excludeStudentIds, setExcludeStudentIds] = useState<number[]>([]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: currentYear - 2 + i
  }));

  const handlePreview = async () => {
    if (!fromYear || !toYear || !fromClassId || !toClassId) {
      return;
    }

    try {
      const result = await getPreview({
        from_year: fromYear,
        to_year: toYear,
        from_class_id: fromClassId,
        to_class_id: toClassId
      }).unwrap();
      
      setPreviewData(result);
      setExcludeStudentIds([]);
    } catch (error: any) {
      console.error('Preview failed:', error);
      message.error(error?.data?.message || 'Failed to load preview');
    }
  };

  const handlePromote = async () => {
    if (!fromYear || !toYear || !fromClassId || !toClassId || !previewData) {
      return;
    }

    const studentsToPromote = previewData.students.length - excludeStudentIds.length;
    const fromClassName = (classOptions || []).find(c => c.value === fromClassId)?.label || 'selected class';
    const toClassName = (classOptions || []).find(c => c.value === toClassId)?.label || 'target class';

    Modal.confirm({
      title: 'Confirm Student Promotion',
      content: (
        <div>
          <p>Are you sure you want to promote <strong>{studentsToPromote} student(s)</strong>?</p>
          <p>From: <strong>{fromClassName}</strong> ({fromYear})</p>
          <p>To: <strong>{toClassName}</strong> ({toYear})</p>
          {excludeStudentIds.length > 0 && (
            <p style={{ color: '#faad14' }}>
              Note: {excludeStudentIds.length} student(s) will be excluded from promotion.
            </p>
          )}
        </div>
      ),
      okText: 'Yes, Promote',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const result = await promoteStudents({
            from_year: fromYear,
            to_year: toYear,
            from_class_id: fromClassId,
            to_class_id: toClassId,
            exclude_student_ids: excludeStudentIds
          }).unwrap();

          // Show success message
          message.success(`Successfully promoted ${result.promoted_count} out of ${result.total_students} students!`);
          
          // Reset form
          setPreviewData(null);
          setExcludeStudentIds([]);
          form.resetFields();
        } catch (error: any) {
          message.error(error?.data?.message || 'Promotion failed. Please try again.');
        }
      }
    });
  };

  const handleExcludeToggle = (studentId: number, checked: boolean) => {
    if (checked) {
      setExcludeStudentIds([...excludeStudentIds, studentId]);
    } else {
      setExcludeStudentIds(excludeStudentIds.filter(id => id !== studentId));
    }
  };

  const columns: ColumnsType<PromotionPreviewStudent> = [
    {
      title: 'Exclude',
      key: 'exclude',
      width: 80,
      align: 'center',
      render: (_: any, record: PromotionPreviewStudent) => (
        record.already_promoted ? (
          <CheckCircleOutlined style={{ color: 'orange' }} />
        ) : (
          <Checkbox
            checked={excludeStudentIds.includes(record.id)}
            onChange={(e) => handleExcludeToggle(record.id, e.target.checked)}
          />
        )
      )
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: PromotionPreviewStudent) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar
            src={`${__IMAGE_BASE_URL__}/uploads/students/${record.photo}`}
            alt={record.name}
            shape="circle"
            size={40}
          />
          <div>
            <Text>
              {record.name}
            </Text>
            <Text type="secondary" style={{display: 'flex', fontSize: 12}}>
              {record.student_no}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
      width: 100
    },
    {
      title: 'Current Class',
      dataIndex: 'class',
      key: 'class',
      width: 200
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: PromotionPreviewStudent) => (
        excludeStudentIds.includes(record.id) ? (
          <Tag color="red">Will Not Promote</Tag>
        ) : record.already_promoted ? (
          <Tag color="orange">Already Promoted</Tag>
        ) : (
          <Tag color="green">Will Promote</Tag>
        )
      )
    }
  ];

  const studentsToPromote = previewData?.students?.filter(
    (s: PromotionPreviewStudent) => !s.already_promoted && !excludeStudentIds.includes(s.id)
  ).length || 0;

  return (
    <Card title={<Title level={5}><SwapOutlined /> Student Class Promotion</Title>}>
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={24}>
          <Col xs={24} md={6}>
            <Form.Item label="From Year" name="from_year" initialValue={fromYear}>
              <Select
                value={fromYear}
                onChange={setFromYear}
                options={yearOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="To Year" name="to_year" initialValue={toYear}>
              <Select
                value={toYear}
                onChange={setToYear}
                options={yearOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="From Class"
              name="from_class_id"
              rules={[{ required: true, message: 'Please select source class' }]}
            >
              <Select
                placeholder="Select source class"
                loading={isClassOptionLoading}
                options={classOptions}
                value={fromClassId}
                onChange={setFromClassId}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="To Class"
              name="to_class_id"
              rules={[{ required: true, message: 'Please select target class' }]}
            >
              <Select
                placeholder="Select target class"
                loading={isClassOptionLoading}
                options={classOptions}
                value={toClassId}
                onChange={setToClassId}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={handlePreview}
              loading={isLoadingPreview}
              disabled={!fromYear || !toYear || !fromClassId || !toClassId}
            >
              Preview Promotion
            </Button>
          </Col>
        </Row>

        {previewData && (
          <>
            <Divider />

            <Row gutter={16} className="mb-4">
              <Col span={24}>
                <Card>
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                      <div className="text-center">
                        <Text type="secondary">Total Students</Text>
                        <div className="text-2xl font-bold text-blue-600">
                          {previewData.total_students}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="text-center">
                        <Text type="secondary">Will Promote</Text>
                        <div className="text-2xl font-bold text-green-600">
                          {studentsToPromote}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="text-center">
                        <Text type="secondary">Will Exclude</Text>
                        <div className="text-2xl font-bold text-red-600">
                          {excludeStudentIds.length}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="text-center">
                        <Text type="secondary">Already Promoted</Text>
                        <div className="text-2xl font-bold text-orange-600">
                          {previewData.already_promoted_count}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {previewData.already_promoted_count > 0 && (
              <Alert
                message="Some Students Already Promoted"
                description={`${previewData.already_promoted_count} student(s) have already been promoted to ${toYear}. They will be skipped automatically.`}
                type="warning"
                showIcon
                closable
                className="!mb-4"
              />
            )}

            <div className="mb-4">
              <Text strong>Promotion Details:</Text>
              <div className="mt-2">
                <Space direction="horizontal">
                  <Text>
                    Class <Tag color="blue">{previewData.from_class?.title} ({fromYear})</Tag>
                    To <Tag color="green">{previewData.to_class?.title} ({toYear})</Tag>
                  </Text>
                </Space>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={previewData.students || []}
              rowKey="id"
              pagination={{ pageSize: 50 }}
              scroll={{ x: 800 }}
              loading={isLoadingPreview}
            />

            <Row className="mt-4">
              <Col span={24} className="text-right">
                <Space>
                  <Button
                    onClick={() => {
                      setPreviewData(null);
                      setExcludeStudentIds([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handlePromote}
                    loading={isPromoting}
                    disabled={studentsToPromote === 0}
                  >
                    Promote {studentsToPromote} Student{studentsToPromote !== 1 ? 's' : ''}
                  </Button>
                </Space>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Card>
  );
};

export default StudentPromotionForm;

