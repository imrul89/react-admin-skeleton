import { useState } from 'react';
import { Card, Form, Input, Select, Switch, Button, Typography, Row, Col, message, Modal } from 'antd';
import { SaveOutlined, EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Student } from '@models/student-model';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface StudentSettingsTabProps {
  student: Student;
}

const StudentSettingsTab = ({ student }: StudentSettingsTabProps) => {
  const [form] = Form.useForm();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm] = Form.useForm();

  const handleSaveSettings = async (values: any) => {
    try {
      // TODO: Implement settings save API call
      console.log('Settings data:', values);
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      // TODO: Implement password change API call
      console.log('Password change data:', values);
      message.success('Password changed successfully');
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <Card title="Account Settings" className="mb-6">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: student.status_id === 1,
            isNew: student.is_new === 1,
            coachingOff: student.coaching_off,
            discountOnCoaching: student.discount_on_coaching,
            roll: student.roll
          }}
          onFinish={handleSaveSettings}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
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
                label="New Student"
                name="isNew"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Roll Number"
                name="roll"
              >
                <Input placeholder="Enter roll number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Coaching Off"
                name="coachingOff"
              >
                <Input placeholder="Enter coaching off details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Discount on Coaching (%)"
                name="discountOnCoaching"
              >
                <Input type="number" min={0} max={100} placeholder="Enter discount percentage" />
              </Form.Item>
            </Col>
          </Row>


          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Settings
            </Button>
          </div>
        </Form>
      </Card>

      {/* Security Settings */}
      <Card title="Security Settings" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <LockOutlined className="text-lg mr-3 text-blue-500" />
              <div>
                <Title level={5} className="mb-1">Change Password</Title>
                <Text type="secondary">Update student login password</Text>
              </div>
            </div>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <UserOutlined className="text-lg mr-3 text-green-500" />
              <div>
                <Title level={5} className="mb-1">Account Access</Title>
                <Text type="secondary">Manage student account access permissions</Text>
              </div>
            </div>
            <Button type="default">
              Manage Access
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Settings" className="mb-6">
        <Form layout="vertical">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email Notifications"
                name="emailNotifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="SMS Notifications"
                name="smsNotifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Fee Reminders"
                name="feeReminders"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Attendance Alerts"
                name="attendanceAlerts"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Academic Settings */}
      <Card title="Academic Settings" className="mb-6">
        <Form layout="vertical">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Class"
                name="class"
                initialValue={student.class?.id}
              >
                <Select placeholder="Select class">
                  <Select.Option value={1}>Class 1</Select.Option>
                  <Select.Option value={2}>Class 2</Select.Option>
                  <Select.Option value={3}>Class 3</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Academic Year"
                name="academicYear"
                initialValue={student.year}
              >
                <Select placeholder="Select academic year">
                  <Select.Option value={2024}>2024</Select.Option>
                  <Select.Option value={2023}>2023</Select.Option>
                  <Select.Option value={2022}>2022</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Section"
                name="section"
              >
                <Select placeholder="Select section">
                  <Select.Option value="A">Section A</Select.Option>
                  <Select.Option value="B">Section B</Select.Option>
                  <Select.Option value="C">Section C</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Group"
                name="group"
              >
                <Select placeholder="Select group">
                  <Select.Option value="science">Science</Select.Option>
                  <Select.Option value="commerce">Commerce</Select.Option>
                  <Select.Option value="arts">Arts</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* System Information */}
      <Card title="System Information" size="small">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Text strong>Created At:</Text>
              <br />
              <Text type="secondary">
                {student.created_at ? dayjs(student.created_at).format('DD MMM YYYY HH:mm') : 'N/A'}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Text strong>Last Updated:</Text>
              <br />
              <Text type="secondary">
                {dayjs(student.updated_at).format('DD MMM YYYY HH:mm')}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Text strong>Created By:</Text>
              <br />
              <Text type="secondary">
                {student.created_by || 'N/A'}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Text strong>Updated By:</Text>
              <br />
              <Text type="secondary">
                {student.updated_by || 'N/A'}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentSettingsTab;
