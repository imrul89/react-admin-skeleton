import { useEffect } from 'react';
import { Card, Form, Row, Col, Button, Input } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useRoleForm } from '@hooks/use-roles';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { Role, RolePartial } from '@models/role-model';
import { validationMessage } from '@utils/helpers/message-helpers';

interface RoleFormProps {
  initialValues?: RolePartial;
  isEditMode?: boolean;
}

const RoleForm = ({
  initialValues,
  isEditMode = false
}: RoleFormProps) => {
  const [form] = Form.useForm();

  const formTitle = `${isEditMode ? 'Edit ' : 'Create'} role`;
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);

  const { onSaved, isLoading } = useRoleForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
      ...initialValues
      });
    }
  }, [initialValues]);

  const onFinished = (values: Role) => {
    values.id = isEditMode ? initialValues?.id ?? 0 : 0;
    onSaved(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={initialValues}
      onFinish={onFinished}
    >
      <Card title={formTitle}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: validationMessage('Name') }
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Description"
              name="description"
            >
              <Input placeholder="Description" />
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
            disabled={!isFormValid}
          >
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default RoleForm;
