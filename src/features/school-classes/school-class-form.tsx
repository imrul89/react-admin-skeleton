import { useEffect } from 'react';
import { Card, Form, Row, Col, Button, Input, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useSchoolClassForm } from '@hooks/use-school-classes.ts';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { SchoolClass, SchoolClassPartial } from '@models/school-class-model';
import { validationMessage } from '@utils/helpers/message-helpers';

interface SchoolClassFormProps {
  initialValues?: SchoolClassPartial;
  isEditMode?: boolean;
}

const SchoolClassForm = ({
  initialValues,
  isEditMode = false
}: SchoolClassFormProps) => {
  const [form] = Form.useForm();

  const formTitle = `${isEditMode ? 'Edit ' : 'Create'} class`;
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);

  const { onSaved, isLoading } = useSchoolClassForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
      ...initialValues
      });
    }
  }, [initialValues]);

  const onFinished = (values: SchoolClass) => {
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
              label="Title"
              name="title"
              rules={[
                { required: true, message: validationMessage('Title') }
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Code"
              name="code"
              rules={[
                { required: true, message: validationMessage('Code') }
              ]}
            >
              <Input placeholder="Code" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Serial"
              name="serial"
            >
              <Select
                options={[]}
                placeholder="Select Serial"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Coaching Applicable"
              name="coaching_applicable"
            >
              <Input placeholder="Coaching Applicable" />
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

export default SchoolClassForm;
