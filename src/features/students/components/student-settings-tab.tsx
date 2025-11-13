import { Card, Form, Input, Switch, Button, Row, Col, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Student, StudentSettingsUpdateRequest } from '@models/student-model';
import { useStudentSettings } from '@hooks/use-students';
import { MONTHS } from '@utils/constants';

interface StudentSettingsTabProps {
  student: Student;
}

const StudentSettingsTab = ({ student }: StudentSettingsTabProps) => {
  const [form] = Form.useForm();
  const { isLoading, onUpdateSettings } = useStudentSettings();

  const handleSaveSettings = (values: any) => {
    const settingsData: StudentSettingsUpdateRequest = {
      status_id: values.status ? 1 : 0,
      coaching_off: values.coachingOff && values.coachingOff.length > 0 ? values.coachingOff.join(',') : '',
      discount_on_coaching: Number(values.discountOnCoaching) || 0
    };

    onUpdateSettings(student.id, settingsData);
  };

  return (
    <Card title="Settings">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: student.status_id === 1,
          isNew: student.is_new === 1,
          coachingOff: student.coaching_off ? student.coaching_off.split(',').map(Number) : [],
          discountOnCoaching: student.discount_on_coaching
        }}
        onFinish={handleSaveSettings}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Student Status"
              name="status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Is New Student"
              name="isNew"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Coaching Off on Months"
              name="coachingOff"
              className="!mb-0"
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Select months"
                options={MONTHS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Discount on Coaching"
              name="discountOnCoaching"
              className="!mb-0"
            >
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter discount percentage"
                suffix="%"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end mt-6">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
            Save Settings
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default StudentSettingsTab;
