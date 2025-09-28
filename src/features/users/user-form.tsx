import { useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useRoleOptions } from '@hooks/use-roles';
import { useUserForm } from '@hooks/use-users';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { UserFormData, UserPartial } from '@models/user-model';
import { USER_STATUS } from '@utils/constants';
import { prepareOptions } from '@utils/helpers';
import { validationMessage } from '@utils/helpers/message-helpers';

interface UserFormProps {
  initialValues?: UserPartial;
  isEditMode?: boolean;
}

const UserForm = ({
  initialValues,
  isEditMode = false
}: UserFormProps) => {
  const [form] = Form.useForm();
  
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);
  
  const { isRoleOptionLoading, roleOptions } = useRoleOptions();
  const { onSaved, isLoading } = useUserForm();
  
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues
      });
    }

  }, [initialValues]);

  const onFinished = (values: UserFormData) => {
    values.id = isEditMode ? initialValues?.id ?? 0 : 0;
    
    if (isEditMode && !values.password) {
      delete values.password;
    }
    
    onSaved(values);
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete={'off'}
      initialValues={initialValues}
      onFinish={onFinished}
    >
      <Card title={initialValues?.id ? 'Edit user' : 'Create user'}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: validationMessage('name') }
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Roles"
              name="role_ids"
              rules={[
                { required: true, message: validationMessage('roles')}
              ]}
            >
              <Select
                mode="multiple"
                loading={isRoleOptionLoading}
                placeholder="Select Roles"
                options={roleOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: validationMessage('username') },
              ]}
            >
              <Input type="text" placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: !isEditMode, message: validationMessage('password') },
                { min: 6, message: 'Password must be at least 6 characters long!' },
              ]}
            >
              <Input type="password" placeholder="******" />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                { required: true, message: validationMessage('status') },
              ]}
            >
              <Select
                options={prepareOptions(USER_STATUS)}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Row className="my-6">
        <Col span={24} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            disabled={!isFormValid}>
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
