import { useEffect } from 'react';
import { Card, Form, Row, Col, Button, Input } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { usePermissionForm } from '@hooks/use-permissions';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { Permission, PermissionPartial } from '@models/permission-model';
import { validationMessage } from '@utils/helpers/message-helpers';

interface PermissionFormProps {
  initialValues?: PermissionPartial;
  isEditMode?: boolean;
}

const PermissionForm = ({
  initialValues,
  isEditMode = false
}: PermissionFormProps) => {
  const [form] = Form.useForm();

  const formTitle = `${isEditMode ? 'Edit ' : 'Create'} permission`;
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);

  const { onSaved, isLoading } = usePermissionForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
      ...initialValues
      });
    }
  }, [initialValues]);

  const onFinished = (values: Permission) => {
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

export default PermissionForm;
